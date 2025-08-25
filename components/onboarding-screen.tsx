"use client"

import React, { useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Target, User, Phone, Building, CheckCircle, ArrowRight } from "lucide-react"

interface OnboardingScreenProps {
  onCompleted: () => void
}

interface FormData {
  fullName: string
  phone: string
  company: string
  termsAccepted: boolean
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onCompleted }) => {
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<FormData>({
    fullName: session?.user?.name || "",
    phone: "",
    company: "",
    termsAccepted: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const validatePhone = (phone: string): boolean => {
    // Simple phone validation: starts with + and has 7-15 digits
    const phoneRegex = /^\+[1-9]\d{6,14}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fullName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name",
        variant: "destructive"
      })
      return
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Phone required",
        description: "Please enter your phone number",
        variant: "destructive"
      })
      return
    }

    if (!validatePhone(formData.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number with country code (e.g., +1234567890)",
        variant: "destructive"
      })
      return
    }

    if (!formData.company.trim()) {
      toast({
        title: "Company required",
        description: "Please enter your company name",
        variant: "destructive"
      })
      return
    }

    if (!formData.termsAccepted) {
      toast({
        title: "Terms acceptance required",
        description: "Please accept the terms and conditions to continue",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Save to localStorage
      const onboardingData = {
        ...formData,
        completedAt: new Date().toISOString(),
        email: session?.user?.email
      }
      
      localStorage.setItem("getnius_onboarding_v1", JSON.stringify(onboardingData))
      
      toast({
        title: "Registration completed!",
        description: "Welcome to Getnius. Let's start discovering market opportunities.",
      })

      // Small delay for better UX
      setTimeout(() => {
        onCompleted()
      }, 1500)

    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error saving your information. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, session, toast, onCompleted])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Branding & Progress */}
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
                    Almost there,
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> {session?.user?.name?.split(' ')[0] || 'friend'}!</span>
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Just a few quick details to personalize your market intelligence experience.
                  </p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Account created with Google</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Complete your profile</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  <span className="text-sm text-gray-500">Start discovering companies</span>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-sm text-gray-700">
                  <strong>Welcome aboard!</strong> Your Google account is connected. 
                  Complete your profile to unlock AI-powered market research tools.
                </p>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Complete Your Profile</CardTitle>
                    <CardDescription className="text-gray-600">
                      Tell us a bit about yourself to get started
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="e.g., +1234567890"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">Include country code for international numbers</p>
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                        Company *
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="company"
                          type="text"
                          placeholder="Your company name"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Terms and Conditions */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="terms"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => handleInputChange("termsAccepted", checked === true)}
                          className="mt-1"
                        />
                        <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                          I agree to the{" "}
                          <a href="#" className="text-blue-600 hover:underline font-medium">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-blue-600 hover:underline font-medium">
                            Privacy Policy
                          </a>
                        </Label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Completing...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingScreen
