"use client"

import React from "react"
import { useState, useMemo, useCallback } from "react"
import { searchCompanies, type Company } from "./lib/search-apis"
import SearchScreen from "./search-screen"
import EnrichmentScreen from "./enrichment-screen"
import ActionScreen from "./action-screen"
import SettingsScreen from "./settings-screen"
import {
  Target,
  Database,
  Settings,
  Bell,
  Zap,
  Search,
} from "lucide-react"

const MarketIntelligenceTool = React.memo(() => {
  // State declarations
  const [currentScreen, setCurrentScreen] = useState("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Company[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCategory, setSelectedCategory] = useState("Companies")
  const [precision, setPrecision] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [expandedResults, setExpandedResults] = useState(false)
  const [showExamples, setShowExamples] = useState(true)
  const [customCategory, setCustomCategory] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [showNonRelevantList, setShowNonRelevantList] = useState(false)
  const [enrichedCompanies, setEnrichedCompanies] = useState<Company[]>([]);

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

  const handleEnrichedData = useCallback((companies: Company[]) => {
    setEnrichedCompanies(companies);
  }, []);

  // Handle search execution
  const handleSearch = useCallback(async (queryOverride?: string) => {
    const query = queryOverride || searchQuery
    if (!query.trim()) return

    setIsSearching(true)
    setShowExamples(false)

    try {
      const results = await searchCompanies(query)
      if (results && results.length > 0) {
        setSearchResults(results)
        setCompanies(results)
        setExpandedResults(false)
        setPrecision(0)
      } else {
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
  }, [searchQuery])

  // Handle search input changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setShowExamples(value.length === 0)
  }, [])

  // Handle autocomplete suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: any) => {
    setSearchQuery(suggestion.text)
    setShowExamples(false)
    setTimeout(() => handleSearch(suggestion.text), 50)
  }, [handleSearch])

  // Handle example selection
  const handleExampleSelect = useCallback((query: string) => {
    setSearchQuery(query)
    setShowExamples(false)
    setTimeout(() => handleSearch(query), 100)
  }, [handleSearch])

  // Handle relevance feedback
  const handleRelevanceFeedback = useCallback(
    (companyId: string, isRelevant: boolean) => {
      const relevanceValue = isRelevant ? "relevant" : "not_relevant"

      setCompanies(prev =>
        prev.map(company =>
          company.id === companyId ? { ...company, relevance: relevanceValue } : company
        )
      )

      setSearchResults(prev =>
        prev.map(company =>
          company.id === companyId ? { ...company, relevance: relevanceValue } : company
        )
      )

      const updatedResults = searchResults.map(company =>
        company.id === companyId ? { ...company, relevance: relevanceValue } : company,
      )

      const relevantCount = updatedResults.filter(r => r.relevance === "relevant").length
      const totalFeedback = updatedResults.filter(r => r.relevance !== undefined).length
      const newPrecision = totalFeedback > 0 ? Math.round((relevantCount / totalFeedback) * 100) : 0

      setPrecision(newPrecision)

      if (newPrecision >= 60 && !expandedResults && totalFeedback >= 3) {
        setTimeout(() => {
          setSearchResults(companies.slice(0, Math.min(20, companies.length)))
          setExpandedResults(true)
        }, 500)
      }
    },
    [searchResults, companies, expandedResults],
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-2">
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
            <div className="flex">
              {[
                { id: "search", name: "Search", icon: Search },
                { id: "enrich", name: "Enrich", icon: Database },
                { id: "action", name: "Action", icon: Zap },
                { id: "settings", name: "Settings", icon: Settings },
              ].map((item, index) => {
                const Icon = item.icon
                const isActive = currentScreen === item.id
                const isCompleted = index === 0 ? relevantCompanies.length > 0 :
                  index === 1 ? relevantCompanies.length > 0 : false
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentScreen(item.id)}
                    className={`flex items-center gap-3 px-6 py-2 transition-colors relative rounded-md ${isActive
                      ? "bg-blue-600 text-white"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-4">
              {/* Telegram Group Link */}
              <a
                href="https://t.me/+4FRzSKQG-RtkODAy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                {/* Telegram Paper Plane Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-.14.04-.23.07-.48.16-2.9 1.84-2.9 1.84s-.41.26-.82.25c-.27-.01-.8-.15-1.19-.27-.48-.15-.87-.23-.83-.48.02-.13.18-.26.48-.4 0 0 4.4-1.8 5.94-2.43.65-.26 2.84-1.18 2.84-1.18s1.02-.4 1.02.26z" />
                </svg>
                <span>Join the group</span>
              </a>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Subscribe to the newsletter"
                onClick={() => window.open('https://gtmbe.substack.com/', '_blank')}
              >
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentScreen("settings")}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {currentScreen === "search" && (
          <SearchScreen
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearching={isSearching}
            searchResults={searchResults}
            companies={companies}
            relevantCompanies={relevantCompanies}
            nonRelevantCompanies={nonRelevantCompanies}
            pendingCompanies={pendingCompanies}
            precision={precision}
            expandedResults={expandedResults}
            showExamples={showExamples}
            selectedCategory={selectedCategory}
            customCategory={customCategory}
            showCustomInput={showCustomInput}
            showNonRelevantList={showNonRelevantList}
            handleSearch={handleSearch}
            handleSearchChange={handleSearchChange}
            handleSuggestionSelect={handleSuggestionSelect}
            handleExampleSelect={handleExampleSelect}
            handleRelevanceFeedback={handleRelevanceFeedback}
            setCurrentScreen={setCurrentScreen}
            setSelectedCategory={setSelectedCategory}
            setCustomCategory={setCustomCategory}
            setShowCustomInput={setShowCustomInput}
            setShowNonRelevantList={setShowNonRelevantList}
          />
        )}

        {currentScreen === "enrich" && (
          <EnrichmentScreen
            relevantCompanies={relevantCompanies}
            setCurrentScreen={setCurrentScreen}
            handleExport={handleExport}
          />
        )}

        {currentScreen === "action" && (
          <ActionScreen
            setCurrentScreen={setCurrentScreen}
            handleExport={handleExport}
            enrichedCompanies={enrichedCompanies}
          />
        )}

        {currentScreen === "settings" && (
          <SettingsScreen setCurrentScreen={setCurrentScreen} />
        )}
      </div>
    </div>
  )
})

MarketIntelligenceTool.displayName = "MarketIntelligenceTool"

export default MarketIntelligenceTool
