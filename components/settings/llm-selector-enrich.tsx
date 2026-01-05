'use client'

import { useState, useEffect } from 'react'
import { Bot, DollarSign, Hash, Globe } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LLMSelectorEnrichProps {
  value: string[]
  onChange: (value: string[]) => void
}

interface LLMModel {
  id: string
  name: string
  provider: string
  priceTier: 1 | 2 | 3 | 4
  tags: string[]
}

// Mock data - replace with API call
const mockModels: LLMModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    priceTier: 3,
    tags: ['reasoning', 'urlScraping']
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    priceTier: 3,
    tags: ['reasoning', 'analysis', 'urlScraping']
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    priceTier: 2,
    tags: ['multimodal', 'fast', 'urlScraping']
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta',
    priceTier: 1,
    tags: ['open-source', 'fast']
  }
]

export function LLMSelectorEnrich({ value, onChange }: LLMSelectorEnrichProps) {
  const [models, setModels] = useState<LLMModel[]>([])

  useEffect(() => {
    // TODO: Replace with API call
    setModels(mockModels)
  }, [])

  const handleToggle = (modelId: string) => {
    if (value.includes(modelId)) {
      onChange(value.filter(id => id !== modelId))
    } else {
      onChange([...value, modelId])
    }
  }

  const getPriceTierDisplay = (tier: number) => {
    return '$'.repeat(tier)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">LLMs for Enrich</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {models.map((model) => {
          const isSelected = value.includes(model.id)

          return (
            <div
              key={model.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted/50'
              }`}
              onClick={() => handleToggle(model.id)}
            >
              <Checkbox
                checked={isSelected}
                onChange={() => handleToggle(model.id)}
                className="pointer-events-none"
              />
              <Bot className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="flex-1">
                <div className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {model.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {model.provider}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {getPriceTierDisplay(model.priceTier)}
                </span>
                <div className="flex gap-1">
                  {model.tags.includes('reasoning') && (
                    <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                      reasoning
                    </span>
                  )}
                  {model.tags.includes('urlScraping') && (
                    <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                      URL scraping
                    </span>
                  )}
                  {model.tags.includes('analysis') && (
                    <span className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-800 rounded">
                      analysis
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
