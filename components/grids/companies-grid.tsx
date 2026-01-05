"use client";

import { useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import { AgGridWrapper } from '@/components/ui/ag-grid-wrapper';

interface CompaniesGridProps {
  onRowSelect: (company: any) => void;
}

const sampleCompanies = [
  {
    id: '1',
    name: 'Noon',
    description: 'Dubai-based designer wedding platform',
    location: 'United Arab Emirates',
    founded: '5-10',
    year: 2021,
    status: '●●●',
    revenue: 'N/A',
    people: 0,
    news: 4
  },
  {
    id: '2',
    name: 'Souq.com',
    description: 'Sustainable smart luxury and UAB',
    location: 'United Arab Emirates',
    founded: '11-50',
    year: 2016,
    status: '●●●',
    revenue: 'N/A',
    people: 0,
    news: 3
  },
  {
    id: '3',
    name: 'Namshi',
    description: 'Online marketplace for pre-owned luxury fashion',
    location: 'United Arab Emirates',
    founded: '5-10',
    year: 2016,
    status: '●●●',
    revenue: 'N/A',
    people: 0,
    news: 5
  },
  {
    id: '4',
    name: 'Chipoodle',
    description: 'Technology solutions and IT services provider',
    location: 'United States',
    founded: '5-10',
    year: 2018,
    status: '●●●',
    revenue: '$2-5M',
    people: 1,
    news: 3
  },
  {
    id: '5',
    name: 'Aliwawa',
    description: 'Enterprise IT infrastructure and cloud services',
    location: 'United States',
    founded: '11-50',
    year: 2015,
    status: '●●●',
    revenue: '$10-25M',
    people: 1,
    news: 3
  },
  {
    id: '6',
    name: 'Ublur',
    description: 'Digital transformation and IT operations consulting',
    location: 'United States',
    founded: '5-10',
    year: 2017,
    status: '●●●',
    revenue: '$1-2M',
    people: 1,
    news: 4
  },
  {
    id: '7',
    name: 'Tik Tack',
    description: 'IT support and managed services for SMBs',
    location: 'United States',
    founded: '5-10',
    year: 2019,
    status: '●●●',
    revenue: '$500K-1M',
    people: 1,
    news: 4
  },
  {
    id: '8',
    name: 'Slouch',
    description: 'Customer success and experience management platform',
    location: 'United States',
    founded: '11-50',
    year: 2016,
    status: '●●●',
    revenue: '$5-10M',
    people: 1,
    news: 2
  },
  {
    id: '9',
    name: 'TechFlow Solutions',
    description: 'Enterprise software development and digital transformation',
    location: 'United States',
    founded: '51-200',
    year: 2012,
    status: '●●●',
    revenue: '$50-100M',
    people: 2,
    news: 8
  },
  {
    id: '10',
    name: 'DataDriven Inc',
    description: 'AI and machine learning solutions for enterprises',
    location: 'United States',
    founded: '11-50',
    year: 2014,
    status: '●●●',
    revenue: '$15-25M',
    people: 2,
    news: 12
  },
  {
    id: '11',
    name: 'CloudSync Technologies',
    description: 'Cloud infrastructure and DevOps services',
    location: 'United States',
    founded: '51-200',
    year: 2011,
    status: '●●●',
    revenue: '$75-150M',
    people: 2,
    news: 4
  },
  {
    id: '12',
    name: 'FinTech Innovations',
    description: 'Financial technology and digital banking solutions',
    location: 'United States',
    founded: '11-50',
    year: 2013,
    status: '●●●',
    revenue: '$20-50M',
    people: 2,
    news: 2
  },
  {
    id: '13',
    name: 'GreenEnergy Corp',
    description: 'Renewable energy and sustainable technology solutions',
    location: 'United States',
    founded: '51-200',
    year: 2010,
    status: '●●●',
    revenue: '$100-250M',
    people: 2,
    news: 4
  },
  {
    id: '14',
    name: 'MediCare Solutions',
    description: 'Healthcare technology and digital health platforms',
    location: 'United States',
    founded: '51-200',
    year: 2009,
    status: '●●●',
    revenue: '$150-300M',
    people: 2,
    news: 5
  },
  {
    id: '15',
    name: 'AutoDrive Systems',
    description: 'Autonomous vehicle technology and ADAS systems',
    location: 'United States',
    founded: '201-500',
    year: 2016,
    status: '●●●',
    revenue: '$500M-1B',
    people: 2,
    news: 1
  },
  {
    id: '16',
    name: 'EduTech Platform',
    description: 'Educational technology and learning management systems',
    location: 'United States',
    founded: '11-50',
    year: 2015,
    status: '●●●',
    revenue: '$10-25M',
    people: 2,
    news: 3
  },
  {
    id: '17',
    name: 'FashionForward',
    description: 'Luxury fashion e-commerce and digital retail',
    location: 'Italy',
    founded: '51-200',
    year: 2012,
    status: '●●●',
    revenue: '€50-100M',
    people: 2,
    news: 4
  },
  {
    id: '18',
    name: 'Sustainable Foods Co',
    description: 'Sustainable agriculture and food technology',
    location: 'France',
    founded: '11-50',
    year: 2014,
    status: '●●●',
    revenue: '€20-50M',
    people: 2,
    news: 1
  },
  {
    id: '19',
    name: 'SpaceTech Labs',
    description: 'Space technology and satellite communications',
    location: 'United States',
    founded: '51-200',
    year: 2013,
    status: '●●●',
    revenue: '$100-250M',
    people: 2,
    news: 2
  },
  {
    id: '20',
    name: 'RetailPlus Chain',
    description: 'Omnichannel retail technology and POS systems',
    location: 'Spain',
    founded: '51-200',
    year: 2011,
    status: '●●●',
    revenue: '€75-150M',
    people: 2,
    news: 3
  },
  {
    id: '21',
    name: 'GameDev Studios',
    description: 'Video game development and interactive entertainment',
    location: 'Russia',
    founded: '11-50',
    year: 2016,
    status: '●●●',
    revenue: '$5-15M',
    people: 2,
    news: 2
  },
  {
    id: '22',
    name: 'Doha Logistics',
    description: 'Supply chain and logistics technology solutions',
    location: 'Qatar',
    founded: '51-200',
    year: 2010,
    status: '●●●',
    revenue: '$50-100M',
    people: 2,
    news: 3
  }
];

export function CompaniesGrid({ onRowSelect }: CompaniesGridProps) {
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      field: 'name',
      headerName: 'Company',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 300,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 150,
    },
    {
      field: 'founded',
      headerName: 'Founded',
      width: 100,
    },
    {
      field: 'year',
      headerName: 'Year',
      width: 80,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 80,
      cellRenderer: (params: any) => (
        <span className="text-green-600 font-semibold">
          {params.value}
        </span>
      ),
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      width: 100,
    },
    {
      field: 'people',
      headerName: 'People',
      width: 100,
      cellRenderer: (params: any) => (
        <button
          className="px-2 py-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onRowSelect(params.data);
          }}
        >
          {params.value} people
        </button>
      ),
    },
    {
      field: 'news',
      headerName: 'News',
      width: 100,
      cellRenderer: (params: any) => (
        <button
          className="px-2 py-1 text-xs bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onRowSelect(params.data);
          }}
        >
          {params.value} news
        </button>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      cellRenderer: (params: any) => (
        <button className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors">
          Save
        </button>
      ),
    },
  ], [onRowSelect]);

  return (
    <AgGridWrapper
      rowData={sampleCompanies}
      columnDefs={columnDefs}
      onRowClick={onRowSelect}
    />
  );
}
