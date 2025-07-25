"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Search, Clock, Hash, MapPin, Building } from "lucide-react"

interface AutocompleteSuggestion {
  id: string
  text: string
  type: "recent" | "trending" | "ontology" | "location" | "industry" | "completion"
  category: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface FastAutocompleteProps {
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

export const FastAutocomplete = ({ value, onChange, onSelect, placeholder, className = "" }: FastAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Fast suggestion generation with memoization
  const generateSuggestions = useCallback((query: string): AutocompleteSuggestion[] => {
    if (!query || query.length < 2) return []

    const suggestions: AutocompleteSuggestion[] = []
    const queryLower = query.toLowerCase()
    const maxResults = 6

    // 1. Recent searches (immediate)
    SUGGESTION_DATA.recent
      .filter((search) => search.toLowerCase().includes(queryLower))
      .slice(0, 2)
      .forEach((search, index) => {
        suggestions.push({
          id: `recent-${index}`,
          text: search,
          type: "recent",
          category: "Recent",
          icon: Clock,
        })
      })

    // 2. Ontology matches (fast lookup)
    for (const [key, synonyms] of Object.entries(SUGGESTION_DATA.ontologyMap)) {
      if (queryLower.includes(key) && suggestions.length < maxResults) {
        synonyms.slice(0, 2).forEach((synonym, index) => {
          suggestions.push({
            id: `ontology-${key}-${index}`,
            text: synonym,
            type: "ontology",
            category: "Related",
            description: `Alternative for ${key}`,
            icon: Hash,
          })
        })
        break // Only one ontology match for speed
      }
    }

    // 3. Location completions (if applicable)
    if ((queryLower.includes("in ") || queryLower.includes("at ")) && suggestions.length < maxResults) {
      SUGGESTION_DATA.locations
        .filter((loc) => !query.includes(loc))
        .slice(0, 2)
        .forEach((location, index) => {
          suggestions.push({
            id: `location-${index}`,
            text: `${query} ${location}`,
            type: "location",
            category: "Location",
            icon: MapPin,
          })
        })
    }

    // 4. Quick completions
    if (suggestions.length < maxResults) {
      const lastWord = queryLower.split(" ").pop() || ""
      SUGGESTION_DATA.completions
        .filter((comp) => comp.startsWith(lastWord) && comp !== lastWord)
        .slice(0, 2)
        .forEach((completion, index) => {
          const words = query.split(" ")
          words[words.length - 1] = completion
          suggestions.push({
            id: `completion-${index}`,
            text: words.join(" "),
            type: "completion",
            category: "Complete",
            icon: Building,
          })
        })
    }

    return suggestions.slice(0, maxResults)
  }, [])

  // Ultra-fast debounced suggestions (50ms)
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (value.length >= 2) {
      // Immediate suggestions for better UX
      timeoutRef.current = setTimeout(() => {
        const newSuggestions = generateSuggestions(value)
        setSuggestions(newSuggestions)
        setShowSuggestions(newSuggestions.length > 0 && document.activeElement === inputRef.current)
        setSelectedIndex(-1)
      }, 50) // Ultra-fast 50ms debounce
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, generateSuggestions])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex >= 0) {
            onSelect(suggestions[selectedIndex])
            setShowSuggestions(false)
          }
          break
        case "Escape":
          setShowSuggestions(false)
          setSelectedIndex(-1)
          break
      }
    },
    [showSuggestions, suggestions, selectedIndex, onSelect],
  )

  const handleSuggestionClick = useCallback(
    (suggestion: AutocompleteSuggestion) => {
      onSelect(suggestion)
      setShowSuggestions(false)
      inputRef.current?.focus()
    },
    [onSelect],
  )

  const handleFocus = useCallback(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }, [suggestions.length])

  const handleBlur = useCallback(() => {
    // Delay to allow click events
    setTimeout(() => setShowSuggestions(false), 150)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          autoComplete="off"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {/* Fast suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-2 border-b bg-gray-50">
            <div className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <Search className="w-3 h-3" />
              Smart suggestions
            </div>
          </div>

          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon || Search
            return (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2 transition-colors ${
                  selectedIndex === index ? "bg-blue-50 border-blue-200" : ""
                }`}
              >
                <div
                  className={`p-1 rounded ${
                    suggestion.type === "recent"
                      ? "bg-gray-100 text-gray-600"
                      : suggestion.type === "trending"
                        ? "bg-orange-100 text-orange-600"
                        : suggestion.type === "ontology"
                          ? "bg-purple-100 text-purple-600"
                          : suggestion.type === "location"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm truncate">{suggestion.text}</div>
                  {suggestion.description && (
                    <div className="text-xs text-gray-500 truncate">{suggestion.description}</div>
                  )}
                </div>
                {suggestion.type === "ontology" && (
                  <div className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">alt</div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

FastAutocomplete.displayName = "FastAutocomplete"
