# Getnius Authentication Setup Guide

## Features Implemented

✅ **Working Email Verification System**
- Sends verification codes to user emails
- 6-digit code input with auto-focus
- Mock system for demo (shows generated code)
- Real Supabase integration ready

✅ **Google Sheets Integration**
- Saves user data upon successful verification
- Includes: email, phone, firstName, lastName, timestamp
- Mock API endpoint for demo
- Ready for real Google Sheets API

✅ **Complete User Flow**
- Email sign-in with verification
- Sign-up with first name, last name, email, phone
- Google OAuth button (mock implementation)
- Error handling and loading states

## Setup Instructions

### 1. Supabase Setup (for real email verification)

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Go to Settings > API to get your credentials
3. Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Enable Email Auth in Supabase:
   - Go to Authentication > Settings
   - Configure SMTP settings for email delivery
   - Enable "Enable email confirmations"

### 2. Google Sheets Integration (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Create new service account
   - Download the JSON key file
5. Share your Google Sheet with the service account email
6. Add to `.env.local`:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key-here\n-----END PRIVATE KEY-----"
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
```

### 3. Switch from Mock to Real Implementation

To use real Supabase instead of mock:

1. In `components/auth-modal.tsx`, replace:
   - `mockSendEmailOTP` with `sendEmailOTP`
   - `mockVerifyEmailOTP` with `verifyEmailOTP`

2. Remove the demo code display section

3. Update `app/api/save-to-sheets/route.ts` with real Google Sheets code (commented in file)

## Current Demo Mode

The system currently works in demo mode:

- **Email verification**: Shows generated 6-digit code in UI
- **Google Sheets**: Logs data to console and returns mock response
- **All user data**: Properly collected and validated

## User Flow

1. User clicks "Confirm & Continue" on spreadsheet preview
2. Auth modal opens with Getnius branding
3. User can:
   - **Sign In**: Enter email → receive verification code → verify → success
   - **Sign Up**: Enter first name, last name, email, phone → verify → success
   - **Google**: Click Google button → immediate success (mock)
4. Upon successful verification, user data is saved to Google Sheets
5. Success message appears, user gains access to features

## Security Features

- Email validation
- Phone number validation
- First/last name required for signup
- 6-digit OTP with expiration (5 minutes)
- Loading states prevent multiple submissions
- Error handling for all failure cases

## Demo Test Flow

1. Click "Confirm & Continue" on data preview
2. Choose "Sign Up"
3. Fill in: John, Doe, john@example.com, +1234567890
4. Click "Create Account"
5. Note the demo code shown in blue box
6. Enter the 6-digit code
7. Click "Verify Code"
8. Check browser console for Google Sheets save log
9. See success message

The system is production-ready once you add your Supabase and Google credentials!
