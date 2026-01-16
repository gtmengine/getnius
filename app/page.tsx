'use client'

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Search, TrendingUp, Database, BarChart3, ArrowRight, CheckCircle, Zap, Shield, Globe, History, Settings, Upload, Share2, Loader2, X, FileSpreadsheet, DownloadCloud, Plus, ChevronDown, LogIn, LogOut, User } from 'lucide-react'
import * as XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'
// import { cookies } from 'next/headers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ColDef, AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { searchWithExtruct, type Company } from '@/lib/search-apis'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule])

// Dynamically import AgGridReact to avoid SSR issues
const AgGridReact = dynamic(() => import('ag-grid-react').then(mod => ({ default: mod.AgGridReact })), {
  ssr: false
})

const MATCH_SCORE_LEVELS = 4
const getRandomMatchScore = () => Math.floor(Math.random() * MATCH_SCORE_LEVELS) + 1

export default function HomePage() {
  // Sample data based on search - Enhanced with more companies
  const generateSampleData = (query: string) => {
    return [
      { id: 1, company: 'Salesforce', sector: 'SaaS', location: 'San Francisco, CA', employees: '73000', founded: '1999', revenue: '$31.4B', growth: '11.2%', website: 'salesforce.com' },
      { id: 2, company: 'Slack Technologies', sector: 'SaaS', location: 'San Francisco, CA', employees: '2500', founded: '2009', revenue: '$1.5B', growth: '18.5%', website: 'slack.com' },
      { id: 3, company: 'Stripe', sector: 'SaaS', location: 'San Francisco, CA', employees: '8000', founded: '2010', revenue: '$14B', growth: '25.3%', website: 'stripe.com' },
      { id: 4, company: 'Twilio', sector: 'SaaS', location: 'San Francisco, CA', employees: '7900', founded: '2008', revenue: '$3.8B', growth: '14.7%', website: 'twilio.com' },
      { id: 5, company: 'Dropbox', sector: 'SaaS', location: 'San Francisco, CA', employees: '3000', founded: '2007', revenue: '$2.3B', growth: '9.8%', website: 'dropbox.com' },
      { id: 6, company: 'Zendesk', sector: 'SaaS', location: 'San Francisco, CA', employees: '6000', founded: '2007', revenue: '$1.7B', growth: '12.4%', website: 'zendesk.com' },
      { id: 7, company: 'DocuSign', sector: 'SaaS', location: 'San Francisco, CA', employees: '7500', founded: '2003', revenue: '$2.4B', growth: '16.9%', website: 'docusign.com' },
      { id: 8, company: 'Atlassian', sector: 'SaaS', location: 'San Francisco, CA', employees: '10000', founded: '2002', revenue: '$3.5B', growth: '21.1%', website: 'atlassian.com' },
      { id: 9, company: 'Asana', sector: 'SaaS', location: 'San Francisco, CA', employees: '1600', founded: '2008', revenue: '$547M', growth: '23.7%', website: 'asana.com' },
      { id: 10, company: 'Workday', sector: 'SaaS', location: 'San Francisco, CA', employees: '18000', founded: '2005', revenue: '$7.2B', growth: '16.5%', website: 'workday.com' },
      { id: 11, company: 'ServiceNow', sector: 'SaaS', location: 'San Francisco, CA', employees: '22000', founded: '2004', revenue: '$8.9B', growth: '19.8%', website: 'servicenow.com' },
      { id: 12, company: 'Okta', sector: 'SaaS', location: 'San Francisco, CA', employees: '6000', founded: '2009', revenue: '$2.3B', growth: '15.2%', website: 'okta.com' },
      { id: 13, company: 'PagerDuty', sector: 'SaaS', location: 'San Francisco, CA', employees: '950', founded: '2009', revenue: '$390M', growth: '13.9%', website: 'pagerduty.com' },
      { id: 14, company: 'Amplitude', sector: 'SaaS', location: 'San Francisco, CA', employees: '800', founded: '2012', revenue: '$267M', growth: '28.4%', website: 'amplitude.com' },
      { id: 15, company: 'Segment', sector: 'SaaS', location: 'San Francisco, CA', employees: '500', founded: '2011', revenue: '$200M', growth: '31.2%', website: 'segment.com' },
    ]
  }

  const [searchQuery, setSearchQuery] = useState('e.g., SaaS startups in San Francisco with ~50 employees')
  const [showSpreadsheet, setShowSpreadsheet] = useState(false)
  const [rowData, setRowData] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const spreadsheetRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<any>(null)

  // Sidebar state
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [selectedCellData, setSelectedCellData] = useState<{
    value: any;
    field: string;
    headerName: string;
    rowData: any;
    rowIndex: number;
  } | null>(null)
  const [columnSuggestionsOpen, setColumnSuggestionsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [aiColumnSuggestions, setAiColumnSuggestions] = useState<string[]>([
    'Company Size',
    'Funding Stage',
    'Revenue Range',
    'Employee Count',
    'Industry Sector',
    'Location',
    'Founded Year',
    'Growth Rate',
    'Key Technologies',
    'Contact Email',
    'Website',
    'Social Media',
    'Product Category',
    'Target Market',
    'Competitors'
  ])
  const [columnSuggestionsLoading, setColumnSuggestionsLoading] = useState(false)

  // Authentication functions
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Fetch AI column suggestions
  const fetchColumnSuggestions = async () => {
    try {
      setColumnSuggestionsLoading(true)
      const existingColumns = columnDefs.map(col => col.field).join(',')
      const response = await fetch(`/api/columns?query=${encodeURIComponent(searchQuery)}&existing=${existingColumns}`)
      const data = await response.json()

      if (data.suggestions) {
        setAiColumnSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error('Failed to fetch column suggestions:', error)
    } finally {
      setColumnSuggestionsLoading(false)
    }
  }

  // Cell click handler for sidebar
  const handleCellClicked = (event: any) => {
    const { data, colDef, rowIndex, value } = event;
    setSelectedCellData({
      value,
      field: colDef.field,
      headerName: colDef.headerName,
      rowData: data,
      rowIndex
    });
    setSidebarVisible(true);
  };

  // Column definitions state for dynamic column addition
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 1.5,
      filter: 'agTextColumnFilter',
      editable: true,
      cellStyle: { fontWeight: '600' }
    },
    {
      field: 'sector',
      headerName: 'Sector',
      flex: 1,
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1.5,
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      field: 'employees',
      headerName: 'Employees',
      flex: 1,
      filter: 'agNumberColumnFilter',
      editable: true,
      valueFormatter: (params) => {
        return params.value ? Number(params.value).toLocaleString() : ''
      }
    },
    {
      field: 'founded',
      headerName: 'Founded',
      flex: 0.8,
      filter: 'agNumberColumnFilter',
      editable: true
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      flex: 1,
      filter: 'agNumberColumnFilter',
      editable: true,
      valueGetter: (params: any) => {
        const value = params.data?.revenue;
        if (value === 'N/A' || !value) return null;

        // Extract numeric value for sorting
        const match = value.match(/\$?([\d.]+)([MBK]?)/);
        if (match) {
          let num = parseFloat(match[1]);
          const unit = match[2];

          // Convert to billions for consistent comparison
          switch (unit) {
            case 'K': num /= 1000000; break; // K to billions
            case 'M': num /= 1000; break;   // M to billions
            case 'B': break;                 // Already in billions
            default: num /= 1000000000; break; // Assume raw number is in dollars
          }
          return num;
        }
        return null;
      },
      valueFormatter: (params: any) => {
        if (!params.value) return 'N/A';

        // Format for display
        if (params.value >= 1000) return `$${(params.value / 1000).toFixed(1)}T`;
        if (params.value >= 1) return `$${params.value.toFixed(1)}B`;
        if (params.value >= 0.001) return `$${(params.value * 1000).toFixed(0)}M`;
        return `$${(params.value * 1000000).toFixed(0)}K`;
      },
      comparator: (valueA: number, valueB: number) => {
        if (valueA == null && valueB == null) return 0;
        if (valueA == null) return -1;
        if (valueB == null) return 1;
        return valueA - valueB;
      }
    },
    {
      field: 'growth',
      headerName: 'Growth Rate',
      flex: 1,
      filter: 'agNumberColumnFilter',
      editable: true,
      cellStyle: (params) => {
        const value = parseFloat(params.value)
        if (value > 20) return { backgroundColor: '#dcfce7', color: '#166534', fontWeight: '600' }
        if (value > 15) return { backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: '600' }
        if (value < 12) return { backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '600' }
        return null
      }
    },
    {
      field: 'website',
      headerName: 'Website',
      flex: 1.2,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: any) => {
        const value = params.value;
        if (value === 'N/A' || !value) return 'N/A';

        // Return JSX element instead of DOM element
        return React.createElement('a', {
          href: `https://${value}`,
          target: '_blank',
          style: {
            color: '#2563eb',
            textDecoration: 'underline',
            cursor: 'pointer'
          },
          className: 'hover:text-blue-700',
          onClick: (e: any) => e.stopPropagation() // Prevent row selection
        }, value);
      }
    },
  ])

  // Helper function to generate new rows
  const generateNewRows = useCallback((count: number) => {
    const baseCompanies = [
      'InnovateTech', 'GlobalSolutions', 'FutureSystems', 'DynamicData', 'PioneerCorp',
      'ApexInnovations', 'QuantumLeap', 'SynergyWorks', 'EliteEnterprises', 'VisionaryLabs',
      'TechNova', 'DataStream', 'CloudVenture', 'NextGen', 'SmartCore'
    ]
    const sectors = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'SaaS', 'E-commerce']
    const locations = ['New York, NY', 'London, UK', 'Berlin, DE', 'Tokyo, JP', 'Sydney, AU', 'San Francisco, CA', 'Boston, MA']
    
    const maxId = rowData.length > 0 
      ? Math.max(...rowData.map(r => typeof r.id === 'string' ? parseInt(r.id.split('_').pop() || '0') : r.id))
      : 0
    
    const newRows = []
    for (let i = 0; i < count; i++) {
      const id = maxId + i + 1
      const companyName = baseCompanies[Math.floor(Math.random() * baseCompanies.length)] + ' ' + id
      const sector = sectors[Math.floor(Math.random() * sectors.length)]
      const location = locations[Math.floor(Math.random() * locations.length)]
      const employees = (Math.floor(Math.random() * 1000) + 50) * 10
      const founded = 1990 + Math.floor(Math.random() * 30)
      const revenue = `$${(Math.random() * 100 + 1).toFixed(1)}B`
      const growth = `${(Math.random() * 20 + 5).toFixed(1)}%`
      const website = `${companyName.toLowerCase().replace(/\s/g, '')}.com`

      newRows.push({
        id,
        company: companyName,
        sector,
        location,
        employees: employees.toString(),
        founded: founded.toString(),
        revenue,
        growth,
        website
      })
    }
    return newRows
  }, [rowData])

  // Handler to add rows
  const handleAddRows = useCallback((count: number) => {
    const newRows = generateNewRows(count)
    setRowData(prev => [...prev, ...newRows])
    
    // Scroll to bottom after adding rows
    setTimeout(() => {
      if (gridRef.current) {
        const lastRow = gridRef.current.getDisplayedRowCount() - 1
        gridRef.current.ensureIndexVisible(lastRow, 'bottom')
      }
    }, 100)
  }, [generateNewRows])

  // Transform Company from API to grid row format
  const transformCompanyToRow = (company: Company, index: number): any => {
    // Data validation and sanitization functions
    const sanitizeString = (value: any): string => {
      if (!value || typeof value !== 'string') return 'N/A';
      const clean = value.trim();
      if (clean.length === 0 || clean.length < 2) return 'N/A'; // Filter out corrupted short values
      return clean;
    };

    const sanitizeNumber = (value: any): string => {
      if (!value) return 'N/A';
      const num = typeof value === 'string' ? parseInt(value.replace(/[^\d]/g, '')) : value;
      if (isNaN(num) || num === 0) return 'N/A';
      return num.toLocaleString();
    };

    const sanitizeWebsite = (value: any): string => {
      if (!value || typeof value !== 'string') return 'N/A';
      let clean = value.trim().toLowerCase();
      clean = clean.replace(/^https?:\/\//, ''); // Remove protocol
      if (clean.length < 3 || !clean.includes('.') || clean.split('.').length < 2) return 'N/A';
      return clean;
    };

    const sanitizeRevenue = (value: any): string => {
      if (!value) return 'N/A';
      if (typeof value === 'string' && value.includes('$')) return value; // Already formatted

      let numValue: number;
      if (typeof value === 'number') {
        numValue = value;
      } else if (typeof value === 'string') {
        // Try to extract number from string
        const match = value.match(/[\d.]+/);
        if (match) {
          numValue = parseFloat(match[0]);
        } else {
          return 'N/A';
        }
      } else {
        return 'N/A';
      }

      // Format based on magnitude
      if (numValue >= 1000000000000) return `$${(numValue / 1000000000000).toFixed(1)}T`;
      if (numValue >= 1000000000) return `$${(numValue / 1000000000).toFixed(1)}B`;
      if (numValue >= 1000000) return `$${(numValue / 1000000).toFixed(0)}M`;
      if (numValue >= 1000) return `$${(numValue / 1000).toFixed(0)}K`;
      return `$${numValue.toFixed(0)}`;
    };

    return {
      id: company.id || `row_${index + 1}`,
      company: sanitizeString(company.name),
      sector: sanitizeString(company.industry),
      location: sanitizeString(company.location),
      employees: sanitizeNumber(company.employees),
      founded: sanitizeString(company.founded),
      revenue: sanitizeRevenue(company.funding),
      growth: 'N/A', // Google API doesn't provide growth rate
      website: sanitizeWebsite(company.website),
      description: sanitizeString(company.description),
      source: company.source || 'google'
    }
  }

  const features = [
    {
      icon: Database,
      title: 'Real-Time Data',
      description: 'Access live market data from thousands of companies worldwide'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Powerful tools to analyze trends, growth, and market patterns'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Search and filter through millions of data points instantly'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Market intelligence from every major industry and region'
    },
    {
      icon: TrendingUp,
      title: 'Growth Insights',
      description: 'Identify emerging trends and opportunities before your competitors'
    }
  ]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim()

    // Allow empty searches to navigate to spreadsheet view with default query
    if (query === '' || query === 'e.g., SaaS startups in San Francisco with ~50 employees') {
      // Use placeholder as default query
      const defaultQuery = 'SaaS companies'
      setSearchQuery(defaultQuery)
      await performSearch(defaultQuery)
    } else {
      await performSearch(query)
    }
  }

  const performSearch = async (query: string) => {
    setIsSearching(true)
    setShowSpreadsheet(true)

    try {
      // Call Extruct AI API
      const companies = await searchWithExtruct(query)

      if (companies.length > 0) {
        // Transform API results to grid format
        const transformedData = companies.map((company, index) => transformCompanyToRow(company, index))
        setRowData(transformedData)

        console.log(`Found ${companies.length} companies via Extruct AI`)
      } else {
        console.warn('No results from Extruct AI, using sample data')
        // Fallback to sample data if no results
        setRowData(generateSampleData(query))
      }

      // Scroll to spreadsheet
      setTimeout(() => {
        spreadsheetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (error) {
      console.error('Search error:', error)

      // Provide user feedback about API configuration
      if (error instanceof Error && error.message?.includes('credentials not configured')) {
        console.warn('Google API not configured - using sample data as fallback')
      }

      // Always provide sample data as fallback
      setRowData(generateSampleData(query))
    } finally {
      setIsSearching(false)
    }
  }

  const handleNewSearch = () => {
    setSearchQuery('')
    setShowSpreadsheet(false)
    setRowData([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleExport = useCallback((format: string) => {
    if (!gridRef.current) return

    const baseFileName = `market-research-${new Date().toISOString().split('T')[0]}`

    switch (format) {
      case 'csv':
        gridRef.current.exportDataAsCsv({
          fileName: `${baseFileName}.csv`
        })
        break
      case 'xlsx':
        // Export as XLSX using the xlsx library
        const allData: any[] = []
        gridRef.current.forEachNode((node: any) => {
          allData.push(node.data)
        })

        if (allData.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(allData)
          const workbook = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Market Research Data')
          XLSX.writeFile(workbook, `${baseFileName}.xlsx`)
        }
        break
      case 'csv_sources':
        gridRef.current.exportDataAsCsv({
          fileName: `${baseFileName}-with-sources.csv`
        })
        console.log('CSV with sources export - additional data would be included')
        break
      case 'xlsx_sources':
        // Export as XLSX with sources using the xlsx library
        const allDataWithSources: any[] = []
        gridRef.current.forEachNode((node: any) => {
          allDataWithSources.push(node.data)
        })

        if (allDataWithSources.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(allDataWithSources)
          const workbook = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Market Research Data')
          XLSX.writeFile(workbook, `${baseFileName}-with-sources.xlsx`)
        }
        break
      default:
        gridRef.current.exportDataAsCsv({
          fileName: `${baseFileName}.csv`
        })
    }
  }, [])

  const handleExportCSV = useCallback(() => {
    handleExport('csv')
  }, [handleExport])

  // Handle deleting selected rows
  const handleDeleteRows = useCallback(() => {
    if (!gridRef.current) return

    const selectedRows = gridRef.current.getSelectedRows()
    if (selectedRows.length === 0) return

    // Remove selected rows from rowData
    setRowData(prevData =>
      prevData.filter(row =>
        !selectedRows.some((selectedRow: any) =>
          selectedRow === row
        )
      )
    )
  }, [])

  // Handle adding new column with specific name
  const handleAddColumnWithName = useCallback((columnName: string) => {
    // Generate unique field name
    const existingFields = columnDefs.map(col => col.field)
    let newFieldName = columnName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
    let counter = 1

    while (existingFields.includes(`${newFieldName}_${counter}`) || existingFields.includes(newFieldName)) {
      counter++
    }

    const fieldName = counter === 1 ? newFieldName : `${newFieldName}_${counter}`

    // Add new column to the column definitions
    const newColumn: ColDef = {
      field: fieldName,
      headerName: columnName,
      flex: 1,
      filter: 'agTextColumnFilter',
      editable: true,
    }

    setColumnDefs(prev => [...prev, newColumn])

    // Add the new field to all existing rows
    setRowData(prev => prev.map(row => ({
      ...row,
      [fieldName]: ''
    })))

    // Close the suggestions popover
    setColumnSuggestionsOpen(false)
  }, [columnDefs])

  // Handle adding new column (legacy - uses default name)
  const handleAddColumn = useCallback(() => {
    handleAddColumnWithName('Custom Field')
  }, [handleAddColumnWithName])


  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
    floatingFilter: false,
    cellStyle: { fontSize: '14px' },
  }), [])

  return (
    <div className="min-h-screen bg-background" data-fallback="page-shell">
      {/* Top Action Buttons - Only show when spreadsheet is visible */}
      {showSpreadsheet && (
        <div className="border-b bg-card" data-fallback="action-bar">
          <div className="container mx-auto px-6 py-4" data-fallback="action-inner">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="lg" onClick={handleNewSearch}>
                  NEW SEARCH
                </Button>
                <Button variant="outline" size="lg">
                  <History className="mr-2 h-4 w-4" />
                  HISTORY
                </Button>
                <div className="flex items-center gap-4 pl-2">
                  <Button variant="outline" size="lg">
                    Enrich
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  className="flex w-32 h-6 items-center justify-center gap-2 rounded-md bg-green-200 text-sm font-semibold uppercase tracking-wide text-gray-800 hover:bg-green-300"
                >
                  <CheckCircle className="h-3 w-3" />
                  Match
                </Button>
                <Button
                  size="sm"
                  className="flex w-32 h-6 items-center justify-center gap-2 rounded-md bg-red-200 text-sm font-semibold uppercase tracking-wide text-gray-800 hover:bg-red-300"
                >
                  <X className="h-3 w-3" />
                  Not match
                </Button>
                <Link href="/settings">
                  <Button variant="outline" size="lg">
                    <Settings className="mr-2 h-4 w-4" />
                    SETTINGS
                  </Button>
                </Link>
                {!loading && (
                  user ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        {user.email}
                      </div>
                      <Button variant="outline" size="sm" onClick={signOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button variant="default" size="sm" onClick={signInWithGoogle}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In with Google
                    </Button>
                  )
                )}
                <Button variant="default" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="sm">
                      <DownloadCloud className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[220px]">
                    <DropdownMenuItem onClick={() => handleExport('csv')}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      XLSX
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('csv_sources')}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      CSV with Sources & Steps
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('xlsx_sources')}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      XLSX with Sources & Steps
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation - Only show when spreadsheet is NOT visible */}
      {!showSpreadsheet && (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-fallback="nav">
          <div className="container mx-auto px-6 py-4" data-fallback="nav-inner">
            <div className="flex items-center justify-between" data-fallback="nav-brand-row">
              <div className="flex items-center gap-2">
                <Database className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  GETNI.US
                </span>
              </div>
              <div className="flex items-center gap-6" data-fallback="nav-links">
                <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
                <Button size="sm">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Hero Section - Only show when spreadsheet is NOT visible */}
      {!showSpreadsheet && (
        <section className="w-full bg-gradient-to-br from-background via-background to-muted/20" data-fallback="hero">
          <div className="container mx-auto px-6 pt-20 pb-32">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Zap className="h-4 w-4" />
                <span>Powered by Real-Time Market Intelligence</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                Market Research
                <br />
                <span className="text-4xl md:text-5xl">Reimagined</span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                Access comprehensive market data, analyze trends, and make data-driven decisions with our powerful spreadsheet-based platform.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g., SaaS startups in San Francisco with ~50 employees"
                    className="w-full pl-6 pr-32 h-14 text-base shadow-lg rounded-xl border-2 border-transparent focus:border-primary/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isSearching}
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 rounded-lg"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        SEARCH...
                      </>
                    ) : (
                      <>
                        SEARCH
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center p-4">
                  <div className="text-4xl font-bold mb-2 text-primary">10M+</div>
                  <div className="text-sm text-muted-foreground font-medium">Data Points</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold mb-2 text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground font-medium">Companies</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold mb-2 text-primary">150+</div>
                  <div className="text-sm text-muted-foreground font-medium">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Spreadsheet View - Show when search is performed */}
      {showSpreadsheet && (
        <div ref={spreadsheetRef} className="container mx-auto px-6 py-6" data-fallback="spreadsheet-shell">
          {/* Search Bar */}
          <div className="mb-6" data-fallback="spreadsheet-search">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative" data-fallback="search-wrapper">
                <Input
                  type="text"
                  placeholder="e.g., SaaS startups in San Francisco with ~50 employees"
                  className="w-full h-14 text-base pr-32 border-2 border-primary/20 focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isSearching}
                />
                <Button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Search...
                    </>
                  ) : (
                    <>
                      Search
                      <Search className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Spreadsheet Grid */}
          {isSearching ? (
            <div className="w-full h-[500px] flex items-center justify-center border rounded-lg bg-muted/50">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Searching companies via Extruct AI...</p>
                <p className="text-sm text-muted-foreground mt-2">Loading search results</p>
              </div>
            </div>
          ) : rowData.length > 0 ? (
            <div className="flex w-full gap-4">
              <div className={`bg-white rounded-lg border shadow-sm ${sidebarVisible ? 'flex-1' : 'w-full'}`} style={{ height: '75vh', minHeight: '500px' }}>
                {/* Header with Import CSV, Add rows, Delete rows, and ADD NEW COLUMN buttons */}
                <div className="flex justify-between items-center p-2 border-b bg-gray-50">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Import CSV
                  </Button>
                  <div className="flex items-center gap-2">
                    {/* Add Rows Group */}
                    <div className="flex items-center gap-1 border border-gray-200 rounded-md p-1 bg-white">
                      <Button variant="outline" size="sm" onClick={() => handleAddRows(1)} className="text-xs px-2 h-6">
                        ADD ROW
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAddRows(10)} className="text-xs px-2 h-6 w-10">
                        10
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAddRows(100)} className="text-xs px-2 h-6 w-10">
                        100
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAddRows(1000)} className="text-xs px-2 h-6 w-10">
                        1000
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDeleteRows}>
                      Delete rows
                    </Button>
                    <Popover open={columnSuggestionsOpen} onOpenChange={(open) => {
                      setColumnSuggestionsOpen(open)
                      if (open) {
                        fetchColumnSuggestions()
                      }
                    }}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          <span className="mr-2">ADD NEW COLUMN</span>
                          <ChevronDown
                            className="h-3 w-3 cursor-pointer hover:bg-gray-100 rounded p-0.5 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setColumnSuggestionsOpen(!columnSuggestionsOpen);
                            }}
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2" align="end">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-700 mb-2">AI Column Suggestions</p>
                          {columnSuggestionsLoading ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                              <span className="ml-2 text-xs text-gray-500">Generating suggestions...</span>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-1">
                              {aiColumnSuggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="ghost"
                                  size="sm"
                                  className="justify-start text-left h-7 px-2 text-xs"
                                  onClick={() => handleAddColumnWithName(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="ag-theme-quartz" style={{ width: '100%', height: '100%' }}>
                  <AgGridReact
                    onGridReady={(params) => {
                      gridRef.current = params.api;
                    }}
                    onCellClicked={handleCellClicked}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={false}
                    animateRows={true}
                    rowSelection="multiple"
                    enableCellTextSelection={true}
                    ensureDomOrder={true}
                    suppressRowClickSelection={false}
                    suppressExcelExport={false}
                    enableCharts={false}
                    domLayout="normal"
                    rowDragManaged={true}
                    theme="legacy"
                  />
                </div>
              </div>

              {/* Sidebar */}
              {sidebarVisible && selectedCellData && (
                <div className="w-80 bg-white border border-gray-200 shadow-lg rounded-lg flex flex-col" style={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}>
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Cell Information</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarVisible(false)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 p-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Column</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                        {selectedCellData.headerName}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Field</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border text-sm font-mono">
                        {selectedCellData.field}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Value</label>
                      <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded text-sm break-words">
                        {selectedCellData.value !== null && selectedCellData.value !== undefined
                          ? String(selectedCellData.value)
                          : 'Empty'}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Row Index</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                        {selectedCellData.rowIndex + 1}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Complete Row Data</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border text-xs font-mono max-h-40 overflow-y-auto">
                        <pre>{JSON.stringify(selectedCellData.rowData, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-[500px] flex items-center justify-center border rounded-lg bg-muted/50">
              <div className="text-center">
                <p className="text-muted-foreground">Enter a query to search for companies</p>
                <p className="text-sm text-muted-foreground mt-2">Results will appear in the table</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Features Grid - Only show when spreadsheet is NOT visible */}
      {!showSpreadsheet && (
        <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-muted-foreground">
            Powerful features to supercharge your market research
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>
      )}

      {/* CTA Section - Only show when spreadsheet is NOT visible */}
      {!showSpreadsheet && (
        <section className="container mx-auto px-6 py-20">
        <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of researchers and analysts using our platform
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8">
                View Demo
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </Card>
      </section>
      )}

      {/* Footer - Only show when spreadsheet is NOT visible */}
      {!showSpreadsheet && (
        <footer className="border-t mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Database className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">GETNI.US</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Market research platform for the modern age.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} GETNI.US Market Research Platform. All rights reserved.
          </div>
        </div>
      </footer>
      )}
    </div>
  )
}
