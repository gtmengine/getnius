"use client";

import { useCallback, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { 
  ColDef, 
  GridReadyEvent, 
  RowClickedEvent,
  SelectionChangedEvent,
  GridApi,
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz
} from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Custom theme based on Quartz
const customTheme = themeQuartz.withParams({
  headerHeight: 48,
  headerForegroundColor: 'rgb(107 114 128)',
  headerBackgroundColor: 'rgb(249 250 251)',
  borderColor: 'rgb(229 231 235)',
  rowBorder: { color: 'rgb(243 244 246)' },
  fontSize: 14,
  rowHeight: 48,
  cellHorizontalPadding: 16,
  rowHoverColor: 'rgb(249 250 251)',
  selectedRowBackgroundColor: 'rgb(239 246 255)',
  rangeSelectionBorderColor: 'rgb(99 102 241)',
});

export interface AgGridWrapperProps {
  rowData: any[];
  columnDefs: ColDef[];
  onRowClick?: (data: any) => void;
  onSelectionChanged?: (selectedRows: any[]) => void;
  onCellValueChanged?: (event: any) => void;
  onColumnHeaderDoubleClick?: (columnField: string, currentName: string) => void;
  className?: string;
  height?: string;
  rowSelection?: 'single' | 'multiple';
  checkboxSelection?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  getRowClass?: (params: any) => string;
}

export interface AgGridWrapperRef {
  api: GridApi | null;
  getSelectedRows: () => any[];
  deselectAll: () => void;
  selectAll: () => void;
}

export const AgGridWrapper = forwardRef<AgGridWrapperRef, AgGridWrapperProps>(({
  rowData,
  columnDefs,
  onRowClick,
  onSelectionChanged,
  onCellValueChanged,
  onColumnHeaderDoubleClick,
  className = "",
  height = "60vh",
  rowSelection = "multiple",
  checkboxSelection = true,
  loading = false,
  emptyMessage = "No results to display",
  getRowClass,
}, ref) => {
  const gridRef = useRef<AgGridReact>(null);

  useImperativeHandle(ref, () => ({
    api: gridRef.current?.api || null,
    getSelectedRows: () => gridRef.current?.api?.getSelectedRows() || [],
    deselectAll: () => gridRef.current?.api?.deselectAll(),
    selectAll: () => gridRef.current?.api?.selectAll(),
  }));

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  const onRowClicked = useCallback((event: RowClickedEvent) => {
    if (onRowClick && event.data) {
      onRowClick(event.data);
    }
  }, [onRowClick]);

  const handleSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    if (onSelectionChanged) {
      const selectedRows = event.api.getSelectedRows();
      onSelectionChanged(selectedRows);
    }
  }, [onSelectionChanged]);

  const handleCellValueChanged = useCallback((event: any) => {
    if (onCellValueChanged) {
      onCellValueChanged(event);
    }
  }, [onCellValueChanged]);

  const handleColumnHeaderClicked = useCallback((event: any) => {
    if (onColumnHeaderDoubleClick && event.column) {
      // For now, make all header clicks trigger the edit dialog
      // In a real app, you might want to distinguish between single and double clicks
      const columnField = event.column.getColId();
      const currentName = event.column.getColDef().headerName || event.column.getColDef().field || '';

      // For now, allow editing all columns for testing
      onColumnHeaderDoubleClick(columnField, currentName);
    }
  }, [onColumnHeaderDoubleClick]);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  }), []);

  // Row selection configuration for AG Grid v34+
  const rowSelectionConfig = useMemo(() => {
    if (rowSelection === 'multiple') {
      return {
        mode: 'multiRow' as const,
        checkboxes: checkboxSelection,
        headerCheckbox: checkboxSelection,
        enableClickSelection: true,
        enableSelectionWithoutKeys: true,
      };
    }
    return {
      mode: 'singleRow' as const,
      checkboxes: checkboxSelection,
      enableClickSelection: true,
    };
  }, [rowSelection, checkboxSelection]);

  const loadingOverlayComponent = useMemo(() => {
    return () => (
      <div className="flex flex-col items-center justify-center gap-3 p-8">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-sm text-gray-600 font-medium">Searching...</span>
      </div>
    );
  }, []);

  const noRowsOverlayComponent = useMemo(() => {
    return () => (
      <div className="flex flex-col items-center justify-center gap-2 p-8">
        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-sm text-gray-500">{emptyMessage}</span>
      </div>
    );
  }, [emptyMessage]);

  return (
    <div className={`ag-theme-quartz ${className}`} style={{ height, width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        theme={customTheme}
        rowData={rowData}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        onRowClicked={onRowClicked}
        onSelectionChanged={handleSelectionChanged}
        onCellValueChanged={handleCellValueChanged}
        onColumnHeaderClicked={handleColumnHeaderClicked}
        animateRows={true}
        rowSelection={rowSelectionConfig}
        defaultColDef={defaultColDef}
        loadingOverlayComponent={loadingOverlayComponent}
        noRowsOverlayComponent={noRowsOverlayComponent}
        loading={loading}
        suppressCellFocus={false}
        enableCellTextSelection={true}
        ensureDomOrder={true}
        getRowClass={getRowClass}
      />
    </div>
  );
});

AgGridWrapper.displayName = 'AgGridWrapper';
