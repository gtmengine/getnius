import { NextRequest, NextResponse } from 'next/server'
import { type Company } from '@/lib/search-apis'
import { generateWithMistral, getMockSuggestions } from '@/lib/mistral-helper'

export async function POST(req: NextRequest) {
  const { companies } = await req.json() as { companies: Company[] }
  
  // Check if we should use mock data
  const useMockData = process.env.USE_MOCK_SUGGESTIONS === 'true' || 
                      process.env.NODE_ENV === 'development'
  
  if (useMockData) {
    return NextResponse.json(getMockSuggestions())
  }

  try {
    // Get API key from environment variables
    const apiKey = process.env.MISTRAL_API_KEY
    if (!apiKey) {
      throw new Error('Mistral API key not configured')
    }
    
    // Prepare input data - use first 5 companies to save tokens
    const descriptions = companies
      .slice(0, 5)
      .map(c => c.description || '')
      .filter(Boolean)
      .join('\n\n')
    
    // Call Mistral API
    const suggestions = await generateWithMistral(apiKey, descriptions)
    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('AI suggestion generation failed:', error)
    // Fall back to mock data in case of error
    return NextResponse.json(
      getMockSuggestions(),
      { status: 500 }
    )
  }
}
