import { NextRequest, NextResponse } from 'next/server'

const EXTRUCT_API_BASE = 'https://api.extruct.ai/v1'
const EXTRUCT_API_KEY = process.env.EXTRUCT_API_KEY

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tableId = searchParams.get('tableId')

    if (!tableId) {
      return NextResponse.json({ error: 'tableId is required' }, { status: 400 })
    }

    const response = await fetch(`${EXTRUCT_API_BASE}/tables/${tableId}/data`, {
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
      { error: 'Failed to fetch data from Extruct AI' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tableId, rows, run = true } = body

    if (!tableId || !rows) {
      return NextResponse.json(
        { error: 'tableId and rows are required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${EXTRUCT_API_BASE}/tables/${tableId}/rows`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${EXTRUCT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rows,
        run,
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
      { error: 'Failed to update Extruct AI table' },
      { status: 500 }
    )
  }
}
