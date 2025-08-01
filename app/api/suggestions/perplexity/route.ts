import { NextRequest, NextResponse } from "next/server";
import { getPerplexitySuggestions, getContextualSuggestions } from "../../../../lib/perplexity-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, context } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required and must be a string" },
        { status: 400 }
      );
    }

    // If context is provided, use contextual suggestions
    if (context) {
      const suggestions = await getContextualSuggestions(query, context);
      return NextResponse.json({
        suggestions,
        query,
        timestamp: new Date().toISOString(),
        source: "perplexity-contextual",
      });
    }

    // Otherwise, use basic suggestions
    const suggestions = await getPerplexitySuggestions(query);
    
    return NextResponse.json({
      suggestions,
      query,
      timestamp: new Date().toISOString(),
      source: "perplexity",
    });
  } catch (error) {
    console.error("Perplexity suggestions API error:", error);
    return NextResponse.json(
      { error: "Failed to get suggestions" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const suggestions = await getPerplexitySuggestions(query);
    
    return NextResponse.json({
      suggestions,
      query,
      timestamp: new Date().toISOString(),
      source: "perplexity",
    });
  } catch (error) {
    console.error("Perplexity suggestions API error:", error);
    return NextResponse.json(
      { error: "Failed to get suggestions" },
      { status: 500 }
    );
  }
} 