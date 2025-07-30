"use client"

import { useState } from "react"
import { AutoCompleteSearch } from "./components/auto-complete-search"
import {
  Search,
  Download,
  Upload,
  Mail,
  Bell,
  Zap,
  Database,
  Plus,
  ExternalLink,
  Sparkles,
  Globe,
  Phone,
  MapPin,
  Users,
  Building,
  Calendar,
  DollarSign,
  Check,
  Settings,
  RefreshCw,
  FileText,
  ArrowRight,
  Target,
  BarChart3,
  Table,
  Cloud,
  TrendingUp,
} from "lucide-react"

const MarketResearchPlatform = () => {
  const [currentScreen, setCurrentScreen] = useState("search")
  const [searchQuery, setSearchQuery] = useState("AI meeting transcription tools")
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [enrichmentData, setEnrichmentData] = useState({})

  // Navigation items
  const navigationItems = [
    { id: "search", name: "Market Search", icon: Search, description: "Find and validate companies" },
    { id: "enrich", name: "Data Enrichment", icon: Database, description: "Add valuable data points" },
    { id: "action", name: "Take Action", icon: Zap, description: "Export, outreach & monitor" },
    { id: "dashboard", name: "Dashboard", icon: BarChart3, description: "Track performance" },
  ]

  // Sample company data
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Otter.ai",
      description: "Real-time transcription with speaker identification",
      website: "https://otter.ai",
      employees: "51-200",
      funding: "$63M",
      location: "Mountain View, CA",
      industry: "AI/ML",
      founded: "2016",
      email: "contact@otter.ai",
      phone: "+1 (650) 555-0100",
      relevance: "high",
      status: "validated",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Fireflies.ai",
      description: "AI meeting assistant with CRM integration",
      website: "https://fireflies.ai",
      employees: "11-50",
      funding: "$19M",
      location: "San Francisco, CA",
      relevance: "high",
      status: "validated",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Fathom AI",
      description: "Real-time transcription and live recording",
      website: "https://fathom.video",
      employees: "11-50",
      funding: "$4.7M",
      location: "San Francisco, CA",
      relevance: "medium",
      status: "pending",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Sembly AI",
      description: "Free plan available; real-time transcription",
      website: "https://sembly.ai",
      employees: "1-10",
      funding: "Unknown",
      location: "Remote",
      relevance: "low",
      status: "pending",
      logo: "/placeholder.svg?height=40&width=40",
    },
  ])

  // Search Screen Component
  const SearchScreen = () => {
    const [filters, setFilters] = useState({
      funding: "all",
      employees: "all",
      location: "all",
      industry: "all",
    })
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = () => {
      setIsSearching(true)
      setTimeout(() => {
        setIsSearching(false)
      }, 2000)
    }

    return (
      <div className="space-y-6">
        {/* Search Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Research Search</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <AutoCompleteSearch
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
                onSelect={(suggestion) => setSearchQuery(suggestion.text)}
                placeholder="Describe your target market..."
                className="w-full"
                tabIndex={1}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Funding Stage</label>
              <select
                value={filters.funding}
                onChange={(e) => setFilters({ ...filters, funding: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Stages</option>
                <option value="seed">Seed</option>
                <option value="series-a">Series A</option>
                <option value="series-b">Series B+</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
              <select
                value={filters.employees}
                onChange={(e) => setFilters({ ...filters, employees: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Sizes</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="200+">200+ employees</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Locations</option>
                <option value="us">United States</option>
                <option value="eu">Europe</option>
                <option value="asia">Asia</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Industries</option>
                <option value="ai-ml">AI/ML</option>
                <option value="saas">SaaS</option>
                <option value="fintech">FinTech</option>
                <option value="healthtech">HealthTech</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Search Results</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{companies.length} companies found</span>
                <button className="text-sm text-blue-600 hover:text-blue-700">Export List</button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {companies.map((company) => (
              <div key={company.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  <img
                    src={company.logo || "/placeholder.svg"}
                    alt={company.name}
                    className="w-12 h-12 rounded-lg border"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{company.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{company.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {company.employees} employees
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {company.funding} funding
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {company.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            company.relevance === "high"
                              ? "bg-green-100 text-green-700"
                              : company.relevance === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {company.relevance} relevance
                        </span>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Save Search</button>
          <button
            onClick={() => setCurrentScreen("enrich")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            Continue to Enrichment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Enrichment Screen Component
  const EnrichmentScreen = () => {
    const [selectedColumns, setSelectedColumns] = useState(["website", "employees", "funding", "location"])
    const [isEnriching, setIsEnriching] = useState(false)

    const availableColumns = [
      { id: "website", name: "Website", icon: Globe },
      { id: "employees", name: "Employee Count", icon: Users },
      { id: "funding", name: "Total Funding", icon: DollarSign },
      { id: "location", name: "HQ Location", icon: MapPin },
      { id: "industry", name: "Industry", icon: Building },
      { id: "founded", name: "Founded Year", icon: Calendar },
      { id: "email", name: "Contact Email", icon: Mail },
      { id: "phone", name: "Phone Number", icon: Phone },
    ]

    const handleEnrich = () => {
      setIsEnriching(true)
      setTimeout(() => {
        setIsEnriching(false)
      }, 3000)
    }

    return (
      <div className="space-y-6">
        {/* Enrichment Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Enrichment</h2>
          <p className="text-gray-600">Add valuable data points to your {companies.length} companies</p>
        </div>

        {/* Column Selection */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-4">Select Data Points</h3>
          <div className="grid grid-cols-4 gap-4">
            {availableColumns.map((column) => {
              const Icon = column.icon
              const isSelected = selectedColumns.includes(column.id)
              return (
                <button
                  key={column.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedColumns((prev) => prev.filter((id) => id !== column.id))
                    } else {
                      setSelectedColumns((prev) => [...prev, column.id])
                    }
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon className={`w-5 h-5 mx-auto mb-2 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />
                  <div className="text-sm font-medium text-gray-900">{column.name}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Preview Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="font-medium text-gray-900">Data Preview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  {selectedColumns.map((columnId) => {
                    const column = availableColumns.find((c) => c.id === columnId)
                    return (
                      <th key={columnId} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {column?.name}
                      </th>
                    )
                  })}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {companies.slice(0, 3).map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img src={company.logo || "/placeholder.svg"} alt={company.name} className="w-8 h-8 rounded" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          <div className="text-sm text-gray-500">{company.description}</div>
                        </div>
                      </div>
                    </td>
                    {selectedColumns.map((columnId) => (
                      <td key={columnId} className="px-4 py-4 text-sm text-gray-900">
                        {company[columnId] || "—"}
                      </td>
                    ))}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          company.status === "validated"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {company.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enrichment Progress */}
        {isEnriching && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Enriching data...</span>
              <span className="text-sm text-blue-700">Processing...</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }} />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentScreen("search")}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Search
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleEnrich}
              disabled={isEnriching}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isEnriching ? "Enriching..." : "Start Enrichment"}
            </button>
            <button
              onClick={() => setCurrentScreen("action")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              Take Action
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Action Screen Component
  const ActionScreen = () => {
    const [activeTab, setActiveTab] = useState("export")

    return (
      <div className="space-y-6">
        {/* Action Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Take Action on Your List</h2>
          <p className="text-gray-600">Export, outreach, and monitor your {companies.length} validated companies</p>
        </div>

        {/* Action Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab("export")}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === "export"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Export & Sync
                </div>
              </button>
              <button
                onClick={() => setActiveTab("outreach")}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === "outreach"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Outreach Campaigns
                </div>
              </button>
              <button
                onClick={() => setActiveTab("monitor")}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === "monitor"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Live Monitoring
                </div>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "export" && (
              <div className="space-y-6">
                <h3 className="font-medium text-gray-900">Export Destinations</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Google Sheets", icon: Table, description: "Real-time sync" },
                    { name: "HubSpot CRM", icon: Database, description: "Create contacts" },
                    { name: "Salesforce", icon: Cloud, description: "Sync with objects" },
                    { name: "CSV Download", icon: Download, description: "Instant download" },
                  ].map((target) => {
                    const Icon = target.icon
                    return (
                      <button
                        key={target.name}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{target.name}</div>
                            <div className="text-sm text-gray-600">{target.description}</div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === "outreach" && (
              <div className="space-y-6">
                <h3 className="font-medium text-gray-900">Email Campaigns</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">AI Meeting Tools Introduction</h4>
                        <p className="text-sm text-gray-600 mt-1">Personalized outreach to AI companies</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Create Campaign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "monitor" && (
              <div className="space-y-6">
                <h3 className="font-medium text-gray-900">Monitoring Alerts</h3>
                <div className="space-y-4">
                  {[
                    { name: "New funding rounds", icon: DollarSign },
                    { name: "Leadership changes", icon: Users },
                    { name: "Press releases", icon: FileText },
                    { name: "Job postings", icon: Building },
                  ].map((trigger) => {
                    const Icon = trigger.icon
                    return (
                      <div
                        key={trigger.name}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-900">{trigger.name}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentScreen("enrich")}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Enrichment
          </button>
          <button
            onClick={() => setCurrentScreen("dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            View Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Dashboard Screen Component
  const DashboardScreen = () => {
    return (
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Dashboard</h2>
          <p className="text-gray-600">Track your market research and outreach performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">1,247</div>
                <div className="text-sm text-gray-600">Companies Found</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">342</div>
                <div className="text-sm text-gray-600">Validated</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">89</div>
                <div className="text-sm text-gray-600">Emails Sent</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">23%</div>
                <div className="text-sm text-gray-600">Response Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { action: "New company added", company: "Otter.ai", time: "2 hours ago", type: "success" },
                { action: "Email campaign sent", company: "15 companies", time: "4 hours ago", type: "info" },
                { action: "Funding alert", company: "Fireflies.ai raised $19M", time: "1 day ago", type: "warning" },
                { action: "Data enriched", company: "25 companies", time: "2 days ago", type: "success" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "info"
                          ? "bg-blue-500"
                          : activity.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                    <div className="text-sm text-gray-600">{activity.company}</div>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentScreen("action")}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Actions
          </button>
          <button
            onClick={() => setCurrentScreen("search")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Market Research Platform</h1>
                <p className="text-sm text-gray-600">Find, enrich, and engage with your target market</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-colors ${
                    currentScreen === item.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {currentScreen === "search" && <SearchScreen />}
        {currentScreen === "enrich" && <EnrichmentScreen />}
        {currentScreen === "action" && <ActionScreen />}
        {currentScreen === "dashboard" && <DashboardScreen />}
      </div>
    </div>
  )
}

export default MarketResearchPlatform
