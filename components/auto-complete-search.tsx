"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Search } from "lucide-react"

interface AutocompleteSuggestion {
  id: string
  text: string
  type: "recent" | "trending" | "ontology" | "location" | "industry" | "completion"
  category: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface AutoCompleteSearchProps {
  value: string
  onChange: (value: string) => void
  onSelect: (suggestion: AutocompleteSuggestion) => void
  placeholder?: string
  className?: string
}

// Pre-computed suggestion data for better performance
const SUGGESTION_DATA = {
  ontologyMap: {
    "drone delivery": ["UAS last-mile", "BVLOS logistics", "unmanned aerial delivery"],
    "ai meeting": ["meeting transcription", "conversation intelligence", "meeting assistant"],
    "prop-tech": ["property technology", "real estate tech", "smart buildings"],
    fintech: ["financial technology", "digital banking", "payment processing"],
    healthtech: ["digital health", "telemedicine", "health monitoring"],
    edtech: ["educational technology", "e-learning", "online learning"],
    cybersecurity: ["information security", "data protection", "security software"],
    investing: ["investment", "venture capital", "private equity"],
    engineers: ["software engineers", "developers", "technical talent"],
    designers: ["UX designers", "UI designers", "product designers"],
  },
  locations: ["in NYC", "in New York", "in San Francisco", "in Silicon Valley", "in London", "in 2025", "in 2024"],
  completions: ["startups", "companies", "solutions", "platforms", "tools", "services"],
  trending: [
    "AI productivity tools",
    "series B 2024 startups",
    "crypto investing 2025",
    "UX designers NYC",
    "engineers at AI startups",
  ],
  recent: [
    "AI meeting transcription tools",
    "fintech payment processing",
    "drone delivery logistics",
    "prop-tech smart homes",
  ],
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

export const AutoCompleteSearch = React.memo(({ value, onChange, onSelect, placeholder, className = "" }: AutoCompleteSearchProps) => {
  const [results, setResults] = useState<AutocompleteSuggestion[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const debouncedQuery = useDebounce(value, 300)

  // Generate suggestions based on query
  const generateSuggestions = useCallback((query: string): AutocompleteSuggestion[] => {
    if (!query || query.length < 2) return []

    const results: AutocompleteSuggestion[] = []
    const queryLower = query.toLowerCase()
    const maxResults = 8

    // 1. Recent searches
    SUGGESTION_DATA.recent
      .filter((search) => search.toLowerCase().includes(queryLower))
      .slice(0, 2)
      .forEach((search, index) => {
        results.push({
          id: `recent-${index}`,
          text: search,
          type: "recent",
          category: "Recent",
        })
      })

    // 2. Ontology matches
    for (const [key, synonyms] of Object.entries(SUGGESTION_DATA.ontologyMap)) {
      if (queryLower.includes(key) && results.length < maxResults) {
        synonyms.slice(0, 2).forEach((synonym, index) => {
          results.push({
            id: `ontology-${key}-${index}`,
            text: synonym,
            type: "ontology",
            category: "Related",
            description: `Alternative for ${key}`,
          })
        })
        break
      }
    }

    // 3. Location completions
    if ((queryLower.includes("in ") || queryLower.includes("at ")) && results.length < maxResults) {
      SUGGESTION_DATA.locations
        .filter((loc) => !query.includes(loc))
        .slice(0, 2)
        .forEach((location, index) => {
          results.push({
            id: `location-${index}`,
            text: `${query} ${location}`,
            type: "location",
            category: "Location",
          })
        })
    }

    // 4. Quick completions
    if (results.length < maxResults) {
      const lastWord = queryLower.split(" ").pop() || ""
      SUGGESTION_DATA.completions
        .filter((comp) => comp.startsWith(lastWord) && comp !== lastWord)
        .slice(0, 2)
        .forEach((completion, index) => {
          const words = query.split(" ")
          words[words.length - 1] = completion
          results.push({
            id: `completion-${index}`,
            text: words.join(" "),
            type: "completion",
            category: "Complete",
          })
        })
    }

    return results.slice(0, maxResults)
  }, [])

  // Update results when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      const suggestions = generateSuggestions(debouncedQuery)
      setResults(suggestions)
    } else {
      setResults([])
    }
  }, [debouncedQuery, generateSuggestions])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log("Search input changed to:", value)
    onChange(value)
  }, [onChange])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    // Delay hiding results to allow for clicks
    setTimeout(() => {
      setIsFocused(false)
    }, 200)
  }, [])

  const handleSuggestionClick = useCallback((suggestion: AutocompleteSuggestion) => {
    console.log("Suggestion selected:", suggestion.text)
    onSelect(suggestion)
    setIsFocused(false)
  }, [onSelect])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      console.log("Enter pressed with value:", value)
      onSelect({
        id: `custom-${value}`,
        text: value,
        type: "completion",
        category: "Custom",
      })
      setIsFocused(false)
    }
  }, [value, onSelect])

  const shouldShowResults = isFocused && results.length > 0

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
          onKeyDown={handleKeyDown}
          tabIndex={1}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {shouldShowResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-2 border-b bg-gray-50">
            <div className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <Search className="w-3 h-3" />
              Smart suggestions ({results.length})
            </div>
          </div>

          {results.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseDown={(e) => e.preventDefault()}
              className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm truncate">
                  {suggestion.text.toLowerCase().includes(value.toLowerCase()) ? (
                    <span>
                      {suggestion.text.slice(0, suggestion.text.toLowerCase().indexOf(value.toLowerCase()))}
                      <span className="text-blue-600 font-semibold">{value}</span>
                      {suggestion.text.slice(suggestion.text.toLowerCase().indexOf(value.toLowerCase()) + value.length)}
                    </span>
                  ) : (
                    suggestion.text
                  )}
                </div>
                {suggestion.description && (
                  <div className="text-xs text-gray-500 truncate">{suggestion.description}</div>
                )}
              </div>
              {suggestion.type === "ontology" && (
                <div className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">alt</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
})

AutoCompleteSearch.displayName = "AutoCompleteSearch" 