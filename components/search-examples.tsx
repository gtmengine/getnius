"use client"

import React from "react"

import { Sparkles, TrendingUp, Users, Building, Globe } from "lucide-react"

interface SearchExample {
  id: string
  title: string
  description: string
  query: string
  category: "trending" | "popular" | "specific" | "industry"
  icon: React.ComponentType<{ className?: string }>
}

export const searchExamples: SearchExample[] = [
  // Trending examples
  {
    id: "ai-productivity",
    title: "Cool agentic AI tools to help with productivity",
    description: "Find AI-powered productivity and automation tools",
    query: "AI productivity tools automation agents",
    category: "trending",
    icon: Sparkles,
  },
  {
    id: "series-b-2024",
    title: "Startups that raised a series B in 2024 and have a head of people",
    description: "Growth-stage companies with HR leadership",
    query: "series B 2024 head of people HR",
    category: "trending",
    icon: TrendingUp,
  },
  {
    id: "prop-tech",
    title: "Prop-tech solutions for smart homes",
    description: "Property technology companies in smart home space",
    query: "prop-tech smart homes real estate technology",
    category: "trending",
    icon: Building,
  },

  // Popular examples
  {
    id: "ai-meeting-tools",
    title: "AI meeting transcription tools",
    description: "Companies building AI-powered meeting assistants",
    query: "AI meeting transcription tools",
    category: "popular",
    icon: Users,
  },
  {
    id: "fintech-payments",
    title: "FinTech payment processing companies",
    description: "Financial technology companies in payments",
    query: "fintech payment processing digital payments",
    category: "popular",
    icon: Globe,
  },
  {
    id: "drone-delivery",
    title: "Drone delivery and logistics companies",
    description: "Companies using drones for last-mile delivery",
    query: "drone delivery logistics UAS last-mile",
    category: "popular",
    icon: Globe,
  },

  // Specific examples
  {
    id: "engineers-nyc",
    title: "Engineers at AI startups in NYC who know design",
    description: "Technical talent with design skills in New York",
    query: "engineers AI startups NYC design",
    category: "specific",
    icon: Users,
  },
  {
    id: "ux-designers-nyc",
    title: "UX UI designers in NYC",
    description: "Design professionals in New York City",
    query: "UX UI designers NYC New York",
    category: "specific",
    icon: Users,
  },
  {
    id: "investing-crypto",
    title: "Companies investing in crypto in 2025",
    description: "Investment firms focusing on cryptocurrency",
    query: "investing crypto 2025 cryptocurrency",
    category: "specific",
    icon: TrendingUp,
  },

  // Industry examples
  {
    id: "healthtech-ai",
    title: "HealthTech companies using AI",
    description: "Healthcare technology with artificial intelligence",
    query: "healthtech AI healthcare artificial intelligence",
    category: "industry",
    icon: Building,
  },
  {
    id: "edtech-platforms",
    title: "EdTech learning platforms",
    description: "Educational technology and e-learning companies",
    query: "edtech learning platforms education technology",
    category: "industry",
    icon: Building,
  },
  {
    id: "cybersecurity-startups",
    title: "Cybersecurity startups",
    description: "Information security and data protection companies",
    query: "cybersecurity startups information security",
    category: "industry",
    icon: Building,
  },
]

interface SearchExamplesProps {
  onExampleSelect: (query: string) => void
  className?: string
}

export function SearchExamples({ onExampleSelect, className = "" }: SearchExamplesProps) {
  const [activeFilter, setActiveFilter] = React.useState<string>("all");
  
  const categories = [
    { id: "trending", name: "TRENDING", examples: searchExamples.filter((e) => e.category === "trending") },
    { id: "popular", name: "POPULAR", examples: searchExamples.filter((e) => e.category === "popular") },
    { id: "specific", name: "SPECIFIC", examples: searchExamples.filter((e) => e.category === "specific") },
    { id: "industry", name: "INDUSTRY", examples: searchExamples.filter((e) => e.category === "industry") },
  ]

  const filteredExamples = activeFilter === "all" 
    ? searchExamples.slice(0, 6)
    : searchExamples.filter(example => example.category === activeFilter);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Try these examples</h3>
        <p className="text-sm text-gray-600">Click any example to start your search</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          ALL
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveFilter(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === category.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExamples.map((example) => {
          const Icon = example.icon
          return (
            <button
              key={example.id}
              onClick={() => onExampleSelect(example.query)}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{example.title}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{example.description}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                      {example.category}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>


    </div>
  )
}
