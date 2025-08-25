import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    const { email, phone, firstName, lastName } = userData

    // For demo purposes, we'll simulate saving to Google Sheets
    // In a real implementation, you would use Google Sheets API
    
    // Mock Google Sheets API call
    console.log('Saving to Google Sheets:', {
      email,
      phone,
      firstName,
      lastName,
      timestamp: new Date().toISOString()
    })

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock response
    const mockResponse = {
      success: true,
      spreadsheetId: 'mock-spreadsheet-id',
      range: 'Sheet1!A1:D1',
      updatedRows: 1,
      userData: {
        email,
        phone: phone || '',
        firstName: firstName || '',
        lastName: lastName || '',
        dateAdded: new Date().toISOString()
      }
    }

    return NextResponse.json(mockResponse)

  } catch (error) {
    console.error('Error saving to Google Sheets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save to Google Sheets' },
      { status: 500 }
    )
  }
}

/* 
For real Google Sheets integration, you would:

1. Install google-auth-library and googleapis:
   npm install google-auth-library googleapis

2. Set up service account credentials:
   - Create a service account in Google Cloud Console
   - Download the JSON key file
   - Add the service account email to your Google Sheet with edit permissions

3. Use this code structure:

import { google } from 'googleapis'

const auth = new google.auth.GoogleAuth({
  keyFile: 'path/to/service-account-key.json', // or use environment variables
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })

const spreadsheetId = 'your-spreadsheet-id'
const range = 'Sheet1!A:D' // Adjust based on your sheet structure

const values = [[email, phone, firstName, lastName, new Date().toISOString()]]

const result = await sheets.spreadsheets.values.append({
  spreadsheetId,
  range,
  valueInputOption: 'RAW',
  requestBody: {
    values,
  },
})

*/
