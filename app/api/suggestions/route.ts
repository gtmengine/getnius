import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const suggestions = await generateSmartSuggestions(query.toLowerCase())

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Suggestions error:", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}

async function generateSmartSuggestions(query: string) {
  const suggestions = []

  // Industry-specific suggestions
  const industryMap = {
    ai: [
      "AI transcription",
      "machine learning",
      "artificial intelligence",
      "AI meeting tools",
      "AI assistants",
      "computer vision",
      "natural language processing",
    ],
    drone: [
      "drone delivery",
      "UAS last-mile",
      "BVLOS logistics",
      "unmanned aerial delivery",
      "autonomous cargo drones",
      "delivery drones",
    ],
    fintech: [
      "financial technology",
      "digital banking",
      "payment processing",
      "blockchain finance",
      "cryptocurrency",
      "digital wallets",
      "neobanks",
    ],
    health: ["healthtech", "digital health", "telemedicine", "health monitoring", "medical devices", "biotech"],
    education: ["edtech", "online learning", "educational technology", "e-learning platforms", "learning management"],
    ecommerce: ["e-commerce", "online retail", "marketplace", "dropshipping", "digital commerce"],
    saas: ["software as a service", "cloud software", "B2B software", "enterprise software"],
    cyber: ["cybersecurity", "information security", "data protection", "security software"],
    blockchain: ["cryptocurrency", "DeFi", "NFT", "web3", "smart contracts"],
    iot: ["internet of things", "connected devices", "smart sensors", "industrial IoT"],
    clean: ["clean energy", "renewable energy", "solar power", "wind energy", "green technology"],
    mobility: ["transportation", "mobility solutions", "ride sharing", "autonomous vehicles"],
    "real estate": ["proptech", "real estate technology", "property management", "real estate platforms"],
  }

  // Technology-specific suggestions
  const techMap = {
    meeting: ["meeting transcription", "video conferencing", "meeting assistant", "collaboration tools"],
    transcription: ["speech-to-text", "voice recognition", "audio transcription", "meeting notes"],
    delivery: ["last-mile delivery", "logistics", "supply chain", "shipping solutions"],
    payment: ["payment processing", "digital payments", "mobile payments", "payment gateway"],
    analytics: ["data analytics", "business intelligence", "data visualization", "predictive analytics"],
    automation: ["process automation", "workflow automation", "robotic process automation"],
    security: ["data security", "network security", "application security", "cloud security"],
  }

  // Location-based suggestions
  const locationMap = {
    "san francisco": ["San Francisco startups", "Bay Area companies", "Silicon Valley"],
    "new york": ["New York startups", "NYC companies", "Manhattan tech"],
    london: ["London startups", "UK companies", "European tech"],
    berlin: ["Berlin startups", "German companies", "European tech"],
    singapore: ["Singapore startups", "Southeast Asian companies"],
    toronto: ["Toronto startups", "Canadian companies"],
    austin: ["Austin startups", "Texas companies"],
    boston: ["Boston startups", "Massachusetts companies"],
  }

  // Company stage suggestions
  const stageMap = {
    startup: ["early-stage startups", "seed stage companies", "pre-seed startups"],
    series: ["Series A companies", "Series B companies", "growth stage"],
    unicorn: ["unicorn companies", "billion dollar startups"],
    public: ["public companies", "IPO companies", "listed companies"],
    enterprise: ["enterprise companies", "large corporations", "Fortune 500"],
  }

  // Check for matches and add suggestions
  for (const [key, values] of Object.entries(industryMap)) {
    if (query.includes(key)) {
      values.forEach((value) => {
        if (!suggestions.find((s) => s.text === value)) {
          suggestions.push({
            text: value,
            type: "industry",
            category: "Industry",
          })
        }
      })
    }
  }

  for (const [key, values] of Object.entries(techMap)) {
    if (query.includes(key)) {
      values.forEach((value) => {
        if (!suggestions.find((s) => s.text === value)) {
          suggestions.push({
            text: value,
            type: "technology",
            category: "Technology",
          })
        }
      })
    }
  }

  for (const [key, values] of Object.entries(locationMap)) {
    if (query.includes(key)) {
      values.forEach((value) => {
        if (!suggestions.find((s) => s.text === value)) {
          suggestions.push({
            text: value,
            type: "location",
            category: "Location",
          })
        }
      })
    }
  }

  for (const [key, values] of Object.entries(stageMap)) {
    if (query.includes(key)) {
      values.forEach((value) => {
        if (!suggestions.find((s) => s.text === value)) {
          suggestions.push({
            text: value,
            type: "company_type",
            category: "Company Stage",
          })
        }
      })
    }
  }

  // Add general keyword suggestions based on partial matches
  const generalSuggestions = [
    "B2B software companies",
    "SaaS startups",
    "AI companies",
    "fintech startups",
    "healthtech companies",
    "edtech platforms",
    "e-commerce solutions",
    "cybersecurity firms",
    "blockchain companies",
    "clean energy startups",
  ]

  generalSuggestions.forEach((suggestion) => {
    if (suggestion.toLowerCase().includes(query) && !suggestions.find((s) => s.text === suggestion)) {
      suggestions.push({
        text: suggestion,
        type: "keyword",
        category: "General",
      })
    }
  })

  // Limit to 8 suggestions and sort by relevance
  return suggestions.slice(0, 8)
}
