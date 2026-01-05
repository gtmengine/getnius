"use client";

import { useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, RowClickedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

interface AgGridWrapperProps {
  rowData: any[];
  columnDefs: ColDef[];
  onRowClick?: (data: any) => void;
  className?: string;
  height?: string;
}

export function AgGridWrapper({
  rowData,
  columnDefs,
  onRowClick,
  className = "ag-theme-quartz",
  height = "70vh"
}: AgGridWrapperProps) {
  const gridRef = useRef<AgGridReact>(null);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  const onRowClicked = useCallback((event: RowClickedEvent) => {
    if (onRowClick && event.data) {
      onRowClick(event.data);
    }
  }, [onRowClick]);

  return (
    <div className={className} style={{ height, width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        onRowClicked={onRowClicked}
        animateRows={true}
        rowSelection="single"
        suppressRowClickSelection={true}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          flex: 1,
          minWidth: 100,
        }}
        pagination={true}
        paginationPageSize={20}
        paginationPageSizeSelector={[10, 20, 50, 100]}
      />
    </div>
  );
}
