# Supabase Authentication Setup

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be set up

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon/Public Key**: `your-anon-key-here`

## 3. Configure Environment Variables

Update your `.env.local` file with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Set Up Google OAuth

1. In Supabase Dashboard, go to Authentication → Providers
2. Enable Google provider
3. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/):
   - Go to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Set authorized redirect URI to: `https://your-project-id.supabase.co/auth/v1/callback`
4. Add your Google Client ID and Secret to Supabase:
   - Client ID: Your Google OAuth client ID
   - Client Secret: Your Google OAuth client secret

## 5. Configure Redirect URLs

In Supabase Auth settings, add your domain to the Site URL:
- For development: `http://localhost:3000`
- For production: `https://yourdomain.com`

## 6. Test the Authentication

1. Start your development server: `npm run dev`
2. Click "Sign In with Google" button
3. Complete the Google OAuth flow
4. You should be logged in and see your email in the header

## Troubleshooting

- Make sure your environment variables are loaded (restart the dev server after changing .env.local)
- Check the browser console for any authentication errors
- Verify your Google OAuth redirect URI matches exactly
- Ensure your Supabase project allows authentication from your domain

## Security Notes

- Never commit your `.env.local` file to version control
- The anon key is safe to use in client-side code
- For production, consider setting up Row Level Security (RLS) policies in Supabase
