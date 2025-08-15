import { NextRequest, NextResponse } from 'next/server'
import { type Company } from '@/lib/search-apis'

export async function POST(req: NextRequest) {
  const { companies } = await req.json() as { companies: Company[] }

  try {
    // In a real implementation, you'd call your AI service here
    // For now, we'll return mock suggestions
    const suggestions = [
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
      }
    ]

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('AI suggestion generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
