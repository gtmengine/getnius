# Deployment Guide for GETNIUS Market Research Platform

## Quick Deploy to Vercel (Recommended for Next.js)

### Prerequisites
- GitHub repository (✅ Already set up: `https://github.com/gtmengine/getnius.git`)
- Vercel account (free at vercel.com)

### Step 1: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in with your GitHub account
2. **Click "New Project"**
3. **Import your GitHub repository**: `gtmengine/getnius`
4. **Configure Project**:
   - Framework Preset: **Next.js** (should auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### Step 2: Configure Environment Variables

In Vercel dashboard, go to **Settings > Environment Variables** and add:

#### Required Variables:
```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=generate-a-32-character-secret-key
```

#### Optional API Keys (for full functionality):
```
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
PERPLEXITY_API_KEY=your-perplexity-api-key
EXA_API_KEY=your-exa-api-key
FIRECRAWL_API_KEY=your-firecrawl-api-key
GOOGLE_SEARCH_API_KEY=your-google-search-api-key
GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id
```

### Step 3: Google OAuth Setup (if using authentication)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-app-name.vercel.app/api/auth/callback/google`

### Step 4: Deploy

1. **Click "Deploy"** in Vercel
2. Wait for build to complete
3. Your app will be live at `https://your-app-name.vercel.app`

## Alternative: Deploy to Netlify

### Quick Netlify Deploy

1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add same environment variables as above

## Alternative: GitHub Pages (Static Export)

Note: GitHub Pages only supports static sites, so dynamic features will be limited.

### Configuration for Static Export

1. Add to `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

export default nextConfig
```

2. Build and export:
```bash
npm run build
```

3. Deploy the `out` folder to GitHub Pages

## Troubleshooting

### Build Failures
- Check all environment variables are set
- Ensure no TypeScript errors: `npm run lint`
- Test build locally: `npm run build`

### Authentication Issues
- Verify NEXTAUTH_URL matches your domain
- Check Google OAuth redirect URIs
- Ensure NEXTAUTH_SECRET is at least 32 characters

### API Issues
- Verify all API keys are valid
- Check API rate limits
- Review API endpoint configurations

## Local Development

1. Copy `env.example` to `.env.local`
2. Fill in your API keys
3. Run `npm run dev`

## Support

For deployment issues, check:
- Vercel docs: https://nextjs.org/docs/deployment
- Netlify docs: https://docs.netlify.com/
- Project issues: https://github.com/gtmengine/getnius/issues
