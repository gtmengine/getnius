'use client'

import { Button } from '@/components/ui/button'

interface VerificationSliderProps {
  value: number
  onChange: (value: number) => void
}

const verificationLevels = [
  {
    level: 1,
    name: 'Soft',
    description: 'General – entire table sent to LLM for verification'
  },
  {
    level: 2,
    name: 'Medium',
    description: 'Reasoning LLM – fill cell X row 1 column 1 with verification details'
  },
  {
    level: 3,
    name: 'Strict',
    description: 'LLM after LLM – Cross-validation using multiple AI models'
  },
  {
    level: 4,
    name: 'Expert',
    description: 'LLM after LLM + human expert – AI verification followed by human review'
  }
]

export function VerificationSlider({ value, onChange }: VerificationSliderProps) {
  const currentLevel = verificationLevels.find(level => level.level === value) || verificationLevels[0]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Data Verification Type</h2>

      {/* Button Row */}
      <div className="flex items-center gap-2">
        {verificationLevels.map((level) => (
          <Button
            key={level.level}
            variant={value === level.level ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(level.level)}
            className="flex-1"
          >
            {level.name}
          </Button>
        ))}
      </div>

      {/* Dynamic Description */}
      <div className="p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-sm">
            Level {currentLevel.level}: {currentLevel.name}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {currentLevel.description}
        </p>
      </div>
    </div>
  )
}
