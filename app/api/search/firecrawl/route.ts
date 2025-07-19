import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Updated Firecrawl API v1 call with search endpoint
    const searchResponse = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `${query} company startup business`,
        pageOptions: {
          onlyMainContent: true,
          includeHtml: false,
          includeRawHtml: false,
        },
        searchOptions: {
          limit: 10,
        },
      }),
    })

    if (!searchResponse.ok) {
      console.error(`Firecrawl API error: ${searchResponse.status}`)
      // Fallback to alternative search method
      return await fallbackSearch(query)
    }

    const searchData = await searchResponse.json()

    // Transform Firecrawl results to our Company format
    const companies =
      searchData.data?.map((result: any, index: number) => {
        const url = result.url ? new URL(result.url) : null
        const domain = url ? url.hostname.replace("www.", "") : ""

        return {
          id: `fc_${index}_${Date.now()}`,
          name: extractCompanyName(result.metadata?.title || result.title, domain),
          description:
            result.metadata?.description || result.description || result.markdown?.substring(0, 200) + "..." || "",
          website: result.url,
          employees: extractEmployeeCount(result.markdown || result.content),
          funding: extractFunding(result.markdown || result.content),
          location: extractLocation(result.markdown || result.content),
          industry: extractIndustry(result.markdown || result.content, query),
          founded: extractFoundedYear(result.markdown || result.content),
          email: extractEmail(result.markdown || result.content),
          phone: extractPhone(result.markdown || result.content),
          logo: domain ? `https://logo.clearbit.com/${domain}` : undefined,
          relevance: null,
          status: "pending" as const,
          comment: "",
          enriched: false,
          source: "firecrawl" as const,
        }
      }) || []

    return NextResponse.json({ companies })
  } catch (error) {
    console.error("Firecrawl search error:", error)
    // Fallback to alternative search
    return await fallbackSearch(request)
  }
}

// Fallback search using scraping approach
async function fallbackSearch(queryOrRequest: string | NextRequest) {
  try {
    const query = typeof queryOrRequest === "string" ? queryOrRequest : (await queryOrRequest.json()).query

    // Use a different approach - scrape search results from multiple sources
    const searchUrls = [
      `https://www.crunchbase.com/discover/organization.companies/field/categories/AI`,
      `https://angel.co/companies`,
      `https://www.producthunt.com/search?q=${encodeURIComponent(query)}`,
    ]

    const companies = []

    // Try scraping individual company pages if we have specific URLs
    for (const url of searchUrls.slice(0, 2)) {
      try {
        const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url,
            pageOptions: {
              onlyMainContent: true,
              includeHtml: false,
            },
          }),
        })

        if (scrapeResponse.ok) {
          const scrapeData = await scrapeResponse.json()
          const extractedCompanies = extractCompaniesFromContent(scrapeData.data?.markdown || "", query)
          companies.push(...extractedCompanies)
        }
      } catch (scrapeError) {
        console.error("Scrape error for", url, scrapeError)
      }
    }

    return NextResponse.json({ companies: companies.slice(0, 10) })
  } catch (error) {
    console.error("Fallback search error:", error)
    return NextResponse.json({ companies: [] })
  }
}

// Extract companies from scraped content
function extractCompaniesFromContent(content: string, query: string) {
  const companies = []

  // Simple pattern matching for company information
  const lines = content.split("\n")
  let currentCompany: any = {}

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Look for company names (usually in headers or bold text)
    if (line.match(/^#+\s+(.+)/) || line.match(/\*\*(.+?)\*\*/)) {
      if (currentCompany.name) {
        companies.push(currentCompany)
      }

      const nameMatch = line.match(/^#+\s+(.+)/) || line.match(/\*\*(.+?)\*\*/)
      currentCompany = {
        id: `extracted_${companies.length}_${Date.now()}`,
        name: nameMatch ? nameMatch[1] : line,
        description: "",
        website: undefined,
        employees: undefined,
        funding: undefined,
        location: undefined,
        industry: extractIndustry(line, query),
        founded: undefined,
        email: undefined,
        phone: undefined,
        logo: undefined,
        relevance: null,
        status: "pending" as const,
        comment: "",
        enriched: false,
        source: "firecrawl" as const,
      }
    }

    // Look for descriptions
    if (currentCompany.name && !currentCompany.description && line.length > 20 && line.length < 200) {
      currentCompany.description = line
    }

    // Look for websites
    const urlMatch = line.match(/(https?:\/\/[^\s]+)/)
    if (urlMatch && !currentCompany.website) {
      currentCompany.website = urlMatch[1]
      const domain = new URL(urlMatch[1]).hostname.replace("www.", "")
      currentCompany.logo = `https://logo.clearbit.com/${domain}`
    }

    // Extract other data
    currentCompany.employees = currentCompany.employees || extractEmployeeCount(line)
    currentCompany.funding = currentCompany.funding || extractFunding(line)
    currentCompany.location = currentCompany.location || extractLocation(line)
    currentCompany.founded = currentCompany.founded || extractFoundedYear(line)
  }

  if (currentCompany.name) {
    companies.push(currentCompany)
  }

  return companies.filter((c) => c.name && c.name.length > 0)
}

// Helper functions to extract data from content
function extractCompanyName(title: string, domain: string): string {
  if (!title) return domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1)

  // Clean up title
  const cleanTitle = title.replace(/\s*[-|•]\s*.*$/, "").trim()
  if (cleanTitle && cleanTitle.length > 0 && cleanTitle.length < 50) {
    return cleanTitle
  }

  // Fallback to domain name
  return domain ? domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1) : title
}

function extractEmployeeCount(content: string): string | undefined {
  if (!content) return undefined

  const patterns = [
    /(\d+[-–]\d+)\s*employees?/i,
    /team\s*of\s*(\d+[-–]\d+)/i,
    /(\d+)\+?\s*people/i,
    /(small|medium|large)\s*team/i,
    /(\d+)\s*to\s*(\d+)\s*employees/i,
  ]

  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) {
      if (match[2]) return `${match[1]}-${match[2]}`
      return match[1]
    }
  }

  return undefined
}

function extractFunding(content: string): string | undefined {
  if (!content) return undefined

  const patterns = [
    /raised\s*\$?([\d.]+[MBK]?)\s*(million|billion|thousand)?/i,
    /funding\s*of\s*\$?([\d.]+[MBK]?)/i,
    /\$?([\d.]+[MBK]?)\s*in\s*funding/i,
    /series\s*[ABC]\s*\$?([\d.]+[MBK]?)/i,
    /total\s*funding:\s*\$?([\d.]+[MBK]?)/i,
  ]

  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) {
      const amount = match[1]
      const unit = match[2] ? match[2].charAt(0).toUpperCase() : ""
      return `$${amount}${unit}`
    }
  }

  return undefined
}

function extractLocation(content: string): string | undefined {
  if (!content) return undefined

  const patterns = [
    /based\s*in\s*([^,.]+(?:,\s*[A-Z]{2})?)/i,
    /located\s*in\s*([^,.]+(?:,\s*[A-Z]{2})?)/i,
    /headquarters\s*in\s*([^,.]+(?:,\s*[A-Z]{2})?)/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})/,
    /location:\s*([^,.]+)/i,
  ]

  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) return match[1].trim()
  }

  return undefined
}

function extractIndustry(content: string, query: string): string | undefined {
  if (!content) return undefined

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
    "Biotechnology",
    "Clean Energy",
    "Transportation",
    "Real Estate",
    "Food Tech",
    "AgTech",
    "PropTech",
    "InsurTech",
    "LegalTech",
  ]

  // Check if query contains industry keywords
  for (const industry of industries) {
    if (
      query.toLowerCase().includes(industry.toLowerCase()) ||
      content.toLowerCase().includes(industry.toLowerCase())
    ) {
      return industry
    }
  }

  return undefined
}

function extractFoundedYear(content: string): string | undefined {
  if (!content) return undefined

  const patterns = [
    /founded\s*in\s*(\d{4})/i,
    /established\s*(\d{4})/i,
    /since\s*(\d{4})/i,
    /started\s*in\s*(\d{4})/i,
    /(\d{4})\s*founded/i,
  ]

  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) {
      const year = Number.parseInt(match[1])
      if (year >= 1900 && year <= new Date().getFullYear()) {
        return match[1]
      }
    }
  }

  return undefined
}

function extractEmail(content: string): string | undefined {
  if (!content) return undefined

  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
  const match = content.match(emailPattern)
  return match ? match[1] : undefined
}

function extractPhone(content: string): string | undefined {
  if (!content) return undefined

  const phonePattern = /\+?\d+?[-.\(\s]?\d{3}[-.\)\s]?\d{3}[-.\s]?\d{4}/
  const match = content.match(phonePattern)
  return match ? match[1] : undefined
}
