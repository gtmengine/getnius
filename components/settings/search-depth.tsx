'use client'

import { Globe, BookOpen, Users, DollarSign, Plus } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SearchDepthProps {
  value: string[]
  onChange: (value: string[]) => void
  contextScope?: string
  onContextScopeChange?: (value: string) => void
  includedSources?: string[]
  onAddSource?: () => void
}

const searchOptions = [
  { id: 'web', label: 'Web', icon: Globe, description: 'General web search' },
  { id: 'academic', label: 'Academic', icon: BookOpen, description: 'Academic and research sources' },
  { id: 'social', label: 'Social', icon: Users, description: 'Social media and networks' },
  { id: 'finance', label: 'Finance', icon: DollarSign, description: 'Financial and business data' },
]

export function SearchDepth({
  value,
  onChange,
  contextScope = 'all',
  onContextScopeChange,
  includedSources = [],
  onAddSource
}: SearchDepthProps) {
  const handleToggle = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter(id => id !== optionId))
    } else {
      onChange([...value, optionId])
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Search Depth</h2>
      <div className="grid grid-cols-2 gap-3">
        {searchOptions.map((option) => {
          const Icon = option.icon
          const isChecked = value.includes(option.id)

          return (
            <div
              key={option.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                isChecked
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted/50'
              }`}
              onClick={() => handleToggle(option.id)}
            >
              <Checkbox
                checked={isChecked}
                onChange={() => handleToggle(option.id)}
                className="pointer-events-none"
              />
              <Icon className={`h-5 w-5 ${isChecked ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="flex-1">
                <div className={`font-medium ${isChecked ? 'text-primary' : 'text-foreground'}`}>
                  {option.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {option.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Context scope */}
      <div className="space-y-2">
        <Label htmlFor="context-scope">Context scope</Label>
        <Select value={contextScope} onValueChange={onContextScopeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="limited">Limited</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Restrict sources */}
      <div className="space-y-2">
        <Label>Restrict sources</Label>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Included sources</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onAddSource}>
              <Plus className="h-4 w-4 mr-1" />
              Add source
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
