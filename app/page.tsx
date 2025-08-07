"use client"

import { useSession } from "next-auth/react"
import MarketIntelligenceTool from "../market-intelligence-tool"
import AuthScreen from "@/components/auth-screen"

export default function Page() {
  const { data: session, status } = useSession()

  if (status === "loading") {
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

  return <MarketIntelligenceTool />
}
