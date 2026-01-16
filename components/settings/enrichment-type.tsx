'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings } from 'lucide-react'

export function EnrichmentType() {
  const [dataType, setDataType] = useState('')

  const dataTypes = [
    'Text',
    'URL',
    'Email',
    'Checkbox',
    'Number',
    'Select',
    'Multi-Select'
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Enrichment Type</h2>

      {/* Data Type */}
      <div className="space-y-2">
        <Label htmlFor="data-type">Data Type</Label>
        <Select value={dataType} onValueChange={setDataType}>
          <SelectTrigger>
            <SelectValue placeholder="Select data type" />
          </SelectTrigger>
          <SelectContent>
            {dataTypes.map((type) => (
              <SelectItem key={type} value={type.toLowerCase()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      {/* Enrich Column Button */}
      <Button className="w-full">
        <Settings className="h-4 w-4 mr-2" />
        Enrich Column
      </Button>
    </div>
  )
}
