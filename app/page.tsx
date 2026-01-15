'use client'

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Upload, 
  Building2, 
  Users, 
  Newspaper, 
  TrendingUp, 
  FileText, 
  BookOpen, 
  Bell, 
  Settings, 
  History, 
  Bookmark, 
  RefreshCw,
  Check,
  X,
  Sparkles,
  Trash2,
  Copy,
  Download
} from 'lucide-react';
import { AgGridWrapper, AgGridWrapperRef } from '@/components/ui/ag-grid-wrapper';
import { columnDefsMap, TabId, tabConfigs } from '@/lib/grid-columns';
import { buildNewsColumnDefs, NEWS_CSV_HEADERS } from '@/lib/news/schema';
import { sampleDataMap, getEmptyData } from '@/lib/sample-data';
import { searchWithGoogle } from '@/lib/search-apis';
import { useNewsSearch } from '@/hooks/useNewsSearch';

// Icon map for tabs
const iconMap = {
  'building': Building2,
  'users': Users,
  'newspaper': Newspaper,
  'trending-up': TrendingUp,
  'file-text': FileText,
  'book-open': BookOpen,
};

// ============================================================================
// SearchHeader Component
// ============================================================================
interface SearchHeaderProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

function SearchHeader({ searchQuery, onSearchQueryChange, onSearch, isSearching }: SearchHeaderProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      onSearch();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input & Button */}
        <div className="flex-1 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your target market, e.g. 'AI meeting transcription tools for enterprises'"
              className="w-full pl-12 pr-4 py-3.5 text-base border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={onSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-indigo-400 disabled:to-indigo-400 text-white rounded-xl font-semibold flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed min-w-[140px] justify-center"
          >
            {isSearching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
        
        {/* Upload CSV Block */}
        <div className="flex items-center gap-3 lg:border-l lg:pl-4 border-gray-200">
          <div className="text-sm text-gray-500 hidden md:block">or</div>
          <button className="px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex items-center gap-2 text-gray-600 hover:text-indigo-600">
            <Upload className="w-4 h-4" />
            <span className="font-medium">Upload CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CategoryTabs Component
// ============================================================================
interface CategoryTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  resultCounts: Record<TabId, number>;
}

function CategoryTabs({ activeTab, onTabChange, resultCounts }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {tabConfigs.map((tab) => {
        const Icon = iconMap[tab.icon as keyof typeof iconMap];
        const isActive = activeTab === tab.id;
        const count = resultCounts[tab.id] || 0;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all
              ${isActive 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {count > 0 && (
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-semibold
                ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}
              `}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// ResultsToolbar Component
// ============================================================================
interface ResultsToolbarProps {
  selectedCount: number;
  onMatch: () => void;
  onNotMatch: () => void;
  onFindLookalikes: () => void;
  onEnrich: () => void;
  onDelete: () => void;
  activeTab: TabId;
  significanceMin: number;
  relevanceMin: number;
  onSignificanceChange: (value: number) => void;
  onRelevanceChange: (value: number) => void;
}

function ResultsToolbar({
  selectedCount,
  onMatch,
  onNotMatch,
  onFindLookalikes,
  onEnrich,
  onDelete,
  activeTab,
  significanceMin,
  relevanceMin,
  onSignificanceChange,
  onRelevanceChange
}: ResultsToolbarProps) {
  const hasSelection = selectedCount > 0;
  
  return (
    <div className="flex items-center justify-between py-3 px-1">
      <div className="flex items-center gap-2">
        {/* Match / Not Match toggles */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={onMatch}
            disabled={!hasSelection}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm text-green-700"
          >
            <Check className="w-3.5 h-3.5" />
            Match
          </button>
          <button
            onClick={onNotMatch}
            disabled={!hasSelection}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm text-red-600"
          >
            <X className="w-3.5 h-3.5" />
            Not Match
          </button>
        </div>
        
        <div className="h-6 w-px bg-gray-200 mx-1" />
        
        {/* Action Buttons */}
        <button
          onClick={onFindLookalikes}
          disabled={!hasSelection}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
        >
          <Copy className="w-3.5 h-3.5" />
          Find Lookalikes
        </button>
        
        <button
          onClick={onEnrich}
          disabled={!hasSelection}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Enrich
        </button>
        
        <button
          onClick={onDelete}
          disabled={!hasSelection}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>

        {/* News Filters - only show for news tab */}
        {activeTab === 'news' && (
          <>
            <div className="h-6 w-px bg-gray-200 mx-1" />

            {/* Significance Slider */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                Significance min {significanceMin.toFixed(1)}
              </span>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={significanceMin}
                onChange={(e) => onSignificanceChange(parseFloat(e.target.value))}
                className="w-20 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Relevance Slider */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                Relevance min {relevanceMin.toFixed(1)}
              </span>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={relevanceMin}
                onChange={(e) => onRelevanceChange(parseFloat(e.target.value))}
                className="w-20 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {hasSelection && (
          <span className="text-sm text-gray-500 font-medium">
            {selectedCount} selected
          </span>
        )}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200">
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// ResultsPanel Component
// ============================================================================
interface ResultsPanelProps {
  activeTab: TabId;
  results: Record<TabId, any[]>;
  isSearching: boolean;
  newsLoading: boolean;
  newsError: string | null;
  selectedRows: any[];
  onSelectionChanged: (rows: any[]) => void;
  gridRef: React.RefObject<AgGridWrapperRef | null>;
  significanceMin: number;
  relevanceMin: number;
  onSignificanceChange: (value: number) => void;
  onRelevanceChange: (value: number) => void;
  getRowClass?: (params: any) => string;
  onMatch: () => void;
  onNotMatch: () => void;
  onFindLookalikes: () => void;
  onEnrich: () => void;
  onDelete: () => void;
}

function ResultsPanel({
  activeTab,
  results,
  isSearching,
  newsLoading,
  newsError,
  selectedRows,
  onSelectionChanged,
  gridRef,
  significanceMin,
  relevanceMin,
  onSignificanceChange,
  onRelevanceChange,
  getRowClass,
  onMatch,
  onNotMatch,
  onFindLookalikes,
  onEnrich,
  onDelete
}: ResultsPanelProps) {
  const newsColumnDefs = useMemo(() => buildNewsColumnDefs(NEWS_CSV_HEADERS), []);
  const columnDefs = useMemo(
    () => (activeTab === 'news' ? newsColumnDefs : columnDefsMap[activeTab]),
    [activeTab, newsColumnDefs]
  );
  const rowData = useMemo(
    () => (activeTab === 'news' ? results.news || [] : results[activeTab] || []),
    [results, activeTab]
  );
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 border-b border-gray-100">
        <ResultsToolbar
          selectedCount={selectedRows.length}
          onMatch={onMatch}
          onNotMatch={onNotMatch}
          onFindLookalikes={onFindLookalikes}
          onEnrich={onEnrich}
          onDelete={onDelete}
          activeTab={activeTab}
          significanceMin={significanceMin}
          relevanceMin={relevanceMin}
          onSignificanceChange={onSignificanceChange}
          onRelevanceChange={onRelevanceChange}
        />
      </div>
      
      {/* Grid */}
      <div className="relative">
        {activeTab === 'news' && newsError && (
          <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-red-700 text-sm">
            {newsError}
          </div>
        )}
        {activeTab === 'news' && newsLoading && (
          <div className="px-4 py-2 text-xs text-gray-500">Loading...</div>
        )}
        <AgGridWrapper
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          height="calc(100vh - 320px)"
          loading={isSearching}
          onSelectionChanged={onSelectionChanged}
          emptyMessage={`No ${activeTab} found. Run a search to populate results.`}
          rowSelection="multiple"
          checkboxSelection={true}
          pagination={true}
          paginationPageSize={20}
          getRowClass={getRowClass}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================
export default function Page() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>('companies');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Record<TabId, any[]>>(getEmptyData());
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { rows: newsRows, loading: newsLoading, error: newsError, runSearch: runNewsSearch } = useNewsSearch();

  // News filter states
  const [significanceMin, setSignificanceMin] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('news-significance-min');
      return saved ? parseFloat(saved) : 1.0;
    }
    return 1.0;
  });
  const [relevanceMin, setRelevanceMin] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('news-relevance-min');
      return saved ? parseFloat(saved) : 1.0;
    }
    return 1.0;
  });

  const gridRef = useRef<AgGridWrapperRef>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Persist slider values to localStorage
  useEffect(() => {
    localStorage.setItem('news-significance-min', significanceMin.toString());
  }, [significanceMin]);

  useEffect(() => {
    localStorage.setItem('news-relevance-min', relevanceMin.toString());
  }, [relevanceMin]);

  // Filter news data based on slider values
  const filteredNews = useMemo(() => {
    return newsRows.filter(item => {
      const significance = typeof item.significance_score === 'number' ? item.significance_score : typeof item.significance_score === 'string' ? parseFloat(item.significance_score) || 0 : 0;
      const relevance = typeof item.relevance_score === 'number' ? item.relevance_score : typeof item.relevance_score === 'string' ? parseFloat(item.relevance_score) || 0 : 0;
      return significance >= significanceMin && relevance >= relevanceMin;
    });
  }, [newsRows, significanceMin, relevanceMin]);

  // Create filtered results object
  const filteredResults = useMemo(() => ({
    ...results,
    news: filteredNews,
  }), [results, filteredNews]);

  // Row class function for match status styling
  const getRowClass = useCallback((params: any) => {
    const matchStatus = params.data?.matchStatus;
    if (matchStatus === 'match') {
      return 'row-match';
    } else if (matchStatus === 'not-match') {
      return 'row-not-match';
    }
    return '';
  }, []); // Row background styling function

  // Calculate result counts per tab (use filtered results for news)
  const resultCounts = useMemo(() => ({
    companies: filteredResults.companies.length,
    people: filteredResults.people.length,
    news: filteredResults.news.length,
    signals: filteredResults.signals.length,
    market: filteredResults.market.length,
    patents: filteredResults.patents.length,
    'research-papers': filteredResults['research-papers'].length,
  }), [filteredResults]);
  
  // Search handler
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    if (activeTab === 'news') {
      setSelectedRows([]);
      await runNewsSearch(searchQuery, 25);
      return;
    }
    
    setIsSearching(true);
    setError(null);
    setSelectedRows([]);
    
    try {
      // Call the search API
      const companies = await searchWithGoogle(searchQuery);
      
      // Transform API results to match our grid format
      const transformedCompanies = companies.map((company, index) => ({
        id: company.id || `company-${index}`,
        name: company.name,
        description: company.description,
        location: company.location || 'N/A',
        founded: company.founded || 'N/A',
        employees: company.employees || 'N/A',
        status: company.status === 'validated' ? 'Active' : 'Pending',
        revenue: company.funding || 'N/A',
        people: Math.floor(Math.random() * 10),
        news: Math.floor(Math.random() * 8),
        logo: company.logo || '/placeholder.svg',
      }));
      
      // If API returns results, use them; otherwise use sample data for demo
      const finalCompanies = transformedCompanies.length > 0 
        ? transformedCompanies 
        : sampleDataMap.companies;
      
      // Update results for all tabs (for demo, use sample data for other tabs)
      setResults({
        companies: finalCompanies,
        people: sampleDataMap.people,
        news: sampleDataMap.news,
        signals: sampleDataMap.signals,
        market: sampleDataMap.market,
        patents: sampleDataMap.patents,
        'research-papers': sampleDataMap['research-papers'],
      });
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Using demo data.');
      
      // Fall back to sample data
      setResults({
        companies: sampleDataMap.companies,
        people: sampleDataMap.people,
        news: sampleDataMap.news,
        signals: sampleDataMap.signals,
        market: sampleDataMap.market,
        patents: sampleDataMap.patents,
        'research-papers': sampleDataMap['research-papers'],
      });
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, activeTab, runNewsSearch]);
  
  // Tab change handler
  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    setSelectedRows([]);
  }, []);
  
  // Selection change handler
  const handleSelectionChanged = useCallback((rows: any[]) => {
    setSelectedRows(rows);
  }, []);

  // Debounced slider handlers
  const handleSignificanceChange = useCallback((value: number) => {
    setSignificanceMin(value);
  }, []);

  const handleRelevanceChange = useCallback((value: number) => {
    setRelevanceMin(value);
  }, []);

  // Match/Not Match handlers
  const handleMatch = useCallback(() => {
    if (selectedRows.length === 0) return;

    setResults(prevResults => {
      const newResults = { ...prevResults };
      const tabData = [...newResults[activeTab]];

      // Update matchStatus for selected rows
      selectedRows.forEach(selectedRow => {
        const rowIndex = tabData.findIndex(row => row.id === selectedRow.id);
        if (rowIndex !== -1) {
          tabData[rowIndex] = { ...tabData[rowIndex], matchStatus: 'match' as const };
        }
      });

      newResults[activeTab] = tabData;
      return newResults;
    });

    // Clear selection after operation
    setSelectedRows([]);
  }, [selectedRows, activeTab]);

  const handleNotMatch = useCallback(() => {
    if (selectedRows.length === 0) return;

    setResults(prevResults => {
      const newResults = { ...prevResults };
      const tabData = [...newResults[activeTab]];

      // Update matchStatus for selected rows
      selectedRows.forEach(selectedRow => {
        const rowIndex = tabData.findIndex(row => row.id === selectedRow.id);
        if (rowIndex !== -1) {
          tabData[rowIndex] = { ...tabData[rowIndex], matchStatus: 'not-match' as const };
        }
      });

      newResults[activeTab] = tabData;
      return newResults;
    });

    // Clear selection after operation
    setSelectedRows([]);
  }, [selectedRows, activeTab]);

  const handleFindLookalikes = useCallback(() => {
    console.log('Finding lookalikes for:', selectedRows);
    // Implement lookalikes logic
  }, [selectedRows]);

  const handleEnrich = useCallback(() => {
    console.log('Enriching:', selectedRows);
    // Implement enrich logic
  }, [selectedRows]);

  const handleDelete = useCallback(() => {
    console.log('Deleting:', selectedRows);
    // Implement delete logic
  }, [selectedRows]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Getnius
              </h1>
              <nav className="hidden md:flex gap-1">
                <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg transition-colors">
                  New Search
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2">
                  <History className="w-4 h-4" />
                  History
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-4">
        {/* Search Header */}
        <SearchHeader
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          isSearching={activeTab === 'news' ? newsLoading : isSearching}
        />
        
        {/* Category Tabs */}
        <div className="py-2">
          <CategoryTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            resultCounts={resultCounts}
          />
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            {error}
          </div>
        )}
        
        {/* Results Panel with AG Grid */}
        <ResultsPanel
          activeTab={activeTab}
          results={filteredResults}
          isSearching={activeTab === 'news' ? newsLoading : isSearching}
          newsLoading={newsLoading}
          newsError={newsError}
          selectedRows={selectedRows}
          onSelectionChanged={handleSelectionChanged}
          gridRef={gridRef}
          significanceMin={significanceMin}
          relevanceMin={relevanceMin}
          onSignificanceChange={handleSignificanceChange}
          onRelevanceChange={handleRelevanceChange}
          getRowClass={getRowClass}
          onMatch={handleMatch}
          onNotMatch={handleNotMatch}
          onFindLookalikes={handleFindLookalikes}
          onEnrich={handleEnrich}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
