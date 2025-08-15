import { NextRequest, NextResponse } from 'next/server'
import { type Company } from '@/lib/search-apis'

// Generate suggestions using Mistral API
async function generateWithMistral(apiKey: string, inputText: string) {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'mistral-small',
      messages: [
        {
          role: 'system',
          content: `You are a market intelligence assistant. 
          Suggest 3 column names and prompts for extracting structured information from company descriptions.
          Respond ONLY with a JSON array in this format: 
          [{"name": "Column Name", "prompt": "Extraction prompt"}]`
        },
        {
          role: 'user',
          content: `Suggest data columns for these company descriptions:\n\n${inputText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: 'json_object' }
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Mistral API error: ${errorData.error?.message || response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content
  
  try {
    return JSON.parse(content)
  } catch (e) {
    console.error('Failed to parse Mistral response:', content)
    throw new Error('Invalid response format from Mistral API')
  }
}

// Helper function for mock data
function getMockSuggestions() {
  return [
    {
      name: "Funding Amount",
      prompt: "Extract the total funding amount raised by the company in dollars"
    },
    {
      name: "Headquarters",
      prompt: "Extract the location of the company's headquarters"
    },
    {
      name: "Founding Year",
      prompt: "Extract the year the company was founded"
    },
    {
      name: "Employee Count",
      prompt: "Extract the approximate number of employees"
    },
    {
      name: "Tech Stack",
      prompt: "Identify the main technologies used by the company"
    }
  ]
}


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
