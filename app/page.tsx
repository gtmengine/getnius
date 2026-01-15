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
  Download,
  Plus
} from 'lucide-react';
import { AgGridWrapper, AgGridWrapperRef } from '@/components/ui/ag-grid-wrapper';
import { columnDefsMap, TabId, tabConfigs } from '@/lib/grid-columns';
import { sampleDataMap, getEmptyData } from '@/lib/sample-data';
import { ColDef } from 'ag-grid-community';
import { searchWithGoogle } from '@/lib/search-apis';

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
  onAddColumn: () => void;
  onAddRow: () => void;
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
  onAddColumn,
  onAddRow,
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

        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* Data Management Buttons */}
        <button
          onClick={onAddColumn}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Column
        </button>

        <button
          onClick={onAddRow}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Row
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
  selectedRows: any[];
  onSelectionChanged: (rows: any[]) => void;
  onCellValueChanged: (event: any) => void;
  onAddColumn: () => void;
  onAddRow: () => void;
  onMatch: () => void;
  onNotMatch: () => void;
  customColumns: Record<TabId, ColDef[]>;
  onColumnHeaderDoubleClick: (columnField: string, currentName: string) => void;
  setResults: React.Dispatch<React.SetStateAction<Record<TabId, any[]>>>;
  gridRef: React.RefObject<AgGridWrapperRef>;
  significanceMin: number;
  relevanceMin: number;
  onSignificanceChange: (value: number) => void;
  onRelevanceChange: (value: number) => void;
  getRowClass?: (params: any) => string;
  searchProgress?: string | null;
}

function ResultsPanel({ 
  activeTab, 
  results, 
  isSearching, 
  selectedRows,
  onSelectionChanged,
  onCellValueChanged,
  onAddColumn,
  onAddRow,
  onMatch,
  onNotMatch,
  customColumns,
  onColumnHeaderDoubleClick,
  setResults,
  gridRef,
  significanceMin,
  relevanceMin,
  onSignificanceChange,
  onRelevanceChange,
  getRowClass,
  searchProgress
}: ResultsPanelProps) {
  const columnDefs = useMemo(() => {
    const baseColumns = columnDefsMap[activeTab] || [];
    const customCols = customColumns[activeTab] || [];
    return [...baseColumns, ...customCols];
  }, [activeTab, customColumns]);
  const rowData = useMemo(() => results[activeTab] || [], [results, activeTab]);
  
  
  const handleFindLookalikes = useCallback(async (selectedRows: any[], setResultsFn: React.Dispatch<React.SetStateAction<Record<TabId, any[]>>>, results: Record<TabId, any[]>, activeTab: TabId, setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>) => {
    console.log('Finding lookalikes for:', selectedRows);

    // Toggle continuous search mode
    if (isContinuousSearchActiveRef.current) {
      console.log('Stopping continuous search');
      isContinuousSearchActiveRef.current = false;
      setSearchProgress(null);
      return;
    }

    // For news tab, Find Lookalikes works together with Match
    if (activeTab === 'news' && selectedRows.length > 0) {
      console.log('Starting continuous news lookalikes search');
      isContinuousSearchActiveRef.current = true;

      // Extract fingerprints and generate base queries deterministically
      const fingerprints: Array<{title: string, snippet: string, company: string, source: string}> = [];

      // Extract fingerprints from selected rows
      selectedRows.forEach(row => {
        fingerprints.push({
          title: row.title || '',
          snippet: row.summary || row.snippet || '',
          company: row.company || '',
          source: row.source || ''
        });
      });

      const companies = [...new Set(fingerprints.map(fp => fp.company).filter(c => c))];
      const sources = [...new Set(fingerprints.map(fp => fp.source).filter(s => s))];

      // Generate base queries
      const baseQueries: string[] = [];
      if (companies.length > 0) baseQueries.push(`${companies.join(' OR ')} news`);
      if (sources.length > 0) baseQueries.push(`${sources.join(' OR ')} articles`);
      if (companies.length > 0) baseQueries.push(`${companies[0]} latest news`);
      if (companies.length > 0) baseQueries.push(`${companies[0]} investment news`);
      if (companies.length > 0) baseQueries.push(`${companies[0]} market news`);

      let searchCycle = 0;

      // Continuous search loop
      const runContinuousSearch = async () => {
        if (!isContinuousSearchActiveRef.current) {
          console.log('Continuous search stopped');
          setSearchProgress(null);
          return;
        }

        searchCycle++;
        console.log(`Continuous search cycle ${searchCycle} started`);

        // Generate dynamic queries with variations for each cycle
        const queries = [...baseQueries];

        // Add cycle-specific variations
        const industryTerms = ['startup', 'funding', 'investment', 'acquisition', 'partnership', 'expansion', 'growth', 'IPO', 'valuation', 'revenue'];
        const timeTerms = ['today', 'this week', 'recent', 'breaking', 'update', 'announcement'];

        if (companies.length > 0) {
          // Add industry-specific queries
          const industryTerm = industryTerms[(searchCycle - 1) % industryTerms.length];
          queries.push(`${companies[0]} ${industryTerm} news`);

          // Add time-specific queries
          const timeTerm = timeTerms[(searchCycle - 1) % timeTerms.length];
          queries.push(`${companies[0]} ${timeTerm} news`);
        }

        // Ensure we have queries and deduplicate
        const uniqueQueries = [...new Set(queries)].filter(q => q.trim()).slice(0, 6);

        if (uniqueQueries.length === 0) {
          console.warn('No search queries available');
          setIsContinuousSearchActive(false);
          setSearchProgress(null);
          return;
        }

        setSearchProgress(`Continuous search cycle ${searchCycle} - ${uniqueQueries.length} queries...`);

        // Run search queries for this cycle
        const allSearchResults: any[] = [];
        let completedQueries = 0;

        for (let i = 0; i < uniqueQueries.length; i++) {
          if (!isContinuousSearchActiveRef.current) break; // Check if stopped

          const query = uniqueQueries[i];
          setSearchProgress(`Cycle ${searchCycle}: ${completedQueries + 1}/${uniqueQueries.length} queries...`);

          try {
            console.log(`Searching: "${query}"`);
            const searchResults = await searchWithGoogle(query.trim());
            allSearchResults.push(...searchResults);
            completedQueries++;
          } catch (error) {
            console.warn(`Search failed for query "${query}":`, error);
            completedQueries++;
          }

          // Small delay between queries to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Transform and deduplicate results
        const existingTitles = new Set(results[activeTab].map(row => row.title));
        const uniqueResults = allSearchResults.filter(result => {
          const title = result.title || result.headline || '';
          return title && title.length > 10 && !existingTitles.has(title);
        });

        // Transform and append results
        const transformedResults = uniqueResults.slice(0, 10).map((newsItem: any, index: number) => ({
          id: newsItem.id || `news-continuous-${Date.now()}-${searchCycle}-${index}`,
          title: newsItem.title || newsItem.headline || '',
          summary: newsItem.summary || newsItem.snippet || newsItem.description || '',
          company: newsItem.company || companies[0] || '',
          source: newsItem.source || newsItem.publisher || '',
          date: newsItem.date || newsItem.publishedAt || new Date().toISOString(),
          url: newsItem.url || '',
          status: 'New',
          matchStatus: 'match' as const,
          significance_score: Math.round((Math.random() * 4 + 6) * 10) / 10,
          relevance_score: Math.round((Math.random() * 3 + 7) * 10) / 10,
          newlyAdded: true,
          continuousSearchCycle: searchCycle // Track which cycle added this
        }));

        if (transformedResults.length > 0) {
          setResultsFn(prevResults => {
            const newResults = { ...prevResults };
            newResults[activeTab] = [...newResults[activeTab], ...transformedResults];
            console.log(`Cycle ${searchCycle}: Added ${transformedResults.length} new news items`);
            return newResults;
          });

          // Clear newlyAdded flag after 3 seconds
          setTimeout(() => {
            setResultsFn(prevResults => {
              const updatedResults = { ...prevResults };
              const tabData = [...updatedResults[activeTab]];
              tabData.forEach(row => {
                if (row.newlyAdded && row.continuousSearchCycle === searchCycle) {
                  delete row.newlyAdded;
                  delete row.continuousSearchCycle;
                }
              });
              updatedResults[activeTab] = tabData;
              return updatedResults;
            });
          }, 3000);
        }

        // Continue to next cycle if still active
        if (isContinuousSearchActiveRef.current) {
          // Wait 3-5 seconds before next cycle
          const delay = 3000 + Math.random() * 2000;
          setTimeout(runContinuousSearch, delay);
        }
      };

      // Start the continuous search
      runContinuousSearch();

    } else {
      // For other tabs or general lookalikes functionality
      console.log('General lookalikes functionality not yet implemented');
      setSelectedRows([]);
    }
  }, [activeTab, results]);
  
  const handleEnrich = () => {
    console.log('Enriching:', selectedRows);
    // Implement enrich logic
  };
  
  const handleDelete = () => {
    console.log('Deleting:', selectedRows);
    // Implement delete logic
  };

  const handleAddColumn = () => {
    console.log('Adding new column to:', activeTab);
    // For now, show a prompt or dialog to add a custom column
    const columnName = prompt('Enter column name:');
    if (columnName && columnName.trim()) {
      // This would typically update the column definitions
      // For now, we'll just log it
      console.log(`New column "${columnName}" would be added to ${activeTab} tab`);
      alert(`Column "${columnName}" functionality would be added here.\n\nIn a full implementation, this would:\n• Add the column to columnDefs\n• Update the data structure\n• Make it editable`);
    }
  };

  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Progress Indicator */}
      {searchProgress && (
        <div className="px-4 py-2 bg-blue-50 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-700 font-medium">{searchProgress}</span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="px-4 border-b border-gray-100">
        <ResultsToolbar
          selectedCount={selectedRows.length}
          onMatch={onMatch}
          onNotMatch={onNotMatch}
          onFindLookalikes={() => handleFindLookalikes(selectedRows, setResults, results, activeTab, setSelectedRows)}
          onEnrich={handleEnrich}
          onDelete={handleDelete}
          onAddColumn={onAddColumn}
          onAddRow={onAddRow}
          activeTab={activeTab}
          significanceMin={significanceMin}
          relevanceMin={relevanceMin}
          onSignificanceChange={onSignificanceChange}
          onRelevanceChange={onRelevanceChange}
        />
      </div>
      
      {/* Grid */}
      <div className="relative">
        <AgGridWrapper
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          height="calc(100vh - 280px)"
          loading={isSearching}
          onSelectionChanged={onSelectionChanged}
          onCellValueChanged={onCellValueChanged}
          onColumnHeaderDoubleClick={onColumnHeaderDoubleClick}
          emptyMessage={`No ${activeTab} data available.`}
          rowSelection="multiple"
          checkboxSelection={activeTab !== 'news'} // Disable general checkbox for news tab since it has a dedicated column
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
  const [results, setResults] = useState<Record<TabId, any[]>>(sampleDataMap);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [customColumns, setCustomColumns] = useState<Record<TabId, ColDef[]>>({});
  const [searchProgress, setSearchProgress] = useState<string | null>(null);
  const [isMatchActive, setIsMatchActive] = useState(false);
  const isContinuousSearchActiveRef = useRef(false);

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
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Persist slider values to localStorage
  useEffect(() => {
    localStorage.setItem('news-significance-min', significanceMin.toString());
  }, [significanceMin]);

  useEffect(() => {
    localStorage.setItem('news-relevance-min', relevanceMin.toString());
  }, [relevanceMin]);

  // Filter news data based on slider values
  const filteredNews = useMemo(() => {
    return results.news.filter(item =>
      (item.significance_score || 0) >= significanceMin &&
      (item.relevance_score || 0) >= relevanceMin
    );
  }, [results.news, significanceMin, relevanceMin]);

  // Create filtered results object
  const filteredResults = useMemo(() => ({
    ...results,
    news: filteredNews,
  }), [results, filteredNews]);

  // Row class function for match status styling
  const getRowClass = useCallback((params: any) => {
    const matchStatus = params.data?.matchStatus;
    const newlyAdded = params.data?.newlyAdded;
    const isSelected = params.node?.isSelected();

    if (newlyAdded) {
      return 'row-newly-added';
    } else if (isMatchActive && isSelected) {
      return 'row-selected-match'; // Light green background for selected rows when Match is active
    } else if (matchStatus === 'match') {
      return 'row-match';
    } else if (matchStatus === 'not-match') {
      return 'row-not-match';
    } else if (matchStatus === 'suggested') {
      return 'row-suggested';
    }
    return '';
  }, [isMatchActive]); // Row background styling function

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
  }, [searchQuery]);
  
  // Tab change handler
  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    setSelectedRows([]);
  }, []);
  
  // Selection change handler
  const handleSelectionChanged = useCallback((rows: any[]) => {
    setSelectedRows(rows);
  }, []);

  // Cell value change handler
  const handleCellValueChanged = useCallback((event: any) => {
    const { data, colDef, newValue, oldValue } = event;

    if (newValue !== oldValue) {
      // Update the results state with the new value
      setResults(prevResults => {
        const newResults = { ...prevResults };
        const tabData = [...newResults[activeTab]];

        // Find and update the specific row
        const rowIndex = tabData.findIndex(row => row.id === data.id);
        if (rowIndex !== -1) {
          tabData[rowIndex] = { ...tabData[rowIndex], [colDef.field]: newValue };
          newResults[activeTab] = tabData;
        }

        return newResults;
      });

      console.log(`Updated ${colDef.field} for ${data.id}: ${oldValue} → ${newValue}`);
    }
  }, [activeTab]);

  // Debounced slider handlers
  const handleSignificanceChange = useCallback((value: number) => {
    setSignificanceMin(value);
  }, []);

  const handleRelevanceChange = useCallback((value: number) => {
    setRelevanceMin(value);
  }, []);

  // Column name change handler (for custom columns)
  const handleColumnNameChange = useCallback((tab: TabId, fieldName: string, newName: string) => {
    setCustomColumns(prev => {
      const tabColumns = prev[tab] || [];
      const updatedColumns = tabColumns.map(col =>
        col.field === fieldName ? { ...col, headerName: newName } : col
      );

      return {
        ...prev,
        [tab]: updatedColumns
      };
    });
  }, []);

  // Add Column handler
  const handleAddColumn = useCallback(() => {
    console.log('Adding new column to:', activeTab);
    // For testing purposes, use a predefined column name since prompt() is not supported in this environment
    const sanitizedColumnName = `Custom Column ${Date.now()}`;
    const fieldName = sanitizedColumnName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    // Create new column definition
    const newColumn: ColDef = {
      field: fieldName,
      headerName: sanitizedColumnName,
      editable: true,
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 120,
    };

    // Add column to custom columns
    setCustomColumns(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newColumn]
    }));

    // Update all existing rows to include the new column with default value
    setResults(prevResults => {
      const newResults = { ...prevResults };
      const tabData = [...newResults[activeTab]];

      // Add the new field to all existing rows
      const updatedTabData = tabData.map(row => ({
        ...row,
        [fieldName]: ''
      }));

      newResults[activeTab] = updatedTabData;
      return newResults;
    });

    console.log(`Added new column "${sanitizedColumnName}" to ${activeTab} tab`);
  }, [activeTab, setCustomColumns, setResults]);

  // Match/Not Match handlers
  const handleMatch = useCallback(async (selectedRows: any[], setResultsFn: React.Dispatch<React.SetStateAction<Record<TabId, any[]>>>, results: Record<TabId, any[]>, activeTab: TabId, setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>) => {
    console.log('handleMatch called with:', selectedRows.length, 'selected rows for tab:', activeTab);
    if (selectedRows.length === 0) {
      console.log('No rows selected, returning early');
      return;
    }

    // Set Match active state for visual feedback
    setIsMatchActive(true);

    try {
      // Generate search queries based on selected rows
      let searchQueries: string[] = [];

      switch (activeTab) {
        case 'companies':
          // Use company names and descriptions as search terms
          const companyQuery = selectedRows.map(row =>
            `${row.name} ${row.description}`.substring(0, 100)
          ).join(' OR ');
          searchQueries = [companyQuery];
          break;

        case 'news':
          // Extract fingerprints and generate 3-8 derived queries deterministically
          searchQueries = generateNewsSearchQueries(selectedRows);
          break;

        case 'people':
          // Use person names, roles, and companies
          const peopleQuery = selectedRows.map(row =>
            `${row.name} ${row.role} ${row.company}`.substring(0, 100)
          ).join(' OR ');
          searchQueries = [peopleQuery];
          break;

        case 'signals':
          // Use signal descriptions and companies
          const signalsQuery = selectedRows.map(row =>
            `${row.description} ${row.company}`.substring(0, 100)
          ).join(' OR ');
          searchQueries = [signalsQuery];
          break;

        default:
          // Fallback for other tabs
          const fallbackQuery = selectedRows.map(row =>
            Object.values(row).filter(val => typeof val === 'string').join(' ')
          ).join(' OR ');
          searchQueries = [fallbackQuery];
      }

      if (searchQueries.length === 0 || searchQueries.every(q => !q.trim())) {
        console.warn('No search queries could be generated from selected rows');
        return;
      }

      console.log(`Searching for similar ${activeTab} based on selected examples:`, searchQueries);

      // Run multiple search queries and combine results with progress
      const allSearchResults: any[] = [];
      let completedQueries = 0;

      for (let i = 0; i < searchQueries.length; i++) {
        const query = searchQueries[i];
        if (query.trim()) {
          try {
            setSearchProgress(`Searching lookalikes (${completedQueries + 1}/${searchQueries.length} queries)...`);
            const results = await searchWithGoogle(query.trim());
            allSearchResults.push(...results);
            completedQueries++;
          } catch (error) {
            console.warn(`Search failed for query "${query}":`, error);
            completedQueries++;
          }
        }
      }

      setSearchProgress(null); // Clear progress when done

      const searchResults = allSearchResults;

      // Transform and append results
      setResultsFn(prevResults => {
        const newResults = { ...prevResults };
        const existingData = [...newResults[activeTab]];

        // Mark selected rows as positive matches
        selectedRows.forEach(selectedRow => {
          const rowIndex = existingData.findIndex(row => row.id === selectedRow.id);
          if (rowIndex !== -1) {
            existingData[rowIndex] = { ...existingData[rowIndex], matchStatus: 'match' as const };
          }
        });

        // Transform API results based on tab type
        let transformedResults: any[] = [];

        if (activeTab === 'companies') {
          transformedResults = searchResults.map((company: any, index: number) => ({
            id: company.id || `company-match-${Date.now()}-${index}`,
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
            matchStatus: 'suggested' as const
          }));
        } else if (activeTab === 'news') {
          // For news tab, set Status = "New" and Match = "Match" with enrichment and scoring
          transformedResults = searchResults.map((newsItem: any, index: number) => ({
            id: newsItem.id || `news-match-${Date.now()}-${index}`,
            title: newsItem.title || newsItem.headline || '',
            summary: newsItem.summary || newsItem.snippet || newsItem.description || '',
            company: newsItem.company || '',
            source: newsItem.source || newsItem.publisher || '',
            date: newsItem.date || newsItem.publishedAt || new Date().toISOString(),
            url: newsItem.url || '',
            status: 'New', // Set Status = "New" for derived news rows
            matchStatus: 'match' as const, // Set Match = "Match" for derived news rows
            // MVP enrichment and scoring
            significance_score: Math.round((Math.random() * 4 + 6) * 10) / 10, // 6.0-10.0 range
            relevance_score: Math.round((Math.random() * 3 + 7) * 10) / 10, // 7.0-10.0 range
            newlyAdded: true // Flag for highlighting newly added rows
          }));
        } else {
          // For other tabs, add suggested results with basic transformation
          // In a full implementation, you'd have specific transformations for each tab
          transformedResults = searchResults.map((result: any, index: number) => ({
            id: `${activeTab}-suggested-${Date.now()}-${index}`,
            ...result,
            matchStatus: 'suggested' as const
          }));
        }

        // Remove duplicates based on name/title (simple deduplication)
        const existingNames = new Set(existingData.map(row =>
          activeTab === 'companies' ? row.name :
          activeTab === 'news' ? row.title :
          activeTab === 'people' ? row.name :
          row.id
        ));

        const uniqueResults = transformedResults.filter(result => {
          const identifier = activeTab === 'companies' ? result.name :
                           activeTab === 'news' ? result.title :
                           activeTab === 'people' ? result.name :
                           result.id;
          return !existingNames.has(identifier);
        });

        newResults[activeTab] = [...existingData, ...uniqueResults];

        const resultType = activeTab === 'news' ? 'new news items' : 'suggested matches';
        console.log(`Added ${uniqueResults.length} ${resultType} to ${activeTab} tab (${searchQueries.length} queries executed)`);

        // Clear newlyAdded flag after 3 seconds for highlighting
        if (uniqueResults.some(row => row.newlyAdded)) {
          setTimeout(() => {
            setResultsFn(prevResults => {
              const updatedResults = { ...prevResults };
              const tabData = [...updatedResults[activeTab]];
              tabData.forEach(row => {
                if (row.newlyAdded) {
                  delete row.newlyAdded;
                }
              });
              updatedResults[activeTab] = tabData;
              return updatedResults;
            });
          }, 3000);
        }

        return newResults;
      });

    } catch (error) {
      console.error('Error finding matches:', error);
      // Fallback to just marking selected rows as matches
      setResultsFn(prevResults => {
        const newResults = { ...prevResults };
        const tabData = [...newResults[activeTab]];

        selectedRows.forEach(selectedRow => {
          const rowIndex = tabData.findIndex(row => row.id === selectedRow.id);
          if (rowIndex !== -1) {
            tabData[rowIndex] = { ...tabData[rowIndex], matchStatus: 'match' as const };
          }
        });

        newResults[activeTab] = tabData;
        return newResults;
      });
    }

    // Clear selection and match active state after operation
    setSelectedRows([]);
    setIsMatchActive(false);
  }, []);

  // Generate 3-8 derived search queries from selected news rows
  const generateNewsSearchQueries = useCallback((selectedRows: any[]): string[] => {
    const queries: string[] = [];
    const fingerprints: Array<{title: string, snippet: string, company: string, source: string}> = [];

    // Extract fingerprints from selected rows
    selectedRows.forEach(row => {
      fingerprints.push({
        title: row.title || '',
        snippet: row.summary || row.snippet || '',
        company: row.company || '',
        source: row.source || ''
      });
    });

    // Generate derived queries deterministically
    const companies = [...new Set(fingerprints.map(fp => fp.company).filter(c => c))];
    const sources = [...new Set(fingerprints.map(fp => fp.source).filter(s => s))];

    // Query 1: Company-focused search
    if (companies.length > 0) {
      queries.push(`${companies.join(' OR ')} news`);
    }

    // Query 2: Source-focused search
    if (sources.length > 0) {
      queries.push(`${sources.join(' OR ')} articles`);
    }

    // Query 3: Combined company + key terms from titles
    const titleKeywords = fingerprints
      .flatMap(fp => fp.title.split(' '))
      .filter(word => word.length > 3) // Filter out short words
      .filter(word => !['news', 'update', 'report', 'announces', 'launches', 'reveals', 'says'].includes(word.toLowerCase()))
      .slice(0, 5); // Take top 5 keywords

    if (companies.length > 0 && titleKeywords.length > 0) {
      queries.push(`${companies[0]} ${titleKeywords.slice(0, 3).join(' ')} news`);
    }

    // Query 4: Snippet-based search (extract key phrases)
    const snippetKeywords = fingerprints
      .flatMap(fp => fp.snippet.split(' '))
      .filter(word => word.length > 4)
      .filter(word => !word.includes('http'))
      .slice(0, 4);

    if (snippetKeywords.length > 0) {
      queries.push(`${snippetKeywords.join(' ')} business news`);
    }

    // Query 5: Company + source combination
    if (companies.length > 0 && sources.length > 0) {
      queries.push(`${companies[0]} ${sources[0]} news`);
    }

    // Query 6: Recent news about companies
    if (companies.length > 1) {
      queries.push(`${companies.slice(0, 2).join(' ')} latest news`);
    }

    // Query 7: Industry context
    const industryTerms = ['startup', 'funding', 'investment', 'acquisition', 'partnership', 'expansion', 'growth'];
    if (companies.length > 0) {
      queries.push(`${companies[0]} ${industryTerms[Math.floor(Math.random() * industryTerms.length)]} news`);
    }

    // Query 8: Broader market context
    if (companies.length > 0) {
      queries.push(`${companies[0]} market news`);
    }

    // Ensure we have at least 3 queries and at most 8
    const finalQueries = queries.slice(0, 8);
    return finalQueries.length >= 3 ? finalQueries : queries.slice(0, Math.max(3, queries.length));
  }, []);

  const handleNotMatch = useCallback((selectedRows: any[], setResultsFn: React.Dispatch<React.SetStateAction<Record<TabId, any[]>>>, results: Record<TabId, any[]>, activeTab: TabId, setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>) => {
    if (selectedRows.length === 0) return;

    setResultsFn(prevResults => {
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
  }, []);

  // Add Row handler
  const handleAddRow = useCallback((tab: TabId, setResultsFn: React.Dispatch<React.SetStateAction<Record<TabId, any[]>>>, customColumns?: Record<TabId, ColDef[]>) => {
    console.log('Adding new row to:', tab);

    setResultsFn(prevResults => {
      const newResults = { ...prevResults };
      const tabData = [...newResults[tab]];

      // Create a new empty row based on the current tab
      let newRow: any = {};

      switch (tab) {
        case 'companies':
          newRow = {
            id: `company-${Date.now()}`,
            name: 'New Company',
            description: 'Enter description',
            location: 'Enter location',
            founded: '',
            employees: '',
            status: 'Active',
            revenue: '',
            people: 0,
            news: 0,
            logo: '/placeholder.svg',
            matchStatus: null
          };
          break;
        case 'people':
          newRow = {
            id: `person-${Date.now()}`,
            name: 'New Person',
            company: 'New Company',
            role: 'New Role',
            location: 'New Location',
            email: 'new@email.com',
            intents: 0,
            matchStatus: null
          };
          break;
        case 'news':
          newRow = {
            id: `news-${Date.now()}`,
            title: 'New Article Title',
            source: 'New Source',
            date: new Date().toISOString().split('T')[0],
            company: 'New Company',
            summary: 'Enter article summary',
            significance_score: 5.0,
            relevance_score: 5.0,
            matchStatus: null
          };
          break;
        case 'signals':
          newRow = {
            id: `signal-${Date.now()}`,
            signalType: 'New Signal',
            person: 'New Person',
            company: 'New Company',
            date: new Date().toISOString().split('T')[0],
            confidence: 'Medium',
            source: 'https://news-source.com',
            description: 'New signal description',
            matchStatus: null
          };
          break;
        case 'market':
          newRow = {
            id: `market-${Date.now()}`,
            title: 'New Market Report',
            publisher: 'New Publisher',
            date: new Date().toISOString().split('T')[0],
            region: 'New Region',
            category: 'New Category',
            pages: 0,
            matchStatus: null
          };
          break;
        case 'patents':
          newRow = {
            id: `patent-${Date.now()}`,
            title: 'New Patent Title',
            type: 'Patent',
            inventor: 'New Inventor',
            company: 'New Company',
            dateFiled: new Date().toISOString().split('T')[0],
            status: 'Filed',
            matchStatus: null
          };
          break;
        case 'research-papers':
          newRow = {
            id: `paper-${Date.now()}`,
            title: 'New Research Paper Title',
            authors: 'New Author',
            journal: 'New Journal',
            publicationDate: new Date().toISOString().split('T')[0],
            citations: 0,
            field: 'New Field',
            matchStatus: null
          };
          break;
      }

      // Add custom columns to the new row
      if (customColumns && customColumns[tab]) {
        customColumns[tab].forEach(col => {
          if (col.field) {
            newRow[col.field] = '';
          }
        });
      }

      // Add the new row to the data
      newResults[tab] = [...tabData, newRow];
      return newResults;
    });

    console.log(`Added new row to ${tab} tab`);
  }, []);
  
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
          isSearching={isSearching}
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
          isSearching={isSearching}
          selectedRows={selectedRows}
          onSelectionChanged={handleSelectionChanged}
          onCellValueChanged={handleCellValueChanged}
          onAddColumn={handleAddColumn}
          onAddRow={() => handleAddRow(activeTab, setResults, customColumns)}
          onMatch={() => handleMatch(selectedRows, setResults, results, activeTab, setSelectedRows)}
          onNotMatch={() => handleNotMatch(selectedRows, setResults, results, activeTab, setSelectedRows)}
          customColumns={customColumns}
          onColumnHeaderDoubleClick={(columnField, currentName) => {
            // Only allow editing custom columns (those containing "Custom" in the name)
            if (currentName.includes('Custom')) {
              const newName = prompt('Enter new column name:', currentName);
              if (newName && newName.trim() && newName !== currentName) {
                handleColumnNameChange(activeTab, columnField, newName.trim());
              }
            }
          }}
          setResults={setResults}
          gridRef={gridRef}
          significanceMin={significanceMin}
          relevanceMin={relevanceMin}
          onSignificanceChange={handleSignificanceChange}
          onRelevanceChange={handleRelevanceChange}
          getRowClass={getRowClass}
          searchProgress={searchProgress}
        />
      </main>
    </div>
  );
}
