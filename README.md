# Getnius - Market Intelligence Platform

A powerful market research and intelligence platform that helps you find companies, competitors, and market opportunities.

## Features

- **Smart Search**: AI-powered search across multiple data sources
- **Autocomplete**: Intelligent suggestions and query completion
- **Company Discovery**: Find companies by industry, technology, location, and more
- **Data Enrichment**: Get detailed company information including funding, employees, and contact details
- **Export Capabilities**: Export results to CSV, Google Sheets, or CRM systems

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Search Functionality

The search bar works with or without API keys:

### Without API Keys (Default)
- Uses sample data and alternative search methods
- Provides realistic company examples based on your search query
- Works immediately without any setup

### With API Keys (Enhanced)
For enhanced search capabilities, you can add the following environment variables:

Create a `.env.local` file in the root directory:

```env
# Firecrawl API Key (https://firecrawl.dev/)
FIRECRAWL_API_KEY=your_firecrawl_api_key_here

# Google Custom Search API (https://developers.google.com/custom-search)
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_google_search_engine_id_here

# Exa API Key (https://exa.ai/)
EXA_API_KEY=your_exa_api_key_here
```

## How to Use

1. **Enter a search query** in the search bar (e.g., "AI meeting transcription tools")
2. **Select from suggestions** or use the quick completion pills
3. **Review results** and mark companies as relevant/not relevant
4. **Export your findings** or continue to enrichment

## Search Examples

Try these example searches:
- "AI meeting transcription tools"
- "drone delivery startups"
- "fintech payment processing"
- "UX designers NYC"
- "series B 2024 startups"

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons
- **Search APIs**: Firecrawl, Google Custom Search, Exa
- **Fallback**: Alternative search with sample data

## Troubleshooting

### Search Not Working
- The search functionality works without API keys using sample data
- If you want enhanced search, add the required API keys to `.env.local`
- Check the browser console for any error messages

### No Results
- Try different search terms
- Use the search examples provided
- The alternative search provides sample data for common queries

## Contributing

This is a demo project showcasing market intelligence capabilities. Feel free to explore the code and adapt it for your needs. 