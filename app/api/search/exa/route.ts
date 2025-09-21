import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query, numResults } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Check if API key is available
    if (!process.env.EXA_API_KEY) {
      console.log("Exa API key not found, returning mock results for testing")
      
      // Return mock data for testing
      const mockCompanies = [
        {
          id: `mock_1_${Date.now()}`,
          name: "OpenAI",
          description: "AI research company focused on developing safe artificial general intelligence",
          website: "https://openai.com",
          employees: "500-1000",
          funding: "$11.3B",
          location: "San Francisco, CA",
          industry: "AI",
          founded: "2015",
          email: undefined,
          phone: undefined,
          logo: "https://logo.clearbit.com/openai.com",
          relevance: null,
          status: "pending" as const,
          comment: "",
          enriched: false,
          source: "exa" as const,
        },
        {
          id: `mock_2_${Date.now()}`,
          name: "Anthropic",
          description: "AI safety company building reliable, interpretable, and steerable AI systems",
          website: "https://anthropic.com",
          employees: "100-500",
          funding: "$750M",
          location: "San Francisco, CA",
          industry: "AI",
          founded: "2021",
          email: undefined,
          phone: undefined,
          logo: "https://logo.clearbit.com/anthropic.com",
          relevance: null,
          status: "pending" as const,
          comment: "",
          enriched: false,
          source: "exa" as const,
        },
        {
          id: `mock_3_${Date.now()}`,
          name: "Stability AI",
          description: "Leading open source generative AI company",
          website: "https://stability.ai",
          employees: "100-500",
          funding: "$101M",
          location: "London, UK",
          industry: "AI",
          founded: "2019",
          email: undefined,
          phone: undefined,
          logo: "https://logo.clearbit.com/stability.ai",
          relevance: null,
          status: "pending" as const,
          comment: "",
          enriched: false,
          source: "exa" as const,
        }
      ]
      
      return NextResponse.json({ companies: mockCompanies })
    }

    // Exa API call - use numResults if provided, otherwise default to 10
    const exaResponse = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EXA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `${query} company startup business`,
        numResults: numResults || 10, // Use the provided numResults or default to 10
        includeDomains: ["crunchbase.com", "linkedin.com", "angel.co", "techcrunch.com"],
        useAutoprompt: true,
        contents: {
          text: true,
          highlights: true,
          summary: true,
        },
      }),
    })

    if (!exaResponse.ok) {
      throw new Error(`Exa API error: ${exaResponse.status}`)
    }

    // Wait until response arrives
    const exaData = await exaResponse.json()

    // Transform Exa results to our Company format
    const companies =
      exaData.results
        ?.map((result: any, index: number) => {
          const url = new URL(result.url)
          const domain = extractDomainFromExa(result)

          return {
            id: `exa_${index}_${Date.now()}`,
            name: extractCompanyNameFromExa(result.title, result.text),
            description: result.summary || result.highlights?.join(" ") || result.text?.substring(0, 200) + "..." || "",
            website: domain ? `https://${domain}` : result.url,
            employees: extractEmployeeCountFromExa(result.text),
            funding: extractFundingFromExa(result.text),
            location: extractLocationFromExa(result.text),
            industry: extractIndustryFromExa(result.text, query),
            founded: extractFoundedYearFromExa(result.text),
            email: undefined,
            phone: undefined,
            logo: domain ? `https://logo.clearbit.com/${domain}` : undefined,
            relevance: null,
            status: "pending" as const,
            comment: "",
            enriched: false,
            source: "exa" as const,
          }
        })
        .filter((company: any) => company.name && company.name.length > 0) || []

    return NextResponse.json({ companies })
  } catch (error) {
    console.error("Exa search error:", error)
    return NextResponse.json({ error: "Failed to search with Exa" }, { status: 500 })
  }
}

function extractDomainFromExa(result: any): string | undefined {
  // Try to extract company domain from various sources
  if (result.url.includes("crunchbase.com/organization/")) {
    const companySlug = result.url.split("/organization/")[1]?.split("/")[0]
    return companySlug ? `${companySlug}.com` : undefined
  }

  if (result.url.includes("linkedin.com/company/")) {
    const companySlug = result.url.split("/company/")[1]?.split("/")[0]
    return companySlug ? `${companySlug}.com` : undefined
  }

  // Look for website mentions in text
  const websitePattern = /(?:website|site|domain):\s*([\w.-]+\.[\w]+)/i
  const match = result.text?.match(websitePattern)
  if (match) return match[1]

  return undefined
}

function extractCompanyNameFromExa(title: string, text: string): string {
  // Clean up title
  const cleanTitle = title.replace(/\s*[-|•]\s*.*$/, "").trim()
  if (cleanTitle && cleanTitle.length > 0 && cleanTitle.length < 50) {
    return cleanTitle
  }

  // Try to extract from text
  const companyPattern = /^([A-Z][a-zA-Z\s&.]+?)(?:\s+is\s+|\s+provides\s+|\s+offers\s+|\.)/
  const match = text?.match(companyPattern)
  return match ? match[1].trim() : title.split(" ").slice(0, 3).join(" ")
}

function extractEmployeeCountFromExa(text: string): string | undefined {
  const patterns = [
    /(\d+[-–]\d+)\s*employees?/i,
    /team\s*of\s*(\d+[-–]\d+)/i,
    /(\d+)\+?\s*people/i,
    /workforce\s*of\s*(\d+[-–]\d+)/i,
  ]

  for (const pattern of patterns) {
    const match = text?.match(pattern)
    if (match) return match[1]
  }

  return undefined
}

function extractFundingFromExa(text: string): string | undefined {
  const patterns = [
    /raised\s*\$?([\d.]+[MBK]?)\s*(million|billion|thousand)?/i,
    /funding\s*of\s*\$?([\d.]+[MBK]?)/i,
    /\$?([\d.]+[MBK]?)\s*in\s*funding/i,
    /series\s*[ABC]\s*\$?([\d.]+[MBK]?)/i,
    /total\s*funding:\s*\$?([\d.]+[MBK]?)/i,
  ]

  for (const pattern of patterns) {
    const match = text?.match(pattern)
    if (match) return `$${match[1]}${match[2] ? match[2].charAt(0).toUpperCase() : ""}`
  }

  return undefined
}

function extractLocationFromExa(text: string): string | undefined {
  const patterns = [
    /based\s*in\s*([^,.]+(?:,\s*[A-Z]{2})?)/i,
    /located\s*in\s*([^,.]+(?:,\s*[A-Z]{2})?)/i,
    /headquarters\s*in\s*([^,.]+(?:,\s*[A-Z]{2})?)/i,
    /location:\s*([^,.]+(?:,\s*[A-Z]{2})?)/i,
  ]

  for (const pattern of patterns) {
    const match = text?.match(pattern)
    if (match) return match[1].trim()
  }

  return undefined
}

function extractIndustryFromExa(text: string, query: string): string | undefined {
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
  ]

  for (const industry of industries) {
    if (query.toLowerCase().includes(industry.toLowerCase()) || text?.toLowerCase().includes(industry.toLowerCase())) {
      return industry
    }
  }

  return undefined
}

function extractFoundedYearFromExa(text: string): string | undefined {
  const patterns = [/founded\s*in\s*(\d{4})/i, /established\s*(\d{4})/i, /since\s*(\d{4})/i, /started\s*in\s*(\d{4})/i]

  for (const pattern of patterns) {
    const match = text?.match(pattern)
    if (match) {
      const year = Number.parseInt(match[1])
      if (year >= 1900 && year <= new Date().getFullYear()) {
        return match[1]
      }
    }
  }

  return undefined
}
