"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SuspenseWrapper, EnrichmentSkeleton } from './suspense-wrapper'
import { Building2, Users, Globe, MapPin, TrendingUp, CheckCircle, Clock } from 'lucide-react'

interface EnrichmentData {
  companyName: string
  website?: string
  description?: string
  industry?: string
  location?: string
  employees?: string
  revenue?: string
  founded?: string
  technologies?: string[]
  socialMedia?: Record<string, string>
  keyPeople?: Array<{ name: string; role: string }>
  recentNews?: Array<{ title: string; date: string; url: string }>
}

interface StreamingEnrichmentProps {
  companyName: string
  onEnrichmentComplete?: (data: EnrichmentData) => void
}

export function StreamingEnrichment({ companyName, onEnrichmentComplete }: StreamingEnrichmentProps) {
  const [enrichmentData, setEnrichmentData] = useState<Partial<EnrichmentData>>({})
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const enrichmentSteps = [
    { key: 'basic', label: 'Basic Information', fields: ['companyName', 'website', 'description'] },
    { key: 'business', label: 'Business Details', fields: ['industry', 'location', 'employees', 'revenue'] },
    { key: 'technology', label: 'Technology Stack', fields: ['technologies'] },
    { key: 'people', label: 'Key People', fields: ['keyPeople'] },
    { key: 'social', label: 'Social Media', fields: ['socialMedia'] },
    { key: 'news', label: 'Recent News', fields: ['recentNews'] }
  ]

  useEffect(() => {
    if (!companyName.trim()) return

    const performEnrichment = async () => {
      setProgress(0)
      setEnrichmentData({ companyName })
      setError(null)
      setIsComplete(false)

      try {
        for (let i = 0; i < enrichmentSteps.length; i++) {
          const step = enrichmentSteps[i]
          setCurrentStep(step.label)
          setProgress((i / enrichmentSteps.length) * 100)

          // Симулируем API вызовы для каждого шага
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

          // Генерируем mock данные для демонстрации
          const mockData = generateMockDataForStep(step.key, companyName)
          
          setEnrichmentData(prev => ({ ...prev, ...mockData }))
        }

        setProgress(100)
        setCurrentStep('Complete')
        setIsComplete(true)
        
        // Вызываем callback с полными данными
        const finalData = { companyName, ...enrichmentData } as EnrichmentData
        onEnrichmentComplete?.(finalData)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Enrichment failed')
      }
    }

    performEnrichment()
  }, [companyName])

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <div className="font-semibold mb-2">Enrichment Error</div>
            <div className="text-sm">{error}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Enriching: {companyName}
            </CardTitle>
            {isComplete ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            ) : (
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                {currentStep}
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="text-sm text-gray-500">
              {Math.round(progress)}% complete
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enrichment Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        {enrichmentData.website && (
          <Card className="animate-in slide-in-from-left duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-4 h-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-500">Website</div>
                <a href={enrichmentData.website} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">
                  {enrichmentData.website}
                </a>
              </div>
              {enrichmentData.description && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Description</div>
                  <p className="text-sm">{enrichmentData.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Business Details */}
        {enrichmentData.industry && (
          <Card className="animate-in slide-in-from-right duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-4 h-4" />
                Business Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Industry</div>
                  <div className="text-sm">{enrichmentData.industry}</div>
                </div>
                {enrichmentData.location && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Location</div>
                    <div className="text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {enrichmentData.location}
                    </div>
                  </div>
                )}
                {enrichmentData.employees && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Employees</div>
                    <div className="text-sm flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {enrichmentData.employees}
                    </div>
                  </div>
                )}
                {enrichmentData.revenue && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Revenue</div>
                    <div className="text-sm">{enrichmentData.revenue}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technologies */}
        {enrichmentData.technologies && (
          <Card className="animate-in slide-in-from-left duration-700">
            <CardHeader>
              <CardTitle className="text-lg">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {enrichmentData.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key People */}
        {enrichmentData.keyPeople && (
          <Card className="animate-in slide-in-from-right duration-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-4 h-4" />
                Key People
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {enrichmentData.keyPeople.map((person, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="font-medium text-sm">{person.name}</div>
                    <Badge variant="outline" className="text-xs">{person.role}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Mock data generator
function generateMockDataForStep(step: string, companyName: string): Partial<EnrichmentData> {
  switch (step) {
    case 'basic':
      return {
        website: `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        description: `${companyName} is a leading company in their industry, providing innovative solutions and services to customers worldwide.`
      }
    
    case 'business':
      return {
        industry: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing'][Math.floor(Math.random() * 5)],
        location: ['San Francisco, CA', 'New York, NY', 'London, UK', 'Berlin, Germany', 'Tokyo, Japan'][Math.floor(Math.random() * 5)],
        employees: ['1-10', '11-50', '51-200', '201-500', '500+'][Math.floor(Math.random() * 5)],
        revenue: ['$1M-$10M', '$10M-$50M', '$50M-$100M', '$100M+'][Math.floor(Math.random() * 4)]
      }
    
    case 'technology':
      return {
        technologies: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'].slice(0, 3 + Math.floor(Math.random() * 3))
      }
    
    case 'people':
      return {
        keyPeople: [
          { name: 'John Smith', role: 'CEO' },
          { name: 'Sarah Johnson', role: 'CTO' },
          { name: 'Mike Davis', role: 'VP Sales' }
        ].slice(0, 2 + Math.floor(Math.random() * 2))
      }
    
    case 'social':
      return {
        socialMedia: {
          linkedin: `https://linkedin.com/company/${companyName.toLowerCase()}`,
          twitter: `https://twitter.com/${companyName.toLowerCase()}`
        }
      }
    
    case 'news':
      return {
        recentNews: [
          { title: `${companyName} announces new product launch`, date: '2024-01-15', url: '#' },
          { title: `${companyName} raises Series A funding`, date: '2024-01-10', url: '#' }
        ]
      }
    
    default:
      return {}
  }
}

// Обертка с Suspense
export function StreamingEnrichmentWithSuspense(props: StreamingEnrichmentProps) {
  return (
    <SuspenseWrapper fallback={<EnrichmentSkeleton />}>
      <StreamingEnrichment {...props} />
    </SuspenseWrapper>
  )
}
