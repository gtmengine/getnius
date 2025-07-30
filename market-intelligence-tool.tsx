"use client"

import React from "react"
import { useState, useMemo, useCallback } from "react"
import {
  Search,
  Check,
  X,
  Download,
  Bell,
  Users,
  DollarSign,
  MapPin,
  Building,
  Database,
  Settings,
  ExternalLink,
  Sparkles,
  Target,
  FileText,
  Zap,
  ArrowRight,
  Loader2,
  Plus,
} from "lucide-react"
import { searchCompanies, type Company } from "./lib/search-apis"
import { SearchExamples } from "./components/search-examples"
import { AutoCompleteSearch } from "./components/auto-complete-search"

const MarketIntelligenceTool = React.memo(() => {
  const [currentScreen, setCurrentScreen] = useState("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Company[]>([])
  const [selectedCategory, setSelectedCategory] = useState("Companies")
  const [precision, setPrecision] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [expandedResults, setExpandedResults] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [showExamples, setShowExamples] = useState(true)
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showNonRelevantList, setShowNonRelevantList] = useState(false);

  // Separate relevant and non-relevant companies
  const relevantCompanies = useMemo(() => 
    companies.filter(company => company.relevance === "relevant"), 
    [companies]
  )
  
  const nonRelevantCompanies = useMemo(() => 
    companies.filter(company => company.relevance === "not_relevant"), 
    [companies]
  )

  const pendingCompanies = useMemo(() => 
    companies.filter(company => !company.relevance), 
    [companies]
  )

  // Handle search execution
  const handleSearch = useCallback(async (queryOverride?: string) => {
    const query = queryOverride || searchQuery
    console.log("Search triggered with query:", query)
    console.log("Current searchQuery state:", searchQuery)
    if (!query.trim()) {
      console.log("Empty query, returning")
      return
    }

    setIsSearching(true)
    setShowExamples(false)

    try {
      console.log("Calling searchCompanies...")
      const results = await searchCompanies(query)
      console.log("Search results:", results)

      if (results && results.length > 0) {
        console.log("Setting search results:", results.length, "companies")
        setSearchResults(results)
        setCompanies(results)
        setExpandedResults(false)
        setPrecision(0)
      } else {
        console.log("No results found")
        setSearchResults([])
        setCompanies([])
      }
    } catch (error) {
      console.error("Search failed:", error)
      setSearchResults([])
      setCompanies([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Handle search input changes
  const handleSearchChange = useCallback((value: string) => {
    console.log("Search input changed to:", value)
    setSearchQuery(value)
    setShowExamples(value.length === 0)
  }, [])

  // Handle autocomplete suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: any) => {
    setSearchQuery(suggestion.text)
    setShowExamples(false)
    // Auto-search when suggestion is selected
    setTimeout(() => handleSearch(suggestion.text), 50)
  }, [])

  // Handle example selection
  const handleExampleSelect = useCallback((query: string) => {
    setSearchQuery(query)
    setShowExamples(false)
    // Auto-search when example is selected
    setTimeout(() => handleSearch(query), 100)
  }, [])

  // Handle relevance feedback
  const handleRelevanceFeedback = useCallback(
    (companyId: string, isRelevant: boolean) => {
      const relevanceValue = isRelevant ? "relevant" : "not_relevant"

      setCompanies((prev) =>
        prev.map((company) => (company.id === companyId ? { ...company, relevance: relevanceValue } : company)),
      )

      setSearchResults((prev) =>
        prev.map((company) => (company.id === companyId ? { ...company, relevance: relevanceValue } : company)),
      )

      // Calculate precision and potentially expand results
      const updatedResults = searchResults.map((company) =>
        company.id === companyId ? { ...company, relevance: relevanceValue } : company,
      )

      const relevantCount = updatedResults.filter((r) => r.relevance === "relevant").length
      const totalFeedback = updatedResults.filter((r) => r.relevance !== null).length
      const newPrecision = totalFeedback > 0 ? Math.round((relevantCount / totalFeedback) * 100) : 0

      setPrecision(newPrecision)

      // Expand results if precision is good and we haven't expanded yet
      if (newPrecision >= 60 && !expandedResults && totalFeedback >= 3) {
        setTimeout(() => {
          setSearchResults(companies.slice(0, Math.min(20, companies.length)))
          setExpandedResults(true)
        }, 500)
      }
    },
    [searchResults, companies, expandedResults],
  )

  // Optimize the search examples with useMemo:
  const memoizedSearchExamples = useMemo(
    () => <SearchExamples onExampleSelect={handleExampleSelect} />,
    [handleExampleSelect],
  )

  // Handle export
  const handleExport = useCallback(() => {
    if (!searchResults.length) return;
    const headers = [
      'Company', 'Source', 'Website', 'Employees', 'Funding', 'Location', 'Status'
    ];
    const rows = searchResults.map(company => [
      company.name,
      company.source,
      company.website,
      company.employees,
      company.funding,
      company.location,
      company.relevance || 'Pending',
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${(field ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'enriched_market_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [searchResults]);

  // Search Screen Component
  const SearchScreen = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Non-Relevant Companies Collapsed List */}
      {nonRelevantCompanies.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <button
            onClick={() => setShowNonRelevantList(!showNonRelevantList)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-red-500" />
              <span className="font-medium text-gray-900">
                {nonRelevantCompanies.length} Non-Relevant Companies
              </span>
            </div>
            <ArrowRight 
              className={`w-4 h-4 text-gray-500 transition-transform ${
                showNonRelevantList ? 'rotate-90' : ''
              }`} 
            />
          </button>
          
          {showNonRelevantList && (
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
              {nonRelevantCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                      <Building className="w-3 h-3 text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-700">{company.name}</span>
                  </div>
                  <button
                    onClick={() => handleRelevanceFeedback(company.id, true)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Mark as Relevant
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Create a data-ready market list</h1>
        <p className="text-lg text-gray-600">Find all your clients | competitors | suppliers</p>
      </div>

      {/* Search Categories */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {["People", "Companies", "Research Papers", "Articles", "Products"].map((category, index) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setShowCustomInput(false);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
              tabIndex={3 + index}
            >
              {category}
            </button>
          ))}
          {showCustomInput ? (
            <input
              autoFocus
              type="text"
              className="px-4 py-2 rounded-md text-sm font-medium border outline-none w-32"
              placeholder="Your entity..."
              value={customCategory}
              onChange={e => setCustomCategory(e.target.value)}
              onBlur={() => {
                if (customCategory.trim()) {
                  setSelectedCategory(customCategory.trim());
                }
                setShowCustomInput(false);
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && customCategory.trim()) {
                  setSelectedCategory(customCategory.trim());
                  setShowCustomInput(false);
                }
              }}
              tabIndex={8}
            />
          ) : (
            <button
              key="Other"
              onClick={() => {
                setShowCustomInput(true);
                setCustomCategory("");
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !["People", "Companies", "Research Papers", "Articles", "Products"].includes(selectedCategory)
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              tabIndex={8}
            >
              {!["People", "Companies", "Research Papers", "Articles", "Products"].includes(selectedCategory) ? selectedCategory : "Other"}
            </button>
          )}
        </div>
      </div>

      {/* Smart Search Input */}
      <div className="space-y-4">
        <div className="flex gap-4">
                     <AutoCompleteSearch
             value={searchQuery}
             onChange={handleSearchChange}
             onSelect={handleSuggestionSelect}
             placeholder={
               searchQuery.length > 0
                 ? `Searching for "${searchQuery}"...`
                 : "Enter a request ... (e.g., AI meeting transcription tools)"
             }
             className="flex-1"
             tabIndex={1}
           />

                     <button
             onClick={() => {
               if (searchQuery.trim()) {
                 handleSearch(searchQuery)
               }
             }}
             disabled={!searchQuery.trim() || isSearching}
             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-2 whitespace-nowrap"
             tabIndex={2}
           >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search
              </>
            )}
          </button>
        </div>

        {/* Quick completion pills */}
        {searchQuery && searchQuery.length > 3 && (
          <div className="flex flex-wrap gap-2">
            {[
              `${searchQuery} in NYC`,
              `${searchQuery} in 2025`,
              `${searchQuery} startups`,
              `${searchQuery} companies`,
            ].map((completion, index) => (
              <button
                key={index}
                onClick={() => handleExampleSelect(completion)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                tabIndex={9 + index}
              >
                {completion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Examples */}
      {showExamples && memoizedSearchExamples}

      {/* Company Status Summary */}
      {companies.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-3">Company Status Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{pendingCompanies.length}</div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{relevantCompanies.length}</div>
              <div className="text-sm text-gray-600">Marked as Relevant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{nonRelevantCompanies.length}</div>
              <div className="text-sm text-gray-600">Marked as Not Relevant</div>
            </div>
          </div>
        </div>
      )}

      {/* Alternative Input Methods */}
      {showExamples && (
        <div className="grid grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="text"
              placeholder="Add the links you want to research"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center space-y-2">
            <FileText className="w-8 h-8 text-gray-400 mx-auto" />
            <div className="font-medium text-gray-900">Start from CSV</div>
            <div className="text-sm text-gray-500">Upload documents</div>
            <div className="text-xs text-gray-400">PDF, XLS, ...</div>
          </div>
        </div>
      )}

      

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-6">
          {/* Precision Indicator */}
          {precision > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Search Precision: {precision}%</span>
                </div>
                {precision >= 80 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">High precision achieved!</span>
                  </div>
                )}
              </div>
              <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${precision}%` }}
                />
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Search Results {expandedResults && "(Expanded)"}</h3>
            <div className="text-sm text-gray-600">{searchResults.length} companies • Click ✓/✗ to mark as relevant or not</div>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {searchResults.map((company) => (
              <div
                key={company.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {company.logo ? (
                      <img
                        src={company.logo || "/placeholder.svg"}
                        alt={company.name}
                        className="w-12 h-12 rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{company.name}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              company.source === "firecrawl"
                                ? "bg-purple-100 text-purple-700"
                                : company.source === "google"
                                  ? "bg-blue-100 text-blue-700"
                                  : company.source === "exa"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {company.source}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{company.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          {company.employees && (
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {company.employees} employees
                            </span>
                          )}
                          {company.funding && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {company.funding} funding
                            </span>
                          )}
                          {company.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {company.location}
                            </span>
                          )}
                          {company.industry && (
                            <span className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {company.industry}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Relevance Buttons */}
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleRelevanceFeedback(company.id, true)}
                          className={`p-2 rounded-lg transition-colors ${
                            company.relevance === "relevant"
                              ? "bg-green-100 text-green-600"
                              : "hover:bg-green-50 text-gray-400 hover:text-green-600"
                          }`}
                          title="Mark as relevant"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRelevanceFeedback(company.id, false)}
                          className={`p-2 rounded-lg transition-colors ${
                            company.relevance === "not_relevant"
                              ? "bg-red-100 text-red-600"
                              : "hover:bg-red-50 text-gray-400 hover:text-red-600"
                          }`}
                          title="Mark as not relevant"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          {relevantCompanies.length > 0 && (
            <div className="flex justify-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Ready for Enrichment</span>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  {relevantCompanies.length} relevant companies found • Select which ones to enrich with additional data
                </p>
                <button
                  onClick={() => setCurrentScreen("enrich")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                >
                  Continue to Enrichment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* No Relevant Companies Message */}
          {companies.length > 0 && relevantCompanies.length === 0 && (
            <div className="flex justify-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Mark Companies as Relevant</span>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  {companies.length} companies found • Click ✓ on companies you want to enrich
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600 mt-4">Searching across multiple data sources...</p>
          <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
            <span>• Firecrawl</span>
            <span>• Google</span>
            <span>• Exa</span>
          </div>
        </div>
      )}
    </div>
  )

  // Enrichment Screen Component
  const EnrichmentScreen = () => {
    const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set())
    const [enrichmentColumns, setEnrichmentColumns] = useState([
      { id: "website", name: "Website", enabled: true },
      { id: "employees", name: "Employee Count", enabled: true },
      { id: "funding", name: "Total Funding", enabled: true },
      { id: "location", name: "HQ Location", enabled: true },
      { id: "industry", name: "Industry", enabled: false },
      { id: "founded", name: "Founded Year", enabled: false },
      { id: "email", name: "Contact Email", enabled: false },
      { id: "phone", name: "Phone Number", enabled: false },
    ])

    const handleSelectAll = () => {
      if (selectedCompanies.size === relevantCompanies.length) {
        setSelectedCompanies(new Set())
      } else {
        setSelectedCompanies(new Set(relevantCompanies.map(company => company.id)))
      }
    }

    const handleSelectCompany = (companyId: string) => {
      const newSelected = new Set(selectedCompanies)
      if (newSelected.has(companyId)) {
        newSelected.delete(companyId)
      } else {
        newSelected.add(companyId)
      }
      setSelectedCompanies(newSelected)
    }

    const handleEnrichSelected = () => {
      // Simulate enrichment process
      console.log("Enriching selected companies:", Array.from(selectedCompanies))
    }

    const enrichedCompanies = relevantCompanies.map(company => ({
      ...company,
      enriched: selectedCompanies.has(company.id)
    }))

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Enrich Your Market List</h2>
            <p className="text-gray-600 mt-1">
              {relevantCompanies.length} relevant companies • {selectedCompanies.size} selected for enrichment
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleEnrichSelected}
              disabled={selectedCompanies.size === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Enrich Selected ({selectedCompanies.size})
            </button>
            <button onClick={handleExport} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Column Selection */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-3">Enrichment Columns</h3>
          <div className="grid grid-cols-4 gap-3">
            {enrichmentColumns.map((column) => (
              <label key={column.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={column.enabled}
                  onChange={(e) => {
                    setEnrichmentColumns(prev => 
                      prev.map(col => 
                        col.id === column.id ? { ...col, enabled: e.target.checked } : col
                      )
                    )
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{column.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.size === searchResults.length && searchResults.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  {enrichmentColumns.filter(col => col.enabled).map(column => (
                    <th key={column.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {column.name}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {enrichedCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCompanies.has(company.id)}
                        onChange={() => handleSelectCompany(company.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {company.logo ? (
                          <img
                            src={company.logo || "/placeholder.svg"}
                            alt={company.name}
                            className="w-8 h-8 rounded"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=32&width=32"
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <Building className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{company.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          company.source === "firecrawl"
                            ? "bg-purple-100 text-purple-700"
                            : company.source === "google"
                              ? "bg-blue-100 text-blue-700"
                              : company.source === "exa"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {company.source}
                      </span>
                    </td>
                    {enrichmentColumns.filter(col => col.enabled).map(column => (
                      <td key={column.id} className="px-4 py-4 text-sm text-gray-900">
                        {column.id === "website" && company.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {new URL(company.website).hostname}
                          </a>
                        ) : column.id === "employees" ? (
                          company.employees || "—"
                        ) : column.id === "funding" ? (
                          company.funding || "—"
                        ) : column.id === "location" ? (
                          company.location || "—"
                        ) : (
                          "—"
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          company.enriched
                            ? "bg-green-100 text-green-700"
                            : company.relevance === "relevant"
                              ? "bg-blue-100 text-blue-700"
                              : company.relevance === "not_relevant"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {company.enriched ? "Enriched" : 
                         company.relevance === "relevant" ? "Relevant" :
                         company.relevance === "not_relevant" ? "Not Relevant" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSelectCompany(company.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {selectedCompanies.has(company.id) ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Plus className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{relevantCompanies.length}</div>
            <div className="text-sm text-gray-600">Relevant Companies</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{selectedCompanies.size}</div>
            <div className="text-sm text-gray-600">Selected for Enrichment</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {enrichedCompanies.filter(c => c.enriched).length}
            </div>
            <div className="text-sm text-gray-600">Enriched</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-600">
              {enrichmentColumns.filter(col => col.enabled).length}
            </div>
            <div className="text-sm text-gray-600">Active Columns</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentScreen("search")}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Search
          </button>
          <button
            onClick={() => setCurrentScreen("action")}
            disabled={selectedCompanies.size === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-2"
          >
            Take Action
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Action Screen Component
  const ActionScreen = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Take Action on Your List</h2>
            <p className="text-gray-600 mt-1">Export, outreach, and monitor your companies</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-4">Export Options</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Google Sheets", description: "Real-time sync", icon: Database },
              { name: "HubSpot CRM", description: "Create contacts", icon: Database },
              { name: "Webhook/API", description: "Custom endpoint", icon: Zap },
              { name: "CSV Download", description: "Instant download", icon: Download },
            ].map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.name}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{option.name}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentScreen("enrich")}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Enrichment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Getnius</h1>
                <p className="text-sm text-gray-600">Your ultimate Market-Intelligence tool</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex">
            {[
              { id: "search", name: "Search", icon: Search },
              { id: "enrich", name: "Enrich", icon: Database },
              { id: "action", name: "Action", icon: Zap },
            ].map((item, index) => {
              const Icon = item.icon
              const isActive = currentScreen === item.id
              const isCompleted = index === 0 ? relevantCompanies.length > 0 : 
                                index === 1 ? relevantCompanies.length > 0 : false
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-colors relative ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                  {isCompleted && !isActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {currentScreen === "search" && <SearchScreen />}
        {currentScreen === "enrich" && <EnrichmentScreen />}
        {currentScreen === "action" && <ActionScreen />}
      </div>
    </div>
  )
})

MarketIntelligenceTool.displayName = "MarketIntelligenceTool"

export default MarketIntelligenceTool
