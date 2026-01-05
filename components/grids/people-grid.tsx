"use client";

import { useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import { AgGridWrapper } from '@/components/ui/ag-grid-wrapper';

interface PeopleGridProps {
  onRowSelect: (person: any) => void;
}

const samplePeople = [
  { id: '1', name: 'Sarah Chen', company: 'TechFlow Solutions', role: 'CTO', location: 'San Francisco, CA', email: 'sarah.chen@techflow.com', intents: 2 },
  { id: '2', name: 'Marcus Johnson', company: 'TechFlow Solutions', role: 'VP Engineering', location: 'San Francisco, CA', email: 'marcus.johnson@techflow.com', intents: 2 },
  { id: '3', name: 'Elena Rodriguez', company: 'DataDriven Inc', role: 'Chief Data Scientist', location: 'Austin, TX', email: 'elena.rodriguez@datadriven.com', intents: 2 },
  { id: '4', name: 'Frances Fisher', company: 'Chipoodle', role: 'Technology Manager', location: 'United States', email: 'frances.fisher@chipoodle.com', intents: 1 },
  { id: '5', name: 'William Floyd', company: 'Aliwawa', role: 'IT Services Manager', location: 'United States', email: 'william.floyd@aliwawa.com', intents: 1 },
];

export function PeopleGrid({ onRowSelect }: PeopleGridProps) {
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 140,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'intents',
      headerName: 'Intents',
      width: 100,
      cellRenderer: (params: any) => (
        <button
          className="px-2 py-1 text-xs bg-purple-600 text-white border border-purple-700 rounded hover:bg-purple-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onRowSelect(params.data);
          }}
        >
          {params.value} intents
        </button>
      ),
    },
  ], [onRowSelect]);

  return (
    <AgGridWrapper
      rowData={samplePeople}
      columnDefs={columnDefs}
      onRowClick={onRowSelect}
    />
  );
}
