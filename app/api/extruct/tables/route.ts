import { NextRequest, NextResponse } from 'next/server'

const EXTRUCT_API_BASE = 'https://api.extruct.ai/v1'
const EXTRUCT_API_KEY = process.env.EXTRUCT_API_KEY

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${EXTRUCT_API_BASE}/tables`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${EXTRUCT_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Extruct API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Extruct API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tables from Extruct AI' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, columns } = body

    if (!name || !columns) {
      return NextResponse.json(
        { error: 'name and columns are required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${EXTRUCT_API_BASE}/tables`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${EXTRUCT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description: description || '',
        columns,
      }),
    })

    if (!response.ok) {
      throw new Error(`Extruct API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Extruct API error:', error)
    return NextResponse.json(
      { error: 'Failed to create table in Extruct AI' },
      { status: 500 }
    )
  }
}
