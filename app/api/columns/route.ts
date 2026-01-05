import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get current column data from the request or generate smart suggestions
    const url = new URL(request.url)
    const searchQuery = url.searchParams.get('query') || ''
    const existingColumns = url.searchParams.get('existing')?.split(',') || []

    const columnSuggestions = await generateColumnSuggestions(searchQuery, existingColumns)

    return NextResponse.json({ suggestions: columnSuggestions })
  } catch (error) {
    console.error("Column suggestions error:", error)
    return NextResponse.json({ error: "Failed to generate column suggestions" }, { status: 500 })
  }
}

async function generateColumnSuggestions(searchQuery: string, existingColumns: string[]) {
  const baseSuggestions = [
    'Company Size',
    'Funding Stage',
    'Revenue Range',
    'Employee Count',
    'Industry Sector',
    'Location',
    'Founded Year',
    'Growth Rate',
    'Key Technologies',
    'Contact Email',
    'Website',
    'Social Media',
    'Product Category',
    'Target Market',
    'Competitors',
    'CEO Name',
    'Headquarters',
    'Customer Count',
    'Monthly Active Users',
    'Annual Recurring Revenue',
    'Market Cap',
    'Latest Funding Round',
    'Investor Names',
    'Product Pricing',
    'Key Partnerships',
    'Competitive Advantages',
    'Business Model',
    'Geographic Presence',
    'Customer Acquisition Cost',
    'Lifetime Value',
    'Churn Rate',
    'Product Roadmap',
    'Team Size',
    'Office Locations',
    'Parent Company',
    'Subsidiaries',
    'Recent Acquisitions',
    'Patents Filed',
    'Regulatory Compliance',
    'Sustainability Score'
  ]

  // Filter out existing columns
  let suggestions = baseSuggestions.filter(suggestion =>
    !existingColumns.includes(suggestion.toLowerCase().replace(/\s+/g, '_'))
  )

  // If there's a search query, prioritize relevant columns
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()

    // Industry-specific column prioritization
    const industryPriorities: { [key: string]: string[] } = {
      'ai': ['Key Technologies', 'Team Size', 'Funding Stage', 'Product Roadmap'],
      'fintech': ['Regulatory Compliance', 'Customer Acquisition Cost', 'Product Pricing', 'Market Cap'],
      'healthtech': ['Regulatory Compliance', 'Customer Count', 'Team Size', 'Geographic Presence'],
      'saas': ['Monthly Active Users', 'Annual Recurring Revenue', 'Churn Rate', 'Customer Acquisition Cost'],
      'ecommerce': ['Product Category', 'Customer Count', 'Geographic Presence', 'Competitive Advantages'],
      'startup': ['Funding Stage', 'Team Size', 'Latest Funding Round', 'Investor Names'],
      'enterprise': ['Annual Recurring Revenue', 'Customer Count', 'Team Size', 'Geographic Presence']
    }

    // Find matching industries and prioritize those columns
    const prioritizedColumns: string[] = []
    Object.entries(industryPriorities).forEach(([industry, columns]) => {
      if (query.includes(industry)) {
        columns.forEach(column => {
          if (suggestions.includes(column) && !prioritizedColumns.includes(column)) {
            prioritizedColumns.push(column)
          }
        })
      }
    })

    // Move prioritized columns to the front
    if (prioritizedColumns.length > 0) {
      const remainingSuggestions = suggestions.filter(s => !prioritizedColumns.includes(s))
      suggestions = [...prioritizedColumns, ...remainingSuggestions]
    }
  }

  // Return top 15 suggestions
  return suggestions.slice(0, 15)
}
