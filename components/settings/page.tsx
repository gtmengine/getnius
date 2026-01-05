'use client'

import { useState } from 'react'
import { SearchDepth } from './search-depth'
import { ColumnLimit } from './column-limit'
import { LLMSelectorSearch } from './llm-selector-search'
import { LLMSelectorEnrich } from './llm-selector-enrich'
import { EmailSearchOptions } from './email-search-options'
import { VerificationSlider } from './verification-slider'
import { EnrichmentType } from './enrichment-type'
import { ModelMarketSidebar } from './model-market-sidebar'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  // Settings state
  const [searchDepth, setSearchDepth] = useState<string[]>(['web'])
  const [limitColumns, setLimitColumns] = useState<number | null>(5)
  const [searchModels, setSearchModels] = useState<string[]>(['gpt-4o'])
  const [enrichModels, setEnrichModels] = useState<string[]>(['claude-3-5-sonnet'])
  const [emailSearchMode, setEmailSearchMode] = useState<'general' | 'specialized' | 'specialized_verified'>('general')
  const [verificationLevel, setVerificationLevel] = useState<number>(2)
  const [contextScope, setContextScope] = useState<string>('all')
  const [includedSources, setIncludedSources] = useState<string[]>([])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Column - Settings */}
          <div className="flex-1 space-y-8">
            <SearchDepth
              value={searchDepth}
              onChange={setSearchDepth}
              contextScope={contextScope}
              onContextScopeChange={setContextScope}
              includedSources={includedSources}
              onAddSource={() => console.log('Add source clicked')}
            />

            <ColumnLimit
              value={limitColumns}
              onChange={setLimitColumns}
            />

            <div className="grid grid-cols-2 gap-6">
              <LLMSelectorSearch
                value={searchModels}
                onChange={setSearchModels}
              />

              <LLMSelectorEnrich
                value={enrichModels}
                onChange={setEnrichModels}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <EmailSearchOptions
                value={emailSearchMode}
                onChange={setEmailSearchMode}
              />

              <EnrichmentType />
            </div>

            <VerificationSlider
              value={verificationLevel}
              onChange={setVerificationLevel}
            />
          </div>

          {/* Right Sidebar - Model Market */}
          <div className="w-80">
            <ModelMarketSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
