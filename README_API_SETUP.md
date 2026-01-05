# API Setup Guide

## Google Custom Search API Setup

To enable Google search functionality, you need to set up Google API credentials:

### 1. Get Google API Key
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Enable "Custom Search JSON API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key

### 2. Create Custom Search Engine
1. Go to [Google Custom Search](https://cse.google.com/)
2. Click "New search engine"
3. Configure:
   - Sites to search: leave blank for entire web
   - Name: your choice
   - Language: English
4. Click "Create"
5. Copy the "Search engine ID" from the setup page

### 3. Environment Variables
Create a `.env.local` file in your project root:

```env
GOOGLE_API_KEY=your_actual_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_actual_search_engine_id_here
```

### 4. Restart Development Server
After adding environment variables, restart your dev server:

```bash
npm run dev
```

## Alternative APIs (Optional)

You can also configure these optional APIs:

### Firecrawl API
```env
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
```

### Exa API
```env
EXA_API_KEY=your_exa_api_key_here
```

## Testing

Once configured, try searching for companies. The app will automatically fall back to sample data if APIs are not configured.
