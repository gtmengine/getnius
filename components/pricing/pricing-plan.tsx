'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Zap } from 'lucide-react'

interface PricingPlanProps {
  name: string
  description: string
  price: number
  period: string
  features: string[]
  popular?: boolean
  recommended?: boolean
  buttonText?: string
  onSelect?: () => void
}

export function PricingPlan({
  name,
  description,
  price,
  period,
  features,
  popular = false,
  recommended = false,
  buttonText = "Get Started",
  onSelect
}: PricingPlanProps) {
  return (
    <Card className={`relative ${popular ? 'border-primary shadow-lg' : ''} ${recommended ? 'border-green-500 shadow-lg' : ''}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      {recommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-green-600 text-white px-3 py-1">
            <Zap className="w-3 h-3 mr-1" />
            Recommended
          </Badge>
        </div>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/{period}</span>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className={`w-full ${popular ? 'bg-primary hover:bg-primary/90' : ''} ${recommended ? 'bg-green-600 hover:bg-green-700' : ''}`}
          onClick={onSelect}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

