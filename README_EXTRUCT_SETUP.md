# Extruct AI Integration Setup

## Overview
Your GETNI.US platform now integrates with Extruct AI for AI-powered company research and analysis.

## Environment Variables

⚠️ **SECURITY WARNING**: Never commit API keys to version control or share them publicly.

Add the following to your `.env.local` file (create this file if it doesn't exist):

```env
# Extruct AI Configuration
EXTRUCT_API_KEY=your_extruct_api_key_here
```

**Get your API key from:**
1. Go to [Extruct AI Dashboard](https://app.extruct.ai)
2. Navigate to API Tokens section
3. Copy your API key (it should start with `sk_live_` or `sk_test_`)

**Important:**
- The `.env.local` file is already in `.gitignore` and won't be committed
- Keep your API key secure and rotate it if compromised
- Use different keys for development and production

## Features Added

### 1. API Routes
- `/api/extruct/route.ts` - Basic Extruct API operations (GET/POST)
- `/api/extruct/tables/route.ts` - Table management
- `/api/extruct/search/route.ts` - Company search via Extruct AI

### 2. Utility Library
- `lib/extruct-ai.ts` - Extruct AI client with TypeScript interfaces

### 3. Search Integration
- Updated `lib/search-apis.ts` with `searchWithExtruct()` function
- Main search now uses Extruct AI instead of Google Custom Search
- Fallback to sample data if Extruct AI fails

## How It Works

1. **Search**: When users search, the app creates a temporary Extruct AI table
2. **AI Research**: Extruct AI agents research each company using natural language prompts
3. **Data Population**: Results are populated with comprehensive company data
4. **Display**: Results are transformed and displayed in the AG Grid spreadsheet

## API Key Management
- Your API key is securely stored as an environment variable
- Never commit API keys to version control
- The key has been configured for production use

## Testing
Visit `http://localhost:3000` and try searching for companies. The system now uses Extruct AI for intelligent company research and data extraction.

## Extruct AI Benefits
- **AI-Powered Research**: Advanced AI agents extract data from multiple sources
- **Structured Data**: Consistent schema across all companies
- **Custom Fields**: Add any data points you need using natural language
- **Real-Time Updates**: Continuously update and expand research
- **Platform Integration**: Full integration with Extruct AI web platform
