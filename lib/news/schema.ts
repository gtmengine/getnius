import { ColDef } from 'ag-grid-community';
import { NewsCsvHeader } from './types';

export const NEWS_CSV_HEADERS: NewsCsvHeader[] = [
  'Title',
  'URL',
  'Source',
  'Date',
  'Company',
  'Summary',
  'Relevance',
  'Impact',
  'Urgency',
  'Significance',
];

const isTitleHeader = (key: string) => key === 'title';
const isUrlHeader = (key: string) => key === 'url' || key.includes('link');
const isDateHeader = (key: string) => key.includes('date');
const isScoreHeader = (key: string) =>
  key.includes('relevance') ||
  key.includes('impact') ||
  key.includes('urgency') ||
  key.includes('significance');

const renderUrlCell = (value?: string) => {
  if (!value) return '';
  if (typeof document === 'undefined') return value;

  const link = document.createElement('a');
  link.href = value;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.className = 'text-blue-600 underline';
  link.textContent = value;
  return link;
};

export const buildNewsColumnDefs = (headers: NewsCsvHeader[]): ColDef[] => {
  return headers.map((header) => {
    const key = header.trim().toLowerCase();
    const base: ColDef = {
      field: header,
      headerName: header,
    };

    if (isTitleHeader(key)) {
      return {
        ...base,
        pinned: 'left',
        minWidth: 260,
        wrapText: true,
        autoHeight: true,
        tooltipField: header,
      };
    }

    if (isUrlHeader(key)) {
      return {
        ...base,
        cellRenderer: (params) => renderUrlCell(params.value),
      };
    }

    if (isDateHeader(key)) {
      return {
        ...base,
        sortable: true,
      };
    }

    if (isScoreHeader(key)) {
      return {
        ...base,
        sortable: true,
        cellClass: 'ag-right-aligned-cell',
      };
    }

    return base;
  });
};
