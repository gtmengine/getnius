'use client'

import { Button } from '@/components/ui/button'

interface ColumnLimitProps {
  value: number | null
  onChange: (value: number | null) => void
}

const options = [3, 4, 5, 6, 7]

export function ColumnLimit({ value, onChange }: ColumnLimitProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Number of Columns Allowed</h2>
      <div className="flex items-center gap-2">
        {options.map((option) => (
          <Button
            key={option}
            variant={value === option ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(option)}
            className="w-8 h-8 p-0"
          >
            {option}
          </Button>
        ))}
        <Button
          variant={value === null ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(null)}
          className="px-2 text-xs"
        >
          Unlimited
        </Button>
      </div>
    </div>
  )
}
