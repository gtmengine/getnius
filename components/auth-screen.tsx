"use client"

import React from "react"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Target, TrendingUp, Users, Sparkles, Shield, ArrowRight, Key } from "lucide-react"

interface AuthScreenProps {
  onAuthenticated: () => void
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const { data: session, status } = useSession()
  const [showPinInput, setShowPinInput] = React.useState(false)
  const [pinCode, setPinCode] = React.useState("")
  const [pinError, setPinError] = React.useState("")

  React.useEffect(() => {
    if (session) {
      onAuthenticated()
    }
  }, [session, onAuthenticated])

  const handlePinSubmit = () => {
    if (pinCode === "3103") {
      // PIN bypass for development/demo
      onAuthenticated()
    } else {
      setPinError("Invalid PIN code")
      setTimeout(() => setPinError(""), 3000)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Branding & Features */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900">Getnius</h1>
                </div>
                <h2 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  Market Intelligence
                  <br />
                  <span className="text-blue-600">Made Simple</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Transform your market research with AI-powered company discovery, 
                  automated enrichment, and intelligent insights.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Smart Discovery</h3>
                    <p className="text-sm text-gray-600">AI-powered company search across multiple data sources</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Auto Enrichment</h3>
                    <p className="text-sm text-gray-600">Automatically gather detailed company information</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Market Insights</h3>
                    <p className="text-sm text-gray-600">Real-time market intelligence and trend analysis</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Team Collaboration</h3>
                    <p className="text-sm text-gray-600">Share insights and collaborate with your team</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Enterprise Ready
                </Badge>
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  Real-time Data
                </Badge>
                <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                  AI-Powered
                </Badge>
              </div>
            </div>

            {/* Right Side - Authentication Card */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Welcome to Getnius</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      Sign in to access your market intelligence platform
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
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                  
                  <Separator />
                  
                  {!showPinInput ? (
                    <Button
                      onClick={() => setShowPinInput(true)}
                      variant="ghost"
                      className="w-full h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Skip Authentication (Demo)
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Enter PIN Code</label>
                        <div className="flex gap-2">
                          <Input
                            type="password"
                            placeholder="Enter PIN"
                            value={pinCode}
                            onChange={(e) => setPinCode(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handlePinSubmit()
                              }
                            }}
                            className="flex-1"
                          />
                          <Button 
                            onClick={handlePinSubmit} 
                            size="sm"
                            type="button"
                          >
                            Enter
                          </Button>
                        </div>
                      </div>
                      {pinError && (
                        <p className="text-sm text-red-600">{pinError}</p>
                      )}
                      <Button
                        onClick={() => {
                          setShowPinInput(false)
                          setPinCode("")
                          setPinError("")
                        }}
                        variant="ghost"
                        size="sm"
                        className="w-full text-gray-500"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="text-xs">Secure</Badge>
                    <Badge variant="outline" className="text-xs">GDPR Compliant</Badge>
                    <Badge variant="outline" className="text-xs">SOC 2 Certified</Badge>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    By continuing, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action */}
      <div className="fixed bottom-8 right-8">
        <div className="bg-white rounded-full p-4 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 pr-2">Get Started Today</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthScreen
