"use client"

import React from "react"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Search, Target, TrendingUp, Users, Sparkles, Shield, ArrowRight } from "lucide-react"

interface AuthScreenProps {
  onAuthenticated: () => void
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const { data: session, status } = useSession()

  React.useEffect(() => {
    if (session) {
      onAuthenticated()
    }
  }, [session, onAuthenticated])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Branding & Features */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Getnius</h1>
                    <p className="text-sm text-gray-600">Market Intelligence Platform</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    Discover Your Next
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Market Opportunity</span>
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    AI-powered market research that helps you find companies, competitors, and opportunities faster than ever.
                  </p>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Search className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Smart Search</span>
                  </div>
                  <p className="text-sm text-gray-600">AI-powered search across multiple data sources</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Data Enrichment</span>
                  </div>
                  <p className="text-sm text-gray-600">Get detailed company insights and metrics</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-900">Lead Generation</span>
                  </div>
                  <p className="text-sm text-gray-600">Export to CRM and sales tools</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-gray-900">Market Analysis</span>
                  </div>
                  <p className="text-sm text-gray-600">Identify trends and opportunities</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10M+</div>
                  <div className="text-sm text-gray-600">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Data Sources</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right Side - Authentication Card */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
                    <CardDescription className="text-gray-600">
                      Sign in to access your market intelligence dashboard
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <Button
                    onClick={() => signIn("google")}
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
                    variant="outline"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Trusted by professionals</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-2">
                    <Badge variant="secondary" className="text-xs">SOC 2 Compliant</Badge>
                    <Badge variant="secondary" className="text-xs">GDPR Ready</Badge>
                    <Badge variant="secondary" className="text-xs">99.9% Uptime</Badge>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      By signing in, you agree to our{" "}
                      <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                      {" "}and{" "}
                      <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action */}
      <div className="fixed bottom-8 right-8">
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-900">Ready to explore</span>
            <ArrowRight className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthScreen