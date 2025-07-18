import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Google Custom Search API call
    const searchQuery = `${query} company startup business site:linkedin.com OR site:crunchbase.com OR site:angel.co`
    const googleResponse = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&num=10`,
    )

    if (!googleResponse.ok) {
      throw new Error(`Google API error: ${googleResponse.status}`)
    }

    const googleData = await googleResponse.json()

    // Transform Google results to our Company format
    const companies =
      googleData.items
        ?.map((result: any, index: number) => {
          const url = new URL(result.link)
          const domain = extractDomainFromResult(result)

          return {
            id: `google_${index}_${Date.now()}`,
            name: extractCompanyNameFromGoogle(result.title, result.snippet),
            description: result.snippet || "",
            website: domain ? `https://${domain}` : result.link,
            employees: extractEmployeeCountFromGoogle(result.snippet),
            funding: extractFundingFromGoogle(result.snippet),
            location: extractLocationFromGoogle(result.snippet),
            industry: extractIndustryFromGoogle(result.snippet, query),
            founded: extractFoundedYearFromGoogle(result.snippet),
            email: undefined,
            phone: undefined,
            logo: domain ? `https://logo.clearbit.com/${domain}` : undefined,
            relevance: null,
            status: "pending" as const,
            comment: "",
            enriched: false,
            source: "google" as const,
          }
        })
        .filter((company: any) => company.name && company.name.length > 0) || []

    return NextResponse.json({ companies })
  } catch (error) {
    console.error("Google search error:", error)
    return NextResponse.json({ error: "Failed to search with Google" }, { status: 500 })
  }
}

function extractDomainFromResult(result: any): string | undefined {
  // Try to extract company domain from LinkedIn or Crunchbase URLs
  if (result.link.includes("linkedin.com/company/")) {
    const companySlug = result.link.split("/company/")[1]?.split("/")[0]
    return companySlug ? `${companySlug}.com` : undefined
  }

  if (result.link.includes("crunchbase.com/organization/")) {
    const companySlug = result.link.split("/organization/")[1]?.split("/")[0]
    return companySlug ? `${companySlug}.com` : undefined
  }

  // Extract from displayLink
  return result.displayLink?.replace("www.", "")
}

function extractCompanyNameFromGoogle(title: string, snippet: string): string {
  // Clean up title from LinkedIn/Crunchbase
  if (title.includes("LinkedIn")) {
    return title
      .split("|")[0]
      .trim()
      .replace(/\s*-\s*LinkedIn$/, "")
  }

  if (title.includes("Crunchbase")) {
    return title
      .split("|")[0]
      .trim()
      .replace(/\s*-\s*Crunchbase$/, "")
  }

  // Extract from snippet if title is not clear
  const companyPattern = /^([^|•-]+?)(?:\s*[|•-]|$)/
  const match = title.match(companyPattern)
  return match ? match[1].trim() : title.split(" ")[0]
}

function extractEmployeeCountFromGoogle(snippet: string): string | undefined {
  const patterns = [/(\d+[-–]\d+)\s*employees?/i, /(\d+)\+?\s*employees?/i, /team\s*size:?\s*(\d+[-–]\d+)/i]

  for (const pattern of patterns) {
    const match = snippet?.match(pattern)
    if (match) return match[1]
  }

  return undefined
}

function extractFundingFromGoogle(snippet: string): string | undefined {
  const patterns = [
    /raised\s*\$?([\d.]+[MBK]?)\s*(million|billion)?/i,
    /funding:\s*\$?([\d.]+[MBK]?)/i,
    /\$?([\d.]+[MBK]?)\s*in\s*funding/i,
  ]

  for (const pattern of patterns) {
    const match = snippet?.match(pattern)
    if (match) return `$${match[1]}${match[2] ? match[2].charAt(0).toUpperCase() : ""}`
  }

  return undefined
}

function extractLocationFromGoogle(snippet: string): string | undefined {
  const patterns = [
    /based\s*in\s*([^,.]+(?:,\s*[A-Z]{2})?)/i,
    /location:?\s*([^,.]+(?:,\s*[A-Z]{2})?)/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})/,
  ]

  for (const pattern of patterns) {
    const match = snippet?.match(pattern)
    if (match) return match[1].trim()
  }

  return undefined
}

function extractIndustryFromGoogle(snippet: string, query: string): string | undefined {
  const industries = [
    "AI",
    "Machine Learning",
    "SaaS",
    "FinTech",
    "HealthTech",
    "EdTech",
    "E-commerce",
    "Cybersecurity",
    "Blockchain",
    "IoT",
    "Robotics",
  ]

  for (const industry of industries) {
    if (
      query.toLowerCase().includes(industry.toLowerCase()) ||
      snippet?.toLowerCase().includes(industry.toLowerCase())
    ) {
      return industry
    }
  }

  return undefined
}

function extractFoundedYearFromGoogle(snippet: string): string | undefined {
  const patterns = [/founded\s*in\s*(\d{4})/i, /established\s*(\d{4})/i, /since\s*(\d{4})/i]

  for (const pattern of patterns) {
    const match = snippet?.match(pattern)
    if (match) {
      const year = Number.parseInt(match[1])
      if (year >= 1900 && year <= new Date().getFullYear()) {
        return match[1]
      }
    }
  }

  return undefined
}
