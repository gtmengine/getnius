// Environment variables validation and fallbacks for deployment
export const env = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || (
    typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000'
  ),
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'development-secret-at-least-32-chars-long-for-jwt',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Optional API keys
  PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY || '',
  EXA_API_KEY: process.env.EXA_API_KEY || '',
  FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY || '',
  GOOGLE_SEARCH_API_KEY: process.env.GOOGLE_SEARCH_API_KEY || '',
  GOOGLE_SEARCH_ENGINE_ID: process.env.GOOGLE_SEARCH_ENGINE_ID || '',
  
  // Supabase (optional)
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
}

// Runtime environment validation
export function validateEnvironment() {
  const isProduction = env.NODE_ENV === 'production'
  
  if (isProduction) {
    const requiredVars = ['NEXTAUTH_URL', 'NEXTAUTH_SECRET']
    const missing = requiredVars.filter(key => !env[key as keyof typeof env])
    
    if (missing.length > 0) {
      console.warn(`Missing required environment variables: ${missing.join(', ')}`)
    }
  }
  
  return true
}

