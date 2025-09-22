import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Grid, 
  Calculator, 
  Download, 
  Upload, 
  Save, 
  Copy, 
  Paste, 
  Cut,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  WrapText,
  Merge,
  Split,
  BorderAll,
  Palette,
  Type,
  Plus,
  Minus,
  MoreHorizontal
} from 'lucide-react';

// Cell data structure
interface CellData {
  value?: string | number;
  formula?: string;
  style?: CellStyle;
  type?: 'text' | 'number' | 'formula' | 'date' | 'currency';
  validation?: ValidationRule;
}

interface CellStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  border?: BorderStyle;
  padding?: number;
  wrap?: boolean;
}

interface BorderStyle {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

interface ValidationRule {
  type: 'number' | 'text' | 'date' | 'list';
  min?: number;
  max?: number;
  options?: string[];
  required?: boolean;
}

interface Range {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

interface SpreadsheetProps {
  rows?: number;
  cols?: number;
  defaultRowHeight?: number;
  defaultColWidth?: number;
  onCellChange?: (row: number, col: number, value: any) => void;
  onSelectionChange?: (selection: Range) => void;
  data?: { [key: string]: CellData };
  readOnly?: boolean;
  showFormulas?: boolean;
  enableValidation?: boolean;
  theme?: 'light' | 'dark';
}

// Helper functions
const getColumnName = (index: number): string => {
  let result = '';
  while (index >= 0) {
    result = String.fromCharCode(65 + (index % 26)) + result;
    index = Math.floor(index / 26) - 1;
  }
  return result;
};

const getCellId = (row: number, col: number): string => `${getColumnName(col)}${row + 1}`;

const parseFormula = (formula: string, data: { [key: string]: CellData }): number | string => {
  if (!formula.startsWith('=')) return formula;
  
  try {
    // Simple formula parser - replace cell references with values
    let expression = formula.substring(1);
    
    // Replace cell references (A1, B2, etc.) with their values
    expression = expression.replace(/[A-Z]+\d+/g, (cellRef) => {
      const cell = data[cellRef];
      const value = cell?.value || 0;
      return typeof value === 'number' ? value.toString() : `"${value}"`;
    });
    
    // Basic mathematical operations
    const result = Function(`"use strict"; return (${expression})`)();
    return typeof result === 'number' ? Math.round(result * 100) / 100 : result;
  } catch (error) {
    return '#ERROR';
  }
};

const TableMainSpreadsheet: React.FC<SpreadsheetProps> = ({
  rows = 50,
  cols = 26,
  defaultRowHeight = 28,
  defaultColWidth = 100,
  onCellChange,
  onSelectionChange,
  data: initialData = {},
  readOnly = false,
  showFormulas = false,
  enableValidation = true,
  theme = 'light'
}) => {
  const [data, setData] = useState<{ [key: string]: CellData }>(initialData);
  const [selectedRange, setSelectedRange] = useState<Range>({ startRow: 0, startCol: 0, endRow: 0, endCol: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [formulaBarValue, setFormulaBarValue] = useState('');
  const [rowHeights, setRowHeights] = useState<{ [key: number]: number }>({});
  const [colWidths, setColWidths] = useState<{ [key: number]: number }>({});
  const [clipboard, setClipboard] = useState<{ data: { [key: string]: CellData }; range: Range } | null>(null);
  const [history, setHistory] = useState<{ [key: string]: CellData }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Save state to history for undo/redo
  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ ...data });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [data, history, historyIndex]);

  // Handle cell value change
  const handleCellChange = useCallback((row: number, col: number, value: string) => {
    const cellId = getCellId(row, col);
    saveToHistory();
    
    const newData = { ...data };
    if (!newData[cellId]) newData[cellId] = {};
    
    if (value.startsWith('=')) {
      newData[cellId].formula = value;
      newData[cellId].value = parseFormula(value, newData);
    } else {
      newData[cellId].value = value;
      delete newData[cellId].formula;
    }
    
    setData(newData);
    onCellChange?.(row, col, value);
  }, [data, onCellChange, saveToHistory]);

  // Handle cell selection
  const handleCellSelect = useCallback((row: number, col: number, extend: boolean = false) => {
    if (extend && !isSelecting) {
      setSelectedRange(prev => ({
        startRow: prev.startRow,
        startCol: prev.startCol,
        endRow: row,
        endCol: col
      }));
    } else {
      setSelectedRange({ startRow: row, startCol: row, endRow: row, endCol: col });
    }
    
    const cellId = getCellId(row, col);
    const cell = data[cellId];
    setFormulaBarValue(cell?.formula || cell?.value?.toString() || '');
    
    onSelectionChange?.({ startRow: row, startCol: col, endRow: row, endCol: col });
  }, [data, isSelecting, onSelectionChange]);

  // Start editing cell
  const startEditing = useCallback((row: number, col: number) => {
    if (readOnly) return;
    
    setEditingCell({ row, col });
    const cellId = getCellId(row, col);
    const cell = data[cellId];
    const value = showFormulas && cell?.formula ? cell.formula : cell?.value?.toString() || '';
    setEditValue(value);
    
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [data, readOnly, showFormulas]);

  // Finish editing
  const finishEditing = useCallback(() => {
    if (editingCell) {
      handleCellChange(editingCell.row, editingCell.col, editValue);
      setEditingCell(null);
      setEditValue('');
    }
  }, [editingCell, editValue, handleCellChange]);

  // Apply formatting to selected cells
  const applyFormatting = useCallback((styleUpdate: Partial<CellStyle>) => {
    saveToHistory();
    const newData = { ...data };
    
    for (let row = selectedRange.startRow; row <= selectedRange.endRow; row++) {
      for (let col = selectedRange.startCol; col <= selectedRange.endCol; col++) {
        const cellId = getCellId(row, col);
        if (!newData[cellId]) newData[cellId] = {};
        if (!newData[cellId].style) newData[cellId].style = {};
        Object.assign(newData[cellId].style!, styleUpdate);
      }
    }
    
    setData(newData);
  }, [data, selectedRange, saveToHistory]);

  // Copy selected cells
  const copySelection = useCallback(() => {
    const copiedData: { [key: string]: CellData } = {};
    
    for (let row = selectedRange.startRow; row <= selectedRange.endRow; row++) {
      for (let col = selectedRange.startCol; col <= selectedRange.endCol; col++) {
        const cellId = getCellId(row, col);
        if (data[cellId]) {
          copiedData[cellId] = { ...data[cellId] };
        }
      }
    }
    
    setClipboard({ data: copiedData, range: selectedRange });
  }, [data, selectedRange]);

  // Paste copied cells
  const pasteSelection = useCallback(() => {
    if (!clipboard) return;
    
    saveToHistory();
    const newData = { ...data };
    const { data: clipboardData, range: clipboardRange } = clipboard;
    
    const rowOffset = selectedRange.startRow - clipboardRange.startRow;
    const colOffset = selectedRange.startCol - clipboardRange.startCol;
    
    Object.entries(clipboardData).forEach(([cellId, cellData]) => {
      const match = cellId.match(/([A-Z]+)(\d+)/);
      if (match) {
        const col = match[1].charCodeAt(0) - 65; // Simple single letter column
        const row = parseInt(match[2]) - 1;
        
        const newRow = row + rowOffset;
        const newCol = col + colOffset;
        
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          const newCellId = getCellId(newRow, newCol);
          newData[newCellId] = { ...cellData };
        }
      }
    });
    
    setData(newData);
  }, [clipboard, data, selectedRange, rows, cols, saveToHistory]);

  // Undo operation
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setData(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  // Redo operation
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setData(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingCell) {
        if (e.key === 'Enter') {
          finishEditing();
          handleCellSelect(
            Math.min(editingCell.row + 1, rows - 1),
            editingCell.col
          );
        } else if (e.key === 'Escape') {
          setEditingCell(null);
          setEditValue('');
        }
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'c':
            copySelection();
            e.preventDefault();
            break;
          case 'v':
            pasteSelection();
            e.preventDefault();
            break;
          case 'z':
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            e.preventDefault();
            break;
        }
      } else {
        switch (e.key) {
          case 'ArrowUp':
            handleCellSelect(
              Math.max(selectedRange.startRow - 1, 0),
              selectedRange.startCol,
              e.shiftKey
            );
            e.preventDefault();
            break;
          case 'ArrowDown':
            handleCellSelect(
              Math.min(selectedRange.startRow + 1, rows - 1),
              selectedRange.startCol,
              e.shiftKey
            );
            e.preventDefault();
            break;
          case 'ArrowLeft':
            handleCellSelect(
              selectedRange.startRow,
              Math.max(selectedRange.startCol - 1, 0),
              e.shiftKey
            );
            e.preventDefault();
            break;
          case 'ArrowRight':
            handleCellSelect(
              selectedRange.startRow,
              Math.min(selectedRange.startCol + 1, cols - 1),
              e.shiftKey
            );
            e.preventDefault();
            break;
          case 'Enter':
            startEditing(selectedRange.startRow, selectedRange.startCol);
            e.preventDefault();
            break;
          case 'F2':
            startEditing(selectedRange.startRow, selectedRange.startCol);
            e.preventDefault();
            break;
          case 'Delete':
            saveToHistory();
            const newData = { ...data };
            for (let row = selectedRange.startRow; row <= selectedRange.endRow; row++) {
              for (let col = selectedRange.startCol; col <= selectedRange.endCol; col++) {
                const cellId = getCellId(row, col);
                if (newData[cellId]) {
                  delete newData[cellId].value;
                  delete newData[cellId].formula;
                }
              }
            }
            setData(newData);
            e.preventDefault();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    editingCell,
    finishEditing,
    handleCellSelect,
    selectedRange,
    rows,
    cols,
    copySelection,
    pasteSelection,
    undo,
    redo,
    startEditing,
    data,
    saveToHistory
  ]);

  const getCellStyle = (row: number, col: number): React.CSSProperties => {
    const cellId = getCellId(row, col);
    const cell = data[cellId];
    const style = cell?.style || {};
    
    const isSelected = row >= selectedRange.startRow && 
                     row <= selectedRange.endRow && 
                     col >= selectedRange.startCol && 
                     col <= selectedRange.endCol;
    
    return {
      backgroundColor: isSelected ? '#e3f2fd' : style.backgroundColor || 'white',
      color: style.color || '#333',
      fontSize: style.fontSize || 14,
      fontWeight: style.fontWeight || 'normal',
      fontStyle: style.fontStyle || 'normal',
      textDecoration: style.textDecoration || 'none',
      textAlign: style.textAlign || 'left',
      verticalAlign: style.verticalAlign || 'middle',
      padding: style.padding || 4,
      border: '1px solid #e0e0e0',
      borderTop: style.border?.top || '1px solid #e0e0e0',
      borderRight: style.border?.right || '1px solid #e0e0e0',
      borderBottom: style.border?.bottom || '1px solid #e0e0e0',
      borderLeft: style.border?.left || '1px solid #e0e0e0',
      whiteSpace: style.wrap ? 'pre-wrap' : 'nowrap',
      overflow: 'hidden',
      height: rowHeights[row] || defaultRowHeight,
      width: colWidths[col] || defaultColWidth,
      position: 'relative'
    };
  };

  const getCellDisplayValue = (row: number, col: number): string => {
    const cellId = getCellId(row, col);
    const cell = data[cellId];
    
    if (!cell) return '';
    if (showFormulas && cell.formula) return cell.formula;
    return cell.value?.toString() || '';
  };

  return (
    <div className={`table-main-spreadsheet ${theme}`} ref={containerRef}>
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-group">
          <button onClick={undo} disabled={historyIndex <= 0}>
            <Undo size={16} />
          </button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1}>
            <Redo size={16} />
          </button>
        </div>
        
        <div className="toolbar-group">
          <button onClick={copySelection}>
            <Copy size={16} />
          </button>
          <button onClick={pasteSelection} disabled={!clipboard}>
            <Paste size={16} />
          </button>
        </div>
        
        <div className="toolbar-group">
          <button onClick={() => applyFormatting({ fontWeight: 'bold' })}>
            <Bold size={16} />
          </button>
          <button onClick={() => applyFormatting({ fontStyle: 'italic' })}>
            <Italic size={16} />
          </button>
          <button onClick={() => applyFormatting({ textDecoration: 'underline' })}>
            <Underline size={16} />
          </button>
        </div>
        
        <div className="toolbar-group">
          <button onClick={() => applyFormatting({ textAlign: 'left' })}>
            <AlignLeft size={16} />
          </button>
          <button onClick={() => applyFormatting({ textAlign: 'center' })}>
            <AlignCenter size={16} />
          </button>
          <button onClick={() => applyFormatting({ textAlign: 'right' })}>
            <AlignRight size={16} />
          </button>
        </div>
        
        <div className="toolbar-group">
          <button onClick={() => applyFormatting({ wrap: true })}>
            <WrapText size={16} />
          </button>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="formula-bar">
        <div className="cell-reference">
          {getCellId(selectedRange.startRow, selectedRange.startCol)}
        </div>
        <input
          type="text"
          value={formulaBarValue}
          onChange={(e) => setFormulaBarValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCellChange(selectedRange.startRow, selectedRange.startCol, formulaBarValue);
            }
          }}
          placeholder="Enter formula or value..."
        />
      </div>

      {/* Spreadsheet Grid */}
      <div className="spreadsheet-container">
        <table className="spreadsheet-table">
          <thead>
            <tr>
              <th className="row-header"></th>
              {Array.from({ length: cols }, (_, col) => (
                <th key={col} className="col-header">
                  {getColumnName(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, row) => (
              <tr key={row}>
                <td className="row-header">{row + 1}</td>
                {Array.from({ length: cols }, (_, col) => (
                  <td
                    key={`${row}-${col}`}
                    style={getCellStyle(row, col)}
                    onMouseDown={() => {
                      handleCellSelect(row, col);
                      setIsSelecting(true);
                    }}
                    onMouseEnter={() => {
                      if (isSelecting) {
                        handleCellSelect(row, col, true);
                      }
                    }}
                    onMouseUp={() => setIsSelecting(false)}
                    onDoubleClick={() => startEditing(row, col)}
                  >
                    {editingCell?.row === row && editingCell?.col === col ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={finishEditing}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          font: 'inherit'
                        }}
                      />
                    ) : (
                      getCellDisplayValue(row, col)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .table-main-spreadsheet {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: white;
        }

        .toolbar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .toolbar-group {
          display: flex;
          gap: 4px;
          margin-right: 8px;
          padding-right: 8px;
          border-right: 1px solid #e0e0e0;
        }

        .toolbar-group:last-child {
          border-right: none;
        }

        .toolbar button {
          padding: 6px 8px;
          border: 1px solid #d0d7de;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toolbar button:hover {
          background: #f3f4f6;
        }

        .toolbar button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .formula-bar {
          display: flex;
          align-items: center;
          padding: 8px;
          border-bottom: 1px solid #e0e0e0;
          background: white;
        }

        .cell-reference {
          min-width: 60px;
          padding: 4px 8px;
          border: 1px solid #d0d7de;
          border-right: none;
          background: #f8f9fa;
          font-weight: 500;
          text-align: center;
        }

        .formula-bar input {
          flex: 1;
          padding: 4px 8px;
          border: 1px solid #d0d7de;
          outline: none;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        .spreadsheet-container {
          flex: 1;
          overflow: auto;
          border: 1px solid #e0e0e0;
        }

        .spreadsheet-table {
          border-collapse: collapse;
          width: 100%;
        }

        .row-header,
        .col-header {
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          padding: 4px 8px;
          text-align: center;
          font-weight: 500;
          user-select: none;
          min-width: 40px;
          position: sticky;
        }

        .row-header {
          left: 0;
          z-index: 2;
        }

        .col-header {
          top: 0;
          z-index: 2;
        }

        .spreadsheet-table td {
          min-width: 100px;
          max-width: 200px;
          cursor: cell;
          user-select: none;
        }

        .spreadsheet-table td:focus {
          outline: 2px solid #007acc;
          outline-offset: -2px;
        }

        .dark {
          background: #1a1a1a;
          color: white;
        }

        .dark .toolbar {
          background: #2d2d2d;
          border-color: #404040;
        }

        .dark .toolbar button {
          background: #3d3d3d;
          border-color: #555;
          color: white;
        }

        .dark .formula-bar {
          background: #1a1a1a;
          border-color: #404040;
        }

        .dark .cell-reference {
          background: #2d2d2d;
          border-color: #555;
          color: white;
        }

        .dark .formula-bar input {
          background: #3d3d3d;
          border-color: #555;
          color: white;
        }

        .dark .row-header,
        .dark .col-header {
          background: #2d2d2d;
          border-color: #404040;
          color: white;
        }

        .dark .spreadsheet-table td {
          border-color: #404040;
        }
      `}</style>
    </div>
  );
};

export default TableMainSpreadsheet;
