import { createClient } from '@supabase/supabase-js'

// These would typically come from environment variables
// For demo purposes, I'm using placeholder values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Email verification with OTP
export async function sendEmailOTP(email: string) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      }
    })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error sending OTP:', error)
    return { success: false, error }
  }
}

// Verify email OTP
export async function verifyEmailOTP(email: string, token: string) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return { success: false, error }
  }
}

// Save user data to Google Sheets (via API endpoint)
export async function saveToGoogleSheets(userData: {
  email: string
  phone?: string
  firstName?: string
  lastName?: string
}) {
  try {
    const response = await fetch('/api/save-to-sheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) throw new Error('Failed to save to Google Sheets')
    
    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('Error saving to Google Sheets:', error)
    return { success: false, error }
  }
}

// Alternative: Mock email verification for demo purposes
export async function mockSendEmailOTP(email: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, this would send an actual email
  console.log(`Mock: Sending verification code to ${email}`)
  
  // Generate a mock 6-digit code
  const mockCode = Math.floor(100000 + Math.random() * 900000).toString()
  
  // Store in localStorage for demo purposes
  localStorage.setItem(`otp_${email}`, mockCode)
  localStorage.setItem(`otp_${email}_timestamp`, Date.now().toString())
  
  return { success: true, mockCode } // Return code for demo purposes
}

export async function mockVerifyEmailOTP(email: string, token: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const storedCode = localStorage.getItem(`otp_${email}`)
  const timestamp = localStorage.getItem(`otp_${email}_timestamp`)
  
  if (!storedCode || !timestamp) {
    return { success: false, error: 'No OTP found for this email' }
  }
  
  // Check if OTP is expired (5 minutes)
  const now = Date.now()
  const otpAge = now - parseInt(timestamp)
  if (otpAge > 5 * 60 * 1000) {
    localStorage.removeItem(`otp_${email}`)
    localStorage.removeItem(`otp_${email}_timestamp`)
    return { success: false, error: 'OTP has expired' }
  }
  
  if (storedCode === token) {
    // Clean up
    localStorage.removeItem(`otp_${email}`)
    localStorage.removeItem(`otp_${email}_timestamp`)
    return { success: true, data: { email, verified: true } }
  }
  
  return { success: false, error: 'Invalid OTP' }
}
