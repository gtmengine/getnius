"use client"

import { useState, useEffect } from 'react'
import { SuspenseWrapper, SearchResultsSkeleton } from './suspense-wrapper'

interface StreamingResultsProps {
  searchQuery: string
  onResults?: (results: any[]) => void
}

export function StreamingResults({ searchQuery, onResults }: StreamingResultsProps) {
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!searchQuery.trim()) return

    const fetchStreamingResults = async () => {
      setIsLoading(true)
      setError(null)
      setResults([])

      try {
        // Симулируем потоковую загрузку результатов
        const sources = ['google', 'exa', 'alternative', 'firecrawl']
        
        for (const source of sources) {
          // Добавляем небольшую задержку для демонстрации streaming эффекта
          await new Promise(resolve => setTimeout(resolve, 500))
          
          try {
            const response = await fetch(`/api/search/${source}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: searchQuery, limit: 5 })
            })

            if (response.ok) {
              const data = await response.json()
              const newResults = data.results || []
              
              setResults(prev => {
                const updated = [...prev, ...newResults.map((r: any) => ({ ...r, source }))]
                onResults?.(updated)
                return updated
              })
            }
          } catch (sourceError) {
            console.warn(`Error fetching from ${source}:`, sourceError)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStreamingResults()
  }, [searchQuery, onResults])

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Search Error</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-sm line-clamp-2">{result.title || result.name || 'Untitled'}</h3>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {result.source}
                </span>
              </div>
              
              {result.description && (
                <p className="text-sm text-gray-600 line-clamp-3">{result.description}</p>
              )}
              
              {result.url && (
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline truncate block"
                >
                  {result.url}
                </a>
              )}
              
              <div className="flex flex-wrap gap-1">
                {result.tags?.slice(0, 3).map((tag: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isLoading && (
        <div className="mt-4">
          <SearchResultsSkeleton />
          <div className="text-center mt-4">
            <div className="text-sm text-gray-500">Loading more results...</div>
          </div>
        </div>
      )}
      
      {!isLoading && results.length === 0 && searchQuery.trim() && (
        <div className="text-center py-8 text-gray-500">
          No results found for "{searchQuery}"
        </div>
      )}
    </div>
  )
}

// Обертка с Suspense
export function StreamingResultsWithSuspense(props: StreamingResultsProps) {
  return (
    <SuspenseWrapper fallback={<SearchResultsSkeleton />}>
      <StreamingResults {...props} />
    </SuspenseWrapper>
  )
}
