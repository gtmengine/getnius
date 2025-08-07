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
  source: "firecrawl" | "google" | "exa" | "alternative"

  linkedInUrl?: string
  technologyStack?: string[]
  marketCap?: string
  growthRate?: string
  ceoName?: string
  businessModel?: string
  socialMedia?: Record<string, string>
}

export interface SearchSuggestion {
  text: string
  type: "industry" | "technology" | "location" | "company_type" | "keyword"
  category: string
}

// Alternative search API integration (primary method)
// export async function searchWithAlternative(query: string): Promise<Company[]> {
//   try {
//     const response = await fetch("/api/search/alternative", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ query }),
//     })

//     if (!response.ok) {
//       console.error("Alternative search failed:", response.status)
//       return []
//     }

//     const data = await response.json()
//     return data.companies || []
//   } catch (error) {
//     console.error("Alternative search error:", error)
//     return []
//   }
// }

// Firecrawl API integration
export async function searchWithFirecrawl(query: string): Promise<Company[]> {
  try {
    const response = await fetch("/api/search/firecrawl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      console.error("Firecrawl search failed:", response.status)
      return []
    }

    const data = await response.json()
    return data.companies || []
  } catch (error) {
    console.error("Firecrawl search error:", error)
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
      console.error("Google search failed:", response.status)
      return []
    }

    const data = await response.json()
    return data.companies || []
  } catch (error) {
    console.error("Google search error:", error)
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

    if (!response.ok) {
      console.error("Exa search failed:", response.status)
      return []
    }

    const data = await response.json()
    return data.companies || []
  } catch (error) {
    console.error("Exa search error:", error)
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

    if (!response.ok) {
      console.error("Suggestions failed:", response.status)
      return []
    }

    const data = await response.json()
    return data.suggestions || []
  } catch (error) {
    console.error("Suggestions error:", error)
    return []
  }
}

// Combined search across all APIs with improved error handling
export async function searchCompanies(query: string): Promise<Company[]> {
  console.log("Starting search for:", query)
  
  // Try alternative search first as it's most reliable
  try {
    const exaResults = await searchWithExa(query)
    if (exaResults && exaResults.length > 0) {
      console.log("Alternative search returned", exaResults.length, "results")
      return exaResults
    }
  } catch (error) {
    console.error("Alternative search failed:", error)
  }

  console.log("Trying other search APIs...")
  const [firecrawlResults, googleResults, exaResults] = await Promise.allSettled([
    searchWithFirecrawl(query),
    searchWithGoogle(query),
    searchWithExa(query)
  ])

  const allCompanies: Company[] = []

  if (firecrawlResults.status === "fulfilled" && firecrawlResults.value.length > 0) {
    allCompanies.push(...firecrawlResults.value)
  }

  if (googleResults.status === "fulfilled" && googleResults.value.length > 0) {
    allCompanies.push(...googleResults.value)
  }

  if (exaResults.status === "fulfilled" && exaResults.value.length > 0) {
    allCompanies.push(...exaResults.value)
  }

  // Remove duplicates based on website or name
  const uniqueCompanies = allCompanies.filter(
    (company, index, self) =>
      index ===
      self.findIndex((c) => {
        if (c.website && company.website && c.website === company.website) return true
        if (c.name.toLowerCase() === company.name.toLowerCase()) return true
        return false
      }),
  )

  console.log("Final search results:", uniqueCompanies.length, "companies")
  return uniqueCompanies
}
