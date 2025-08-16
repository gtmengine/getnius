import { NextResponse } from 'next/server'
import { generateWithMistral } from '@/lib/mistral-helper'

export async function GET() {
  const testInput = "Example company description: Acme Inc. is a tech company based in San Francisco. They raised $10M in Series A funding in 2020 and have 50 employees."

  try {
    const apiKey = process.env.MISTRAL_API_KEY || ''
    const result = await generateWithMistral(apiKey, testInput)
    return NextResponse.json({
      status: 'success',
      input: testInput,
      output: result
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
