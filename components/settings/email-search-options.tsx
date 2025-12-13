'use client'

import { Button } from '@/components/ui/button'

interface EmailSearchOptionsProps {
  value: 'general' | 'specialized' | 'specialized_verified'
  onChange: (value: 'general' | 'specialized' | 'specialized_verified') => void
}

const options = [
  {
    id: 'general',
    title: 'General search',
    description: 'LLM + search engines',
    tooltip: 'Uses AI and general search engines to find email addresses'
  },
  {
    id: 'specialized',
    title: 'Specialized search',
    description: 'FullEnrich API',
    tooltip: 'Uses specialized enrichment services for better email accuracy'
  },
  {
    id: 'specialized_verified',
    title: 'Specialized search + verification',
    description: 'FullEnrich + bounce verification',
    tooltip: 'Uses enrichment services plus email bounce verification for highest accuracy'
  }
] as const

export function EmailSearchOptions({ value, onChange }: EmailSearchOptionsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Search for Emails</h2>

      {/* Button Row */}
      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => (
          <Button
            key={option.id}
            variant={value === option.id ? "default" : "outline"}
            onClick={() => onChange(option.id)}
            className="justify-start h-auto p-3"
          >
            <div className="text-left">
              <div className="font-medium">{option.title}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {option.description}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
