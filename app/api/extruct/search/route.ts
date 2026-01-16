import { NextRequest, NextResponse } from 'next/server'
import { extructAI } from '@/lib/extruct-ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, limit = 50 } = body

    if (!query) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 })
    }

    console.log('Searching with Extruct AI:', query)

    const companies = await extructAI.searchCompanies(query, limit)

    // Transform Extruct AI results to our Company interface format
    const transformedCompanies = companies.map((company, index) => ({
      id: company.id || `extruct_${index}_${Date.now()}`,
      name: company.name || company['Company Name'] || 'Unknown Company',
      description: company.description || company['Description'] || '',
      website: company.website || company['Website'],
      employees: company.employees?.toString() || company['Employees']?.toString(),
      funding: company.funding || company['Funding'],
      location: company.location || company['Location'],
      industry: company.industry || company['Industry'],
      founded: company.founded?.toString() || company['Founded']?.toString(),
      email: company.email,
      phone: company.phone,
      logo: company.logo,
      relevance: null,
      status: 'pending' as const,
      comment: '',
      enriched: true,
      source: 'extruct' as const,
    }))

    console.log(`Found ${transformedCompanies.length} companies via Extruct AI`)

    return NextResponse.json({
      companies: transformedCompanies,
      total: transformedCompanies.length,
      source: 'extruct'
    })
  } catch (error) {
    console.error('Extruct AI search error:', error)
    return NextResponse.json(
      { error: 'Failed to search with Extruct AI', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
