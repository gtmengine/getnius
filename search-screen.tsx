"use client"

import React from "react"
import {
  Search,
  Check,
  X,
  Users,
  DollarSign,
  MapPin,
  Building,
  Database,
  ExternalLink,
  Target,
  FileText,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { type Company } from "./lib/search-apis"
import { SearchExamples } from "./components/search-examples"
import { AutoCompleteSearch } from "./components/auto-complete-search"
import EnhancedSearchSuggestions from "./components/enhanced-search-suggestions"
import CSVParser from "./components/csv-parser"
import LinkProcessor from "./components/link-processor"

interface SearchScreenProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isSearching: boolean;
  searchResults: Company[];
  companies: Company[];
  relevantCompanies: Company[];
  nonRelevantCompanies: Company[];
  pendingCompanies: Company[];
  precision: number;
  expandedResults: boolean;
  showExamples: boolean;
  selectedCategory: string;
  customCategory: string;
  showCustomInput: boolean;
  showNonRelevantList: boolean;
  handleSearch: (queryOverride?: string) => Promise<void>;
  handleSearchChange: (value: string) => void;
  handleSuggestionSelect: (suggestion: any) => void;
  handleExampleSelect: (query: string) => void;
  handleRelevanceFeedback: (companyId: string, isRelevant: boolean) => void;
  setCurrentScreen: (screen: string) => void;
  setSelectedCategory: (category: string) => void;
  setCustomCategory: (category: string) => void;
  setShowCustomInput: (show: boolean) => void;
  setShowNonRelevantList: (show: boolean) => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({
  searchQuery,
  setSearchQuery,
  isSearching,
  searchResults,
  companies,
  relevantCompanies,
  nonRelevantCompanies,
  pendingCompanies,
  precision,
  expandedResults,
  showExamples,
  selectedCategory,
  customCategory,
  showCustomInput,
  showNonRelevantList,
  handleSearch,
  handleSearchChange,
  handleSuggestionSelect,
  handleExampleSelect,
  handleRelevanceFeedback,
  setCurrentScreen,
  setSelectedCategory,
  setCustomCategory,
  setShowCustomInput,
  setShowNonRelevantList
}) => {
  // State for link input functionality
  const [links, setLinks] = React.useState<string[]>([]);
  const [newLink, setNewLink] = React.useState("");
  const [showLinkInput, setShowLinkInput] = React.useState(false);

  // State for CSV parser functionality
  const [showCSVParser, setShowCSVParser] = React.useState(false);
  const [csvSearchQueries, setCsvSearchQueries] = React.useState<string[]>([]);

  // State for link processor functionality
  const [showLinkProcessor, setShowLinkProcessor] = React.useState(false);
  const [processedLinks, setProcessedLinks] = React.useState<any[]>([]);

  // Optimize the search examples with useMemo:
  const memoizedSearchExamples = React.useMemo(
    () => <SearchExamples onExampleSelect={handleExampleSelect} />,
    [handleExampleSelect],
  )

  // Handle adding a new link
  const handleAddLink = () => {
    if (newLink.trim() && !links.includes(newLink.trim())) {
      setLinks([...links, newLink.trim()]);
      setNewLink("");
      setShowLinkInput(false);
    }
  };

  // Handle removing a link
  const handleRemoveLink = (linkToRemove: string) => {
    setLinks(links.filter(link => link !== linkToRemove));
  };

  // Handle link input key press
  const handleLinkKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddLink();
    } else if (e.key === "Escape") {
      setShowLinkInput(false);
      setNewLink("");
    }
  };

  // Handle CSV search queries
  const handleSearchFromCSV = (searchQueries: string[]) => {
    setCsvSearchQueries(searchQueries);
    setShowCSVParser(false);
  };

  // Handle CSV data processed
  const handleCSVDataProcessed = (data: any) => {
    console.log("CSV data processed:", data);
  };

  // Handle links processed
  const handleLinksProcessed = (links: any[]) => {
    setProcessedLinks(links);
    setShowLinkProcessor(false);
  };

  return (
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

        {/* Link Input Section */}
        <div className="space-y-3">
          {/* Add Link Button */}
          {!showLinkInput && (
            <button
              onClick={() => setShowLinkInput(true)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              tabIndex={10}
            >
              <ExternalLink className="w-4 h-4" />
              Add Reference Link
            </button>
          )}

          {/* Link Input Field */}
          {showLinkInput && (
            <div className="flex gap-2">
              <input
                type="url"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                onKeyDown={handleLinkKeyPress}
                placeholder="Enter URL (e.g., https://example.com)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                tabIndex={11}
              />
              <button
                onClick={handleAddLink}
                disabled={!newLink.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300"
                tabIndex={12}
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowLinkInput(false);
                  setNewLink("");
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                tabIndex={13}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Display Added Links */}
          {links.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Reference Links ({links.length})</span>
              </div>
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-sm text-blue-600 hover:text-blue-700 truncate"
                    >
                      {link}
                    </a>
                    <button
                      onClick={() => handleRemoveLink(link)}
                      className="p-1 text-gray-400 hover:text-red-500"
                      title="Remove link"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced AI Suggestions */}
        {searchQuery && searchQuery.length > 2 && (
          <div className="relative">
            <EnhancedSearchSuggestions
              query={searchQuery}
              onSuggestionSelect={handleExampleSelect}
              maxSuggestions={6}
              showConfidence={true}
              className="absolute top-2 left-0 right-0 z-50"
            />
          </div>
        )}

        {/* Quick completion pills - fallback */}
        {searchQuery && searchQuery.length > 3 && (
          <div className="flex flex-wrap gap-2 mt-2">
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
        <div className="space-y-6">
          {/* Two-column layout for input methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Link Processor Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Add Links for Research</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Process URLs to extract company information and data
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setShowLinkProcessor(!showLinkProcessor)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {showLinkProcessor ? "Hide Link Processor" : "Open Link Processor"}
                  </button>
                </div>
              </div>
            </div>

            {/* CSV Parser Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Start from CSV</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a CSV file to extract search queries or preview data
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setShowCSVParser(!showCSVParser)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    {showCSVParser ? "Hide CSV Parser" : "Open CSV Parser"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Link Processor Component */}
          {showLinkProcessor && (
            <LinkProcessor
              onLinksProcessed={handleLinksProcessed}
              className="mt-4"
            />
          )}

          {/* CSV Parser Component */}
          {showCSVParser && (
            <CSVParser
              onDataProcessed={handleCSVDataProcessed}
              onSearchFromCSV={handleSearchFromCSV}
              className="mt-4"
            />
          )}

          {/* CSV Search Queries Display */}
          {csvSearchQueries.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    CSV Search Queries ({csvSearchQueries.length})
                  </span>
                </div>
                <button
                  onClick={() => setCsvSearchQueries([])}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {csvSearchQueries.map((query, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-sm text-gray-700">{query}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExampleSelect(query)}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Use as Search
                      </button>
                      <button
                        onClick={() => setCsvSearchQueries(csvSearchQueries.filter((_, i) => i !== index))}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-blue-200">
                <button
                  onClick={() => {
                    if (csvSearchQueries.length > 0) {
                      handleExampleSelect(csvSearchQueries[0]);
                    }
                  }}
                  disabled={csvSearchQueries.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 text-sm"
                >
                  Search First Query
                </button>
              </div>
            </div>
          )}

          {/* Processed Links Display */}
          {processedLinks.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">
                    Processed Links ({processedLinks.length})
                  </span>
                </div>
                <button
                  onClick={() => setProcessedLinks([])}
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {processedLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">{link.companyName}</span>
                        <span className="text-xs text-gray-500">({link.segment})</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {link.location} • {link.tags.slice(0, 3).join(", ")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExampleSelect(`${link.companyName} ${link.segment}`)}
                        className="text-xs text-green-600 hover:text-green-700"
                      >
                        Search Similar
                      </button>
                      <button
                        onClick={() => setProcessedLinks(processedLinks.filter((_, i) => i !== index))}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Debug Info - Only show when there's a search query */}
      {searchQuery && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-sm text-blue-800">
            Ready to search for: <strong>"{searchQuery}"</strong>
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Click Search button or press Enter to search
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
}

export default SearchScreen
