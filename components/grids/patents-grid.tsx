"use client";

import { useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import { AgGridWrapper } from '@/components/ui/ag-grid-wrapper';

interface PatentsGridProps {
  onRowSelect: (patent: any) => void;
}

const samplePatents = [
  {
    id: '1',
    title: 'Machine Learning Algorithm for Predictive Analytics',
    type: 'Patent',
    inventor: 'Dr. Sarah Mitchell',
    company: 'Tech Innovations Inc',
    dateFiled: '11/30/2025',
    patentNumber: 'US-2025-1234567',
    status: 'Granted'
  },
  {
    id: '2',
    title: 'Blockchain-Based Supply Chain Management System',
    type: 'Patent',
    inventor: 'James Chen',
    company: 'LogiChain Solutions',
    dateFiled: '11/15/2025',
    patentNumber: 'US-2025-1234568',
    status: 'Pending'
  },
  {
    id: '3',
    title: 'AI-Powered Code Review and Optimization Platform',
    type: 'Patent',
    inventor: 'Maria Gonzalez',
    company: 'CodeWise Technologies',
    dateFiled: '10/28/2025',
    patentNumber: 'US-2025-1234569',
    status: 'Filed'
  },
];

export function PatentsGrid({ onRowSelect }: PatentsGridProps) {
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
      minWidth: 300,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      cellRenderer: (params: any) => (
        <span className="inline-block px-3 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700">
          {params.value}
        </span>
      ),
    },
    {
      field: 'inventor',
      headerName: 'Inventor/Author',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'company',
      headerName: 'Company/Institution',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'dateFiled',
      headerName: 'Date Filed/Published',
      width: 140,
    },
    {
      field: 'patentNumber',
      headerName: 'Patent/ID Number',
      width: 160,
      cellRenderer: (params: any) => (
        <span className="font-mono text-xs text-slate-600">
          {params.value}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      cellRenderer: (params: any) => {
        const colorClass = params.value === 'Granted'
          ? 'bg-green-100 text-green-700'
          : params.value === 'Pending'
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-gray-100 text-gray-700';

        return (
          <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${colorClass}`}>
            {params.value}
          </span>
        );
      },
    },
  ], [onRowSelect]);

  return (
    <AgGridWrapper
      rowData={samplePatents}
      columnDefs={columnDefs}
      onRowClick={onRowSelect}
    />
  );
}
