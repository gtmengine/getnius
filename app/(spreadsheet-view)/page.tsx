'use client'

import { useState, useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { Input } from '@/components/ui/input'
import { Search, Download, Filter } from 'lucide-react'
import { ColDef } from 'ag-grid-community'
import { Button } from '@/components/ui/button'

// Sample data - replace with your actual data
const sampleData = [
  { id: 1, company: 'Apple Inc.', sector: 'Technology', marketCap: '2.8T', revenue: '394.3B', growth: '8.5%', employees: '164000' },
  { id: 2, company: 'Microsoft', sector: 'Technology', marketCap: '2.5T', revenue: '211.9B', growth: '12.3%', employees: '221000' },
  { id: 3, company: 'Amazon', sector: 'E-commerce', marketCap: '1.6T', revenue: '574.8B', growth: '9.2%', employees: '1541000' },
  { id: 4, company: 'Tesla', sector: 'Automotive', marketCap: '800B', revenue: '96.8B', growth: '15.7%', employees: '140000' },
  { id: 5, company: 'Meta', sector: 'Social Media', marketCap: '950B', revenue: '134.9B', growth: '11.4%', employees: '86325' },
  { id: 6, company: 'Alphabet', sector: 'Technology', marketCap: '1.8T', revenue: '307.4B', growth: '10.8%', employees: '190234' },
  { id: 7, company: 'NVIDIA', sector: 'Technology', marketCap: '1.2T', revenue: '60.9B', growth: '126.5%', employees: '29600' },
  { id: 8, company: 'Berkshire Hathaway', sector: 'Finance', marketCap: '890B', revenue: '364.5B', growth: '6.2%', employees: '383000' },
  { id: 9, company: 'Johnson & Johnson', sector: 'Healthcare', marketCap: '420B', revenue: '85.2B', growth: '5.8%', employees: '135000' },
  { id: 10, company: 'Visa', sector: 'Finance', marketCap: '480B', revenue: '32.7B', growth: '11.2%', employees: '26500' },
  { id: 11, company: 'JPMorgan Chase', sector: 'Finance', marketCap: '520B', revenue: '158.1B', growth: '7.8%', employees: '296966' },
  { id: 12, company: 'Walmart', sector: 'Retail', marketCap: '420B', revenue: '611.3B', growth: '5.9%', employees: '2100000' },
]

export default function SpreadsheetPage() {
  const [searchText, setSearchText] = useState('')
  const [rowData] = useState(sampleData)

  // Column definitions
  const columnDefs: ColDef[] = useMemo(() => [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80, 
      filter: 'agNumberColumnFilter',
      pinned: 'left'
    },
    { 
      field: 'company', 
      headerName: 'Company', 
      flex: 1.5, 
      filter: 'agTextColumnFilter', 
      sortable: true 
    },
    { 
      field: 'sector', 
      headerName: 'Sector', 
      flex: 1, 
      filter: 'agTextColumnFilter',
      sortable: true 
    },
    { 
      field: 'marketCap', 
      headerName: 'Market Cap', 
      flex: 1, 
      filter: 'agTextColumnFilter',
      sortable: true 
    },
    { 
      field: 'revenue', 
      headerName: 'Revenue', 
      flex: 1, 
      filter: 'agTextColumnFilter',
      sortable: true 
    },
    { 
      field: 'employees', 
      headerName: 'Employees', 
      flex: 1, 
      filter: 'agTextColumnFilter' 
    },
    { 
      field: 'growth', 
      headerName: 'Growth Rate', 
      flex: 1,
      sortable: true,
      cellStyle: (params) => {
        const value = parseFloat(params.value)
        if (value > 10) return { backgroundColor: '#dcfce7', color: '#166534', fontWeight: '600' }
        if (value < 8) return { backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: '600' }
        return { backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '600' }
      }
    },
  ], [])

  // Default column properties
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    editable: false,
    floatingFilter: false,
  }), [])

  // Quick filter based on search text
  const onFilterTextBoxChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }, [])

  // Export functionality
  const handleExport = useCallback(() => {
    alert('Export functionality would be implemented here')
  }, [])

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      {/* Toolbar Section */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search across all columns..."
              className="pl-10 h-10 text-sm border-gray-300 rounded-md"
              value={searchText}
              onChange={onFilterTextBoxChanged}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="rounded-md">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="rounded-md">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* AG Grid Spreadsheet */}
      <div className="flex-1 ag-theme-quartz bg-white" style={{ width: '100%', height: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={searchText}
          pagination={false}
          animateRows={true}
          rowSelection="multiple"
          enableCellTextSelection={true}
          ensureDomOrder={true}
          suppressRowClickSelection={false}
          suppressAggFuncInHeader={true}
          domLayout="normal"
          rowDragManaged={true}
          theme="legacy"
        />
      </div>
    </div>
  )
}

