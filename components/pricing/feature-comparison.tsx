'use client'

import { Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Feature {
  name: string
  starter: boolean | string
  professional: boolean | string
  enterprise: boolean | string
}

const features: Feature[] = [
  {
    name: "Monthly Searches",
    starter: "100",
    professional: "1,000",
    enterprise: "Unlimited"
  },
  {
    name: "Data Export Formats",
    starter: "CSV only",
    professional: "CSV, XLSX",
    enterprise: "All formats"
  },
  {
    name: "API Access",
    starter: false,
    professional: true,
    enterprise: true
  },
  {
    name: "Custom Integrations",
    starter: false,
    professional: false,
    enterprise: true
  },
  {
    name: "Priority Support",
    starter: false,
    professional: true,
    enterprise: true
  },
  {
    name: "Advanced Analytics",
    starter: false,
    professional: true,
    enterprise: true
  },
  {
    name: "White-label Solutions",
    starter: false,
    professional: false,
    enterprise: true
  }
]

export function FeatureComparison() {
  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-4 w-4 text-green-500 mx-auto" />
      ) : (
        <X className="h-4 w-4 text-red-500 mx-auto" />
      )
    }
    return <span className="text-sm font-medium text-center">{value}</span>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Feature Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Features</th>
                <th className="text-center py-3 px-4 font-medium">Starter</th>
                <th className="text-center py-3 px-4 font-medium">Professional</th>
                <th className="text-center py-3 px-4 font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm">{feature.name}</td>
                  <td className="py-3 px-4 text-center">
                    {renderFeatureValue(feature.starter)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {renderFeatureValue(feature.professional)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {renderFeatureValue(feature.enterprise)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

