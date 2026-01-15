import React, { useState, useEffect, useRef } from 'react';
import { ColDef } from 'ag-grid-community';

export type TabId = 'companies' | 'people' | 'news' | 'signals' | 'market' | 'patents' | 'research-papers';

// Editable Header Component for AG Grid
const EditableHeaderComponent = (props: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(props.displayName || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(props.displayName || '');
  }, [props.displayName]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (props.isEditable) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim() && value !== (props.displayName || '')) {
      props.onChange?.(value.trim());
    } else {
      setValue(props.displayName || '');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setValue(props.displayName || '');
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-1 text-sm font-medium bg-white border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        style={{ minWidth: '120px' }}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`font-medium text-sm ${props.isEditable ? 'cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors' : ''}`}
      title={props.isEditable ? 'Click to edit column name' : props.displayName}
    >
      {props.displayName || ''}
    </div>
  );
};

// Status badge renderer
const StatusRenderer = (params: any) => {
  const status = params.value || 'N/A';
  const colorMap: Record<string, string> = {
    'Active': 'bg-green-100 text-green-700 border-green-200',
    'Inactive': 'bg-gray-100 text-gray-600 border-gray-200',
    'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Granted': 'bg-green-100 text-green-700 border-green-200',
    'Filed': 'bg-blue-100 text-blue-700 border-blue-200',
    'Published': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'High': 'bg-red-100 text-red-700 border-red-200',
    'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Low': 'bg-green-100 text-green-700 border-green-200',
  };
  const colorClass = colorMap[status] || 'bg-gray-100 text-gray-600 border-gray-200';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {status}
    </span>
  );
};

// Action buttons renderer
const ActionsRenderer = (params: any) => (
  <div className="flex items-center gap-2">
    <button 
      className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors font-medium"
      onClick={(e) => e.stopPropagation()}
    >
      Save
    </button>
  </div>
);

// People/News count buttons
const CountButtonRenderer = (color: 'blue' | 'green' | 'purple') => (params: any) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
  };
  
  return (
    <button 
      className={`px-2 py-1 text-xs border rounded-md transition-colors font-medium ${colorMap[color]}`}
      onClick={(e) => e.stopPropagation()}
    >
      {params.value || 0}
    </button>
  );
};

// Company logo + name renderer
const CompanyRenderer = (params: any) => {
  const { name, description, logo } = params.data || {};
  return (
    <div className="flex items-center gap-3 py-1">
      <img 
        src={logo || "/placeholder.svg"} 
        alt={name || ''} 
        className="w-8 h-8 rounded-md object-cover bg-gray-100" 
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder.svg';
        }}
      />
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">{name || 'N/A'}</div>
        <div className="text-xs text-gray-500 truncate max-w-[250px]">{description || ''}</div>
      </div>
    </div>
  );
};

// Signal type badge
const SignalTypeRenderer = (params: any) => {
  const type = params.value || 'Unknown';
  const typeColors: Record<string, string> = {
    'Funding': 'bg-green-100 text-green-700',
    'Acquisition': 'bg-purple-100 text-purple-700',
    'Leadership': 'bg-blue-100 text-blue-700',
    'Product': 'bg-orange-100 text-orange-700',
    'Partnership': 'bg-indigo-100 text-indigo-700',
    'Expansion': 'bg-teal-100 text-teal-700',
    'Layoff': 'bg-red-100 text-red-700',
    'Job Changes': 'bg-amber-100 text-amber-700',
    'Job Change': 'bg-amber-100 text-amber-700',
    'New Hire': 'bg-cyan-100 text-cyan-700',
    'Funding Round': 'bg-emerald-100 text-emerald-700',
    'Social Post': 'bg-pink-100 text-pink-700',
    'News Mention': 'bg-violet-100 text-violet-700',
    'Company Event': 'bg-slate-100 text-slate-700',
  };
  const colorClass = typeColors[type] || 'bg-gray-100 text-gray-600';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
      {type}
    </span>
  );
};

// Link renderer for URLs
const LinkRenderer = (params: any) => {
  const url = params.value;
  if (!url) return <span className="text-gray-400">N/A</span>;
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-indigo-600 hover:text-indigo-800 hover:underline text-sm truncate block"
      onClick={(e) => e.stopPropagation()}
    >
      {url.replace(/^https?:\/\//, '').substring(0, 30)}...
    </a>
  );
};

// Match status renderer
const MatchStatusRenderer = (params: any) => {
  const status = params.value;
  if (!status) return null;

  const statusConfig = {
    'match': {
      label: 'Match',
      className: 'bg-green-100 text-green-700 border-green-200'
    },
    'not-match': {
      label: 'Not Match',
      className: 'bg-red-100 text-red-700 border-red-200'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
};

// Column definitions for Companies tab
export const companiesColumnDefs: ColDef[] = [
  {
    field: 'name',
    headerName: 'Company',
    flex: 2,
    minWidth: 280,
    cellRenderer: CompanyRenderer,
    editable: true,
    pinned: 'left',
  },
  {
    field: 'location',
    headerName: 'Location',
    width: 150,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'founded',
    headerName: 'Founded',
    width: 100,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'employees',
    headerName: 'Employees',
    width: 110,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    cellRenderer: StatusRenderer,
  },
  {
    field: 'matchStatus',
    headerName: 'Match',
    width: 100,
    cellRenderer: MatchStatusRenderer,
  },
  {
    field: 'revenue',
    headerName: 'Revenue',
    width: 120,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'people',
    headerName: 'People',
    width: 80,
    cellRenderer: CountButtonRenderer('blue'),
  },
  {
    field: 'news',
    headerName: 'News',
    width: 80,
    cellRenderer: CountButtonRenderer('green'),
  },
  {
    field: 'actions',
    headerName: '',
    width: 80,
    cellRenderer: ActionsRenderer,
    sortable: false,
    filter: false,
    pinned: 'right',
  },
];

// Column definitions for People tab
export const peopleColumnDefs: ColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    minWidth: 180,
    editable: true,
    pinned: 'left',
  },
  {
    field: 'company',
    headerName: 'Company',
    flex: 1,
    minWidth: 180,
    editable: true,
  },
  {
    field: 'role',
    headerName: 'Role',
    flex: 1,
    minWidth: 180,
    editable: true,
  },
  {
    field: 'location',
    headerName: 'Location',
    width: 150,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    minWidth: 220,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'matchStatus',
    headerName: 'Match',
    width: 100,
    cellRenderer: MatchStatusRenderer,
  },
  {
    field: 'intents',
    headerName: 'Intents',
    width: 90,
    cellRenderer: CountButtonRenderer('purple'),
  },
  {
    field: 'actions',
    headerName: '',
    width: 80,
    cellRenderer: ActionsRenderer,
    sortable: false,
    filter: false,
    pinned: 'right',
  },
];

// Column definitions for News tab
export const newsColumnDefs: ColDef[] = [
  {
    field: 'selection',
    headerName: 'Select',
    width: 80,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: 'left',
    suppressMenu: true,
    suppressSorting: true,
    suppressFilter: true,
    cellStyle: { textAlign: 'center' },
  },
  {
    field: 'title',
    headerName: 'Title',
    flex: 2,
    minWidth: 300,
    editable: true,
    pinned: false,
  },
  {
    field: 'source',
    headerName: 'Source',
    width: 140,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'company',
    headerName: 'Company',
    width: 160,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'matchStatus',
    headerName: 'Match',
    width: 100,
    cellRenderer: MatchStatusRenderer,
  },
  {
    field: 'summary',
    headerName: 'Summary',
    flex: 2,
    minWidth: 300,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'significance_score',
    headerName: 'Significance',
    width: 120,
    hide: true,
    valueFormatter: (params) => params.value?.toFixed(1) || '0.0',
  },
  {
    field: 'relevance_score',
    headerName: 'Relevance',
    width: 120,
    hide: true,
    valueFormatter: (params) => params.value?.toFixed(1) || '0.0',
  },
  {
    field: 'actions',
    headerName: '',
    width: 80,
    cellRenderer: ActionsRenderer,
    sortable: false,
    filter: false,
    pinned: 'right',
  },
];

// Column definitions for Signals tab
export const signalsColumnDefs: ColDef[] = [
  {
    field: 'signalType',
    headerName: 'Signal Type',
    width: 140,
    cellRenderer: SignalTypeRenderer,
    pinned: 'left',
  },
  {
    field: 'person',
    headerName: 'Person',
    width: 140,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'company',
    headerName: 'Company',
    flex: 1,
    minWidth: 180,
    editable: true,
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'confidence',
    headerName: 'Confidence',
    width: 120,
    cellRenderer: StatusRenderer,
  },
  {
    field: 'source',
    headerName: 'Source',
    flex: 1,
    minWidth: 200,
    cellRenderer: LinkRenderer,
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 2,
    minWidth: 250,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'actions',
    headerName: '',
    width: 80,
    cellRenderer: ActionsRenderer,
    sortable: false,
    filter: false,
    pinned: 'right',
  },
];

// Column definitions for Market Reports tab
export const marketColumnDefs: ColDef[] = [
  {
    field: 'title',
    headerName: 'Report Title',
    flex: 2,
    minWidth: 300,
    editable: true,
    pinned: 'left',
  },
  {
    field: 'publisher',
    headerName: 'Publisher',
    width: 160,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'region',
    headerName: 'Region',
    width: 140,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 160,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'pages',
    headerName: 'Pages',
    width: 80,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'actions',
    headerName: '',
    width: 80,
    cellRenderer: ActionsRenderer,
    sortable: false,
    filter: false,
    pinned: 'right',
  },
];

// Column definitions for Patents tab
export const patentsColumnDefs: ColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    flex: 2,
    minWidth: 320,
    editable: true,
    pinned: 'left',
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 120,
    cellRenderer: (params: any) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
        {params.value || 'Patent'}
      </span>
    ),
  },
  {
    field: 'inventor',
    headerName: 'Inventor/Author',
    flex: 1,
    minWidth: 160,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'company',
    headerName: 'Company',
    flex: 1,
    minWidth: 180,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'dateFiled',
    headerName: 'Date Filed',
    width: 120,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 110,
    cellRenderer: StatusRenderer,
  },
  {
    field: 'actions',
    headerName: '',
    width: 80,
    cellRenderer: ActionsRenderer,
    sortable: false,
    filter: false,
    pinned: 'right',
  },
];

// Column definitions for Research Papers tab
export const researchPapersColumnDefs: ColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    flex: 2,
    minWidth: 320,
    editable: true,
    pinned: 'left',
  },
  {
    field: 'authors',
    headerName: 'Authors',
    flex: 1,
    minWidth: 180,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'journal',
    headerName: 'Journal/Conference',
    flex: 1,
    minWidth: 180,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'publicationDate',
    headerName: 'Publication Date',
    width: 140,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'citations',
    headerName: 'Citations',
    width: 100,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'field',
    headerName: 'Field',
    width: 120,
    editable: true,
    valueFormatter: (params) => params.value || 'N/A',
  },
  {
    field: 'actions',
    headerName: '',
    width: 80,
    cellRenderer: ActionsRenderer,
    sortable: false,
    filter: false,
    pinned: 'right',
  },
];

// Map of all column definitions by tab
export { EditableHeaderComponent };

export const columnDefsMap: Record<TabId, ColDef[]> = {
  companies: companiesColumnDefs,
  people: peopleColumnDefs,
  news: newsColumnDefs,
  signals: signalsColumnDefs,
  market: marketColumnDefs,
  patents: patentsColumnDefs,
  'research-papers': researchPapersColumnDefs,
};

// Tab configuration
export interface TabConfig {
  id: TabId;
  label: string;
  icon: string;
}

export const tabConfigs: TabConfig[] = [
  { id: 'companies', label: 'Companies', icon: 'building' },
  { id: 'people', label: 'People', icon: 'users' },
  { id: 'news', label: 'News', icon: 'newspaper' },
  { id: 'signals', label: 'Signals', icon: 'trending-up' },
  { id: 'market', label: 'Market Reports', icon: 'file-text' },
  { id: 'patents', label: 'Patents', icon: 'file-text' },
  { id: 'research-papers', label: 'Research Papers', icon: 'book-open' },
];

