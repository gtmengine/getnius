"use client"

import React, { useState, Suspense } from "react"
import { Search, Target, Sparkles, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StreamingResultsWithSuspense } from "./streaming/streaming-results"
import { StreamingTableWithSuspense } from "./streaming/streaming-table"
import { StreamingEnrichmentWithSuspense } from "./streaming/streaming-enrichment"
import { SearchExamples } from "./search-examples"
import { AutoCompleteSearch } from "./auto-complete-search"

interface EnhancedSearchScreenProps {
  onBack?: () => void
}

export function EnhancedSearchScreen({ onBack }: EnhancedSearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("search")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [tableData, setTableData] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery
    if (!searchTerm.trim()) return

    setIsSearching(true)
    setSearchResults([])
    setActiveTab("results")

    // Результаты будут загружены через StreamingResults компонент
    setTimeout(() => setIsSearching(false), 3000)
  }

  const handleResultsUpdate = (results: any[]) => {
    setSearchResults(results)
    // Конвертируем результаты в табличный формат
    const tableRows = results.map((result, index) => ({
      Company: result.title || result.name || `Company ${index + 1}`,
      Website: result.url || '-',
      Source: result.source || 'Unknown',
      Description: result.description?.substring(0, 100) + '...' || '-',
      Tags: result.tags?.join(', ') || '-'
    }))
    setTableData(tableRows)
  }

  const handleEnrichCompany = (companyName: string) => {
    setSelectedCompany(companyName)
    setActiveTab("enrichment")
  }

  const handleExport = () => {
    // Логика экспорта данных
    console.log('Exporting data...', tableData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI-Powered Search</h1>
              <p className="text-gray-600">Discover companies with streaming results</p>
            </div>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back to Dashboard
            </Button>
          )}
        </div>

        {/* Search Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Company Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Suspense fallback={<Input placeholder="Loading search..." disabled />}>
                  <AutoCompleteSearch
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSelect={(suggestion) => {
                      setSearchQuery(suggestion.query)
                      handleSearch(suggestion.query)
                    }}
                    placeholder="Search for companies, industries, or technologies..."
                  />
                </Suspense>
              </div>
              <Button 
                onClick={() => handleSearch()} 
                disabled={isSearching || !searchQuery.trim()}
                className="px-8"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            <Suspense fallback={<div className="h-32 bg-gray-100 rounded animate-pulse" />}>
              <SearchExamples 
                onSelect={(query) => {
                  setSearchQuery(query)
                  handleSearch(query)
                }}
              />
            </Suspense>
          </CardContent>
        </Card>

        {/* Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="results">
              Results 
              {searchResults.length > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {searchResults.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="enrichment">
              Enrichment
              {selectedCompany && <Badge className="ml-2" variant="secondary">1</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to Search
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Enter your search query above or select from examples to get started
                  </p>
                  <div className="flex justify-center gap-2">
                    <Badge variant="outline">AI-Powered</Badge>
                    <Badge variant="outline">Real-time</Badge>
                    <Badge variant="outline">Multi-source</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Search Results
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    {searchResults.length > 0 && (
                      <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <StreamingResultsWithSuspense
                  searchQuery={searchQuery}
                  onResults={handleResultsUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="table" className="space-y-6">
            <StreamingTableWithSuspense
              data={tableData}
              columns={['Company', 'Website', 'Source', 'Description', 'Tags']}
              isLoading={isSearching}
              onRefresh={() => handleSearch()}
              onExport={handleExport}
              title="Company Results"
            />
          </TabsContent>

          <TabsContent value="enrichment" className="space-y-6">
            {selectedCompany ? (
              <StreamingEnrichmentWithSuspense
                companyName={selectedCompany}
                onEnrichmentComplete={(data) => {
                  console.log('Enrichment complete:', data)
                }}
              />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select a Company to Enrich
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Search for companies first, then click on a result to get detailed enrichment data
                    </p>
                    <Button 
                      onClick={() => setActiveTab("search")}
                      variant="outline"
                    >
                      Go to Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
