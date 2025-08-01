# Perplexity API Integration Setup

This module integrates with Perplexity AI to provide intelligent search suggestions for the market research platform.

## Setup Instructions

### 1. Get Perplexity API Key

1. Visit [Perplexity AI Settings](https://www.perplexity.ai/settings/api)
2. Sign up or log in to your account
3. Generate a new API key
4. Copy the API key

### 2. Environment Configuration

Create a `.env.local` file in your project root and add:

```bash
NEXT_PUBLIC_PERPLEXITY_API_KEY=your_actual_api_key_here
```

### 3. Features

The Perplexity integration provides:

- **Intelligent Suggestions**: AI-powered search suggestions based on user queries
- **Categorized Results**: Suggestions are categorized as company, industry, technology, location, or keyword
- **Confidence Scores**: Each suggestion includes a confidence score
- **Contextual Suggestions**: Can provide suggestions based on user context
- **Caching**: Results are cached to avoid repeated API calls
- **Fallback**: Graceful fallback to basic suggestions if API is unavailable

### 4. API Endpoints

- `POST /api/suggestions/perplexity` - Get suggestions for a query
- `GET /api/suggestions/perplexity?q=query` - Get suggestions via GET request

### 5. Usage

The enhanced suggestions appear automatically when users type in the search box (after 2+ characters). Suggestions are displayed with:

- Type-specific icons and colors
- Confidence scores (optional)
- Click-to-search functionality
- Debounced API calls (300ms)

### 6. Components

- `EnhancedSearchSuggestions` - Main component for displaying AI suggestions
- `getPerplexitySuggestions()` - Core API function
- `getContextualSuggestions()` - Context-aware suggestions

### 7. Error Handling

The integration includes comprehensive error handling:

- API failures fall back to basic suggestions
- Network errors are handled gracefully
- Rate limiting is respected
- Invalid responses are parsed safely

### 8. Performance

- Debounced API calls prevent excessive requests
- Client-side caching reduces API usage
- Efficient rendering with React optimization
- Minimal bundle size impact

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the key is correct and active
   - Check if you have sufficient credits
   - Ensure the key has the correct permissions

2. **No Suggestions Appearing**
   - Check browser console for errors
   - Verify the API endpoint is accessible
   - Check network connectivity

3. **Slow Response Times**
   - The API has a 300ms debounce
   - Check your internet connection
   - Verify API rate limits

### Debug Mode

To enable debug logging, add to your `.env.local`:

```bash
NEXT_PUBLIC_DEBUG_SUGGESTIONS=true
```

This will log API requests and responses to the console. 