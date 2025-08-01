// Perplexity API integration for intelligent search suggestions

export interface PerplexitySuggestion {
  text: string;
  type: "company" | "industry" | "technology" | "location" | "keyword";
  confidence: number;
  reasoning?: string;
}

export interface PerplexityResponse {
  suggestions: PerplexitySuggestion[];
  query: string;
  timestamp: string;
}

// Perplexity API configuration
const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";
const PERPLEXITY_API_KEY = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY || "";

// Cache for suggestions to avoid repeated API calls
const suggestionCache = new Map<string, PerplexitySuggestion[]>();

export async function getPerplexitySuggestions(
  query: string,
  context?: string
): Promise<PerplexitySuggestion[]> {
  // Check cache first
  const cacheKey = `${query}-${context || "default"}`;
  if (suggestionCache.has(cacheKey)) {
    return suggestionCache.get(cacheKey)!;
  }

  try {
    const systemPrompt = `You are an expert market research assistant. Based on the user's search query, provide 5-8 intelligent search suggestions that would help them find relevant companies, industries, or technologies.

Focus on:
- Company types and business models
- Industry sectors and niches
- Technology stacks and tools
- Geographic locations and markets
- Related keywords and concepts

Format each suggestion as a complete search phrase that could be used directly in a search engine.

Context: ${context || "General market research"}`;

    const userPrompt = `Generate search suggestions for: "${query}"

Provide suggestions that would help find:
1. Companies in this space
2. Related industries
3. Technology solutions
4. Market opportunities
5. Competitive landscape

Make suggestions specific and actionable.`;

    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("Perplexity API error:", response.status, response.statusText);
      return getFallbackSuggestions(query);
    }

    const data = await response.json();
    const suggestions = parsePerplexityResponse(data, query);
    
    // Cache the results
    suggestionCache.set(cacheKey, suggestions);
    
    return suggestions;
  } catch (error) {
    console.error("Perplexity API request failed:", error);
    return getFallbackSuggestions(query);
  }
}

function parsePerplexityResponse(data: any, originalQuery: string): PerplexitySuggestion[] {
  try {
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return getFallbackSuggestions(originalQuery);
    }

    // Parse the response to extract suggestions
    const lines = content.split('\n').filter(line => line.trim());
    const suggestions: PerplexitySuggestion[] = [];

    for (const line of lines) {
      // Look for numbered suggestions or bullet points
      const match = line.match(/^[\d\-•]+\.?\s*(.+)$/);
      if (match) {
        const text = match[1].trim();
        if (text.length > 3 && text.length < 100) {
          suggestions.push({
            text,
            type: categorizeSuggestion(text),
            confidence: 0.8,
          });
        }
      }
    }

    // If no structured suggestions found, try to extract from paragraphs
    if (suggestions.length === 0) {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
      for (const sentence of sentences.slice(0, 5)) {
        const text = sentence.trim();
        if (text.length > 5 && text.length < 80) {
          suggestions.push({
            text,
            type: categorizeSuggestion(text),
            confidence: 0.6,
          });
        }
      }
    }

    return suggestions.slice(0, 8); // Limit to 8 suggestions
  } catch (error) {
    console.error("Error parsing Perplexity response:", error);
    return getFallbackSuggestions(originalQuery);
  }
}

function categorizeSuggestion(text: string): PerplexitySuggestion["type"] {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("company") || lowerText.includes("startup") || lowerText.includes("enterprise")) {
    return "company";
  }
  if (lowerText.includes("industry") || lowerText.includes("sector") || lowerText.includes("market")) {
    return "industry";
  }
  if (lowerText.includes("technology") || lowerText.includes("software") || lowerText.includes("platform")) {
    return "technology";
  }
  if (lowerText.includes("location") || lowerText.includes("region") || lowerText.includes("city")) {
    return "location";
  }
  
  return "keyword";
}

function getFallbackSuggestions(query: string): PerplexitySuggestion[] {
  // Fallback suggestions when API is unavailable
  const baseSuggestions = [
    `${query} companies`,
    `${query} startups`,
    `${query} industry`,
    `${query} technology`,
    `${query} solutions`,
    `${query} market`,
    `${query} providers`,
    `${query} platforms`,
  ];

  return baseSuggestions.map((text, index) => ({
    text,
    type: "keyword" as const,
    confidence: 0.5,
  }));
}

// Enhanced suggestions with context
export async function getContextualSuggestions(
  query: string,
  userContext: {
    industry?: string;
    location?: string;
    companySize?: string;
    technology?: string;
  }
): Promise<PerplexitySuggestion[]> {
  const contextString = Object.entries(userContext)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

  return getPerplexitySuggestions(query, contextString);
}

// Clear cache (useful for testing or when cache gets too large)
export function clearSuggestionCache(): void {
  suggestionCache.clear();
}

// Get cache statistics
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: suggestionCache.size,
    keys: Array.from(suggestionCache.keys()),
  };
} 