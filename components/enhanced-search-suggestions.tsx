"use client"

import React, { useState, useEffect, useCallback } from "react";
import { Search, Sparkles, Building, MapPin, Zap, Target, TrendingUp } from "lucide-react";
import { type PerplexitySuggestion } from "../lib/perplexity-api";

interface EnhancedSearchSuggestionsProps {
  query: string;
  onSuggestionSelect: (suggestion: string) => void;
  onSuggestionHover?: (suggestion: string) => void;
  maxSuggestions?: number;
  showConfidence?: boolean;
  className?: string;
}

const EnhancedSearchSuggestions: React.FC<EnhancedSearchSuggestionsProps> = ({
  query,
  onSuggestionSelect,
  onSuggestionHover,
  maxSuggestions = 8,
  showConfidence = false,
  className = "",
}) => {
  const [suggestions, setSuggestions] = useState<PerplexitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState("");

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/suggestions/perplexity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data.suggestions.slice(0, maxSuggestions));
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
      setError("Failed to load suggestions");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [maxSuggestions]);

  // Debounced effect to fetch suggestions
  useEffect(() => {
    if (query !== lastQuery) {
      setLastQuery(query);
      
      const timeoutId = setTimeout(() => {
        fetchSuggestions(query);
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [query, lastQuery, fetchSuggestions]);

  const getSuggestionIcon = (type: PerplexitySuggestion["type"]) => {
    switch (type) {
      case "company":
        return <Building className="w-4 h-4" />;
      case "industry":
        return <Target className="w-4 h-4" />;
      case "technology":
        return <Zap className="w-4 h-4" />;
      case "location":
        return <MapPin className="w-4 h-4" />;
      case "keyword":
        return <Search className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getSuggestionColor = (type: PerplexitySuggestion["type"]) => {
    switch (type) {
      case "company":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "industry":
        return "text-green-600 bg-green-50 border-green-200";
      case "technology":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "location":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "keyword":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  if (!query.trim() || query.length < 2) {
    return null;
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            AI-Powered Search Suggestions
          </span>
          {loading && (
            <div className="ml-auto">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions List */}
      <div className="max-h-64 overflow-y-auto">
        {error ? (
          <div className="px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : loading ? (
          <div className="px-4 py-3 text-sm text-gray-500">
            Generating intelligent suggestions...
          </div>
        ) : suggestions.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500">
            No suggestions available for &quot;{query}&quot;
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.text}-${index}`}
                onClick={() => onSuggestionSelect(suggestion.text)}
                onMouseEnter={() => onSuggestionHover?.(suggestion.text)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md border ${getSuggestionColor(suggestion.type)}`}>
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.text}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 capitalize">
                        {suggestion.type}
                      </span>
                      {showConfidence && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-gray-400" />
                          <span className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}>
                            {Math.round(suggestion.confidence * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    Click to search
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {suggestions.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {suggestions.length} AI-generated suggestions
            </span>
            <span>
              Powered by Perplexity AI
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchSuggestions; 