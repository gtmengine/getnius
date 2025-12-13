'use client'

import { useState } from 'react'
import { PricingPlan } from './pricing-plan'
import { FeatureComparison } from './feature-comparison'
import { ArrowLeft, CreditCard, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses and startups",
      price: billingCycle === 'monthly' ? 29 : 290,
      period: billingCycle === 'monthly' ? 'month' : 'year',
      features: [
        "100 monthly searches",
        "CSV data export",
        "Basic email enrichment",
        "Community support",
        "Standard data verification",
        "5 custom columns",
        "Web search access"
      ],
      buttonText: "Start Free Trial"
    },
    {
      name: "Professional",
      description: "Ideal for growing companies and agencies",
      price: billingCycle === 'monthly' ? 79 : 790,
      period: billingCycle === 'monthly' ? 'month' : 'year',
      features: [
        "1,000 monthly searches",
        "CSV & XLSX export",
        "Advanced email enrichment",
        "API access",
        "Priority email support",
        "Unlimited custom columns",
        "All search sources",
        "Advanced verification",
        "Team collaboration"
      ],
      popular: true,
      buttonText: "Start Free Trial"
    },
    {
      name: "Enterprise",
      description: "For large organizations with custom needs",
      price: billingCycle === 'monthly' ? 199 : 1990,
      period: billingCycle === 'monthly' ? 'month' : 'year',
      features: [
        "Unlimited searches",
        "All export formats",
        "Custom API integrations",
        "Dedicated account manager",
        "Phone & priority support",
        "White-label solutions",
        "Custom data sources",
        "Advanced analytics",
        "SLA guarantee",
        "Custom training"
      ],
      recommended: true,
      buttonText: "Contact Sales"
    }
  ]

  const handlePlanSelect = (planName: string) => {
    console.log(`Selected plan: ${planName}`)
    // Here you would integrate with payment processor
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to Search
              </Link>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <h1 className="text-2xl font-bold">Pricing</h1>
              </div>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center gap-3">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'font-medium' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${billingCycle === 'yearly' ? 'font-medium' : 'text-muted-foreground'}`}>
                  Yearly
                </span>
                {billingCycle === 'yearly' && (
                  <Badge variant="secondary" className="text-xs">
                    Save 20%
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-background via-background to-muted/20 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Unlock the full potential of market research with our flexible pricing plans designed for businesses of all sizes.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">10K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">1M+</div>
              <div className="text-sm text-muted-foreground">Searches Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <PricingPlan
              key={plan.name}
              {...plan}
              onSelect={() => handlePlanSelect(plan.name)}
            />
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mb-16">
          <FeatureComparison />
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Can I change plans anytime?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Is there a free trial?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes, we offer a 14-day free trial for all plans. No credit card required.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                What payment methods do you accept?
              </h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Do you offer refunds?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes, we offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of companies already using getni.us for their market research needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

