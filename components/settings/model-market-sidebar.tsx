'use client'

import { useState, useEffect } from 'react'
import { Bot, Cpu, Zap, Globe, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Model {
  id: string
  name: string
  provider: string
  priceTier: number
  tags: string[]
  description: string
}

// Mock data - replace with API call
const mockModels: Model[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    priceTier: 3,
    tags: ['reasoning', 'multimodal'],
    description: 'Advanced multimodal AI with excellent reasoning capabilities'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    priceTier: 3,
    tags: ['reasoning', 'analysis', 'urlScraping'],
    description: 'Fast and accurate AI with strong analytical skills'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    priceTier: 2,
    tags: ['multimodal', 'fast', 'urlScraping'],
    description: 'Google\'s multimodal AI with fast processing'
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta',
    priceTier: 1,
    tags: ['open-source', 'fast'],
    description: 'Open-source large language model from Meta'
  },
  {
    id: 'mixtral-8x7b',
    name: 'Mixtral 8x7B',
    provider: 'Mistral',
    priceTier: 1,
    tags: ['open-source', 'reasoning'],
    description: 'Mixture of experts model with strong reasoning'
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    priceTier: 2,
    tags: ['fast', 'reasoning'],
    description: 'Fast and efficient AI from Anthropic'
  }
]

export function ModelMarketSidebar() {
  const [models, setModels] = useState<Model[]>([])

  useEffect(() => {
    // TODO: Replace with API call
    setModels(mockModels)
  }, [])

  const getPriceTierDisplay = (tier: number) => {
    return '$'.repeat(tier)
  }

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai':
        return <Bot className="h-4 w-4" />
      case 'anthropic':
        return <Zap className="h-4 w-4" />
      case 'google':
        return <Globe className="h-4 w-4" />
      case 'meta':
        return <Cpu className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  return (
    <div className="sticky top-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Available Models
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {models.map((model) => (
            <div
              key={model.id}
              className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getProviderIcon(model.provider)}
                  <div>
                    <h4 className="font-medium text-sm">{model.name}</h4>
                    <p className="text-xs text-muted-foreground">{model.provider}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {getPriceTierDisplay(model.priceTier)}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3">
                {model.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {model.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-1.5 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
