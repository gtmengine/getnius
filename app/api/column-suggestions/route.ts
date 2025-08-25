import { NextRequest, NextResponse } from "next/server";

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";
const PERPLEXITY_API_KEY = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY || "";

interface ColumnSuggestion {
  name: string;
  description: string;
  type: "text" | "number" | "date" | "url" | "email";
  category: "basic" | "financial" | "contact" | "social" | "operational" | "market";
  priority: "high" | "medium" | "low";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { existingColumns = [], dataContext = "", industryHint = "" } = body;

    // Always return fallback suggestions for immediate testing
    return getFallbackColumnSuggestions(existingColumns);

  } catch (error) {
    console.error("Column suggestions API error:", error);
    return getFallbackColumnSuggestions([]);
  }
}

function getFallbackColumnSuggestions(existingColumns: string[]) {
  const allSuggestions: ColumnSuggestion[] = [
    { 
      name: "Company Name", 
      description: "Full company name", 
      type: "text", 
      category: "basic", 
      priority: "high" 
    },
    { 
      name: "CEO Name", 
      description: "Name of the company's CEO", 
      type: "text", 
      category: "contact", 
      priority: "high" 
    },
    { 
      name: "Annual Revenue", 
      description: "Company's yearly revenue in USD", 
      type: "number", 
      category: "financial", 
      priority: "high" 
    },
    { 
      name: "Employee Count", 
      description: "Total number of employees", 
      type: "number", 
      category: "operational", 
      priority: "high" 
    },
    { 
      name: "LinkedIn URL", 
      description: "Company's LinkedIn profile", 
      type: "url", 
      category: "social", 
      priority: "medium" 
    },
    { 
      name: "Website URL", 
      description: "Company's main website", 
      type: "url", 
      category: "contact", 
      priority: "medium" 
    },
    { 
      name: "Industry", 
      description: "Primary industry sector", 
      type: "text", 
      category: "market", 
      priority: "high" 
    },
    { 
      name: "Funding Status", 
      description: "Current funding stage (Seed, Series A, etc.)", 
      type: "text", 
      category: "financial", 
      priority: "high" 
    },
    { 
      name: "Founded Year", 
      description: "Year the company was founded", 
      type: "date", 
      category: "basic", 
      priority: "medium" 
    },
    { 
      name: "Headquarters", 
      description: "Main office location", 
      type: "text", 
      category: "operational", 
      priority: "medium" 
    },
    { 
      name: "Phone Number", 
      description: "Main contact phone number", 
      type: "text", 
      category: "contact", 
      priority: "low" 
    },
    { 
      name: "Email Address", 
      description: "Company contact email", 
      type: "email", 
      category: "contact", 
      priority: "medium" 
    }
  ];

  const filtered = allSuggestions.filter(s => !existingColumns.includes(s.name));
  
  return NextResponse.json({
    suggestions: filtered.slice(0, 8),
    timestamp: new Date().toISOString(),
    source: "fallback",
  });
}
