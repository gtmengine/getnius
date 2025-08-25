"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import MarketIntelligenceTool from "../market-intelligence-tool"
import AuthScreen from "@/components/auth-screen"
import OnboardingScreen from "@/components/onboarding-screen"

export default function Page() {
  const { data: session, status } = useSession()
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null)

  useEffect(() => {
    if (session) {
      // Check if onboarding is completed
      try {
        const onboardingData = localStorage.getItem("getnius_onboarding_v1")
        setOnboardingCompleted(!!onboardingData)
      } catch (error) {
        console.error("Error checking onboarding status:", error)
        setOnboardingCompleted(false)
      }
    } else {
      setOnboardingCompleted(null)
    }
  }, [session])

  if (status === "loading" || (session && onboardingCompleted === null)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <AuthScreen onAuthenticated={() => window.location.reload()} />
  }

  if (!onboardingCompleted) {
    return (
      <OnboardingScreen 
        onCompleted={() => {
          setOnboardingCompleted(true)
        }} 
      />
    )
  }

  return <MarketIntelligenceTool />
}
