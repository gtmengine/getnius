// API integrations for company search

export interface Company {
  id: string
  name: string
  description: string
  website?: string
  employees?: string
  funding?: string
  location?: string
  industry?: string
  founded?: string
  email?: string
  phone?: string
  logo?: string
  relevance?: "relevant" | "not_relevant" | null
  status: "pending" | "validated" | "enriched"
  comment?: string
  enriched: boolean
  source: "firecrawl" | "google" | "exa" | "alternative" | "extruct"
}

export interface SearchSuggestion {
  text: string
  type: "industry" | "technology" | "location" | "company_type" | "keyword"
  category: string
}

// Firecrawl API integration
export async function searchWithFirecrawl(query: string): Promise<Company[]> {
  try {
    const response = await fetch("/api/search/firecrawl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      console.error("Firecrawl search failed, trying alternative...")
      // Try alternative search
      const altResponse = await fetch("/api/search/alternative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (altResponse.ok) {
        const altData = await altResponse.json()
        return altData.companies || []
      }

      throw new Error("Both Firecrawl and alternative search failed")
    }

    const data = await response.json()
    return data.companies || []
  } catch (error) {
    console.error("Firecrawl search error:", error)

    // Final fallback - try alternative search
    try {
      const altResponse = await fetch("/api/search/alternative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (altResponse.ok) {
        const altData = await altResponse.json()
        return altData.companies || []
      }
    } catch (altError) {
      console.error("Alternative search also failed:", altError)
    }

    return []
  }
}

// Google Custom Search API integration
export async function searchWithGoogle(query: string): Promise<Company[]> {
  try {
    const response = await fetch("/api/search/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || "Google search failed"
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.companies || []
  } catch (error) {
    console.error("Google search error:", error)

    // Try alternative search as fallback if Google fails
    console.log("Falling back to alternative search...")
    try {
      const altResponse = await fetch("/api/search/alternative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (altResponse.ok) {
        const altData = await altResponse.json()
        return altData.companies || []
      }
    } catch (altError) {
      console.error("Alternative search fallback also failed:", altError)
    }

    return []
  }
}

// Exa API integration
export async function searchWithExa(query: string): Promise<Company[]> {
  try {
    const response = await fetch("/api/search/exa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) throw new Error("Exa search failed")

    const data = await response.json()
    return data.companies || []
  } catch (error) {
    console.error("Exa search error:", error)
    return []
  }
}

// Extruct AI integration
export async function searchWithExtruct(query: string): Promise<Company[]> {
  try {
    const response = await fetch("/api/extruct/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || "Extruct AI search failed"
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.companies || []
  } catch (error) {
    console.error("Extruct AI search error:", error)

    // Try alternative search as fallback if Extruct AI fails
    console.log("Falling back to alternative search...")
    try {
      const altResponse = await fetch("/api/search/alternative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (altResponse.ok) {
        const altData = await altResponse.json()
        return altData.companies || []
      }
    } catch (altError) {
      console.error("Alternative search fallback also failed:", altError)
    }

    return []
  }
}

// Smart suggestions based on query
export async function getSmartSuggestions(query: string): Promise<SearchSuggestion[]> {
  try {
    const response = await fetch("/api/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) throw new Error("Suggestions failed")

    const data = await response.json()
    return data.suggestions || []
  } catch (error) {
    console.error("Suggestions error:", error)
    return []
  }
}

// Combined search across all APIs
export async function searchCompanies(query: string): Promise<Company[]> {
  const [firecrawlResults, googleResults, exaResults, extructResults] = await Promise.allSettled([
    searchWithFirecrawl(query),
    searchWithGoogle(query),
    searchWithExa(query),
    searchWithExtruct(query),
  ])

  const allCompanies: Company[] = []

  if (firecrawlResults.status === "fulfilled") {
    allCompanies.push(...firecrawlResults.value)
  }

  if (googleResults.status === "fulfilled") {
    allCompanies.push(...googleResults.value)
  }

  if (exaResults.status === "fulfilled") {
    allCompanies.push(...exaResults.value)
  }

  if (extructResults.status === "fulfilled") {
    allCompanies.push(...extructResults.value)
  }

  // Remove duplicates based on website or name
  const uniqueCompanies = allCompanies.filter(
    (company, index, self) =>
      index ===
      self.findIndex((c) => c.website === company.website || c.name.toLowerCase() === company.name.toLowerCase()),
  )

  return uniqueCompanies
}
