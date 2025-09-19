"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SuspenseWrapper, TableSkeleton } from './suspense-wrapper'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw } from 'lucide-react'

interface StreamingTableProps {
  data: any[]
  columns: string[]
  isLoading?: boolean
  onRefresh?: () => void
  onExport?: () => void
  title?: string
}

export function StreamingTable({ 
  data, 
  columns, 
  isLoading = false, 
  onRefresh, 
  onExport,
  title 
}: StreamingTableProps) {
  const [displayedRows, setDisplayedRows] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Потоковая загрузка строк таблицы
  useEffect(() => {
    if (!data.length) {
      setDisplayedRows([])
      setCurrentIndex(0)
      return
    }

    setDisplayedRows([])
    setCurrentIndex(0)

    const streamRows = () => {
      const batchSize = 3 // Загружаем по 3 строки за раз
      let index = 0

      const addBatch = () => {
        const batch = data.slice(index, index + batchSize)
        if (batch.length > 0) {
          setDisplayedRows(prev => [...prev, ...batch])
          index += batchSize
          setCurrentIndex(index)
          
          if (index < data.length) {
            setTimeout(addBatch, 200) // Задержка между батчами
          }
        }
      }

      addBatch()
    }

    streamRows()
  }, [data])

  if (isLoading && displayedRows.length === 0) {
    return <TableSkeleton rows={8} />
  }

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Badge variant="outline">
              {displayedRows.length} {currentIndex < data.length ? `of ${data.length}` : 'total'}
            </Badge>
          </div>
          <div className="flex gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            )}
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className="font-semibold">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedRows.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                className="animate-in slide-in-from-top-2 duration-300"
                style={{ animationDelay: `${(rowIndex % 3) * 100}ms` }}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {renderCellValue(row[column] || row[column.toLowerCase()] || '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {currentIndex < data.length && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Loading more rows...
          </div>
        </div>
      )}

      {displayedRows.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      )}
    </div>
  )
}

// Функция для рендера значений ячеек
function renderCellValue(value: any) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-400">-</span>
  }
  
  if (typeof value === 'boolean') {
    return (
      <Badge variant={value ? "default" : "secondary"}>
        {value ? "Yes" : "No"}
      </Badge>
    )
  }
  
  if (typeof value === 'string' && value.startsWith('http')) {
    return (
      <a 
        href={value} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline truncate max-w-xs block"
      >
        {value}
      </a>
    )
  }
  
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.slice(0, 3).map((item, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {String(item)}
          </Badge>
        ))}
        {value.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{value.length - 3}
          </Badge>
        )}
      </div>
    )
  }
  
  return <span className="truncate max-w-xs block">{String(value)}</span>
}

// Обертка с Suspense
export function StreamingTableWithSuspense(props: StreamingTableProps) {
  return (
    <SuspenseWrapper fallback={<TableSkeleton rows={8} />}>
      <StreamingTable {...props} />
    </SuspenseWrapper>
  )
}
