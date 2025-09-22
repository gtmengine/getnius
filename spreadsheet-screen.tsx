import React, { useState, useRef, useEffect, useCallback, useReducer } from "react";
import {
    Plus,
    MoreHorizontal,
    Undo,
    Redo,
    Share,
    MessageSquare,
    ChevronDown,
    Grid3x3,
    Type,
    Palette,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    ArrowLeft,
    X,
    Upload,
    FileText,
    Search,
    WrapText
} from "lucide-react";
import { searchCompanies, type Company } from "./lib/search-apis";
import { loadWolfTable, type WolfTableConfig, type WolfTableStyle, type WolfTableCell } from "./lib/wolf-table-local";

// Wolf-table inspired sparse data model
type CellKey = `${number}:${number}`;
type CellVal = { 
    value?: string | number; 
    formula?: string; 
    styleId?: number;
    type?: 'text' | 'number' | 'formula' | 'date';
};

type CellStyle = {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline' | 'line-through';
    color?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    border?: string;
    padding?: number;
};

type TableState = {
    cells: Map<CellKey, CellVal>;
    styles: CellStyle[];
    rows: number;
    cols: number;
    selection: {
        anchor: { row: number; col: number };
        extent: { row: number; col: number };
    };
    editingCell: CellKey | null;
    editValue: string;
};

type TableAction = 
    | { type: 'setCell'; row: number; col: number; value: CellVal }
    | { type: 'setCells'; cells: Array<{ row: number; col: number; value: CellVal }> }
    | { type: 'addRows'; count: number }
    | { type: 'addCols'; count: number }
    | { type: 'insertCol'; position: number }
    | { type: 'setSelection'; anchor: { row: number; col: number }; extent?: { row: number; col: number } }
    | { type: 'setEditing'; cellKey: CellKey | null; value?: string }
    | { type: 'loadCSV'; data: string[][] }
    | { type: 'undo' }
    | { type: 'redo' };

type StateWithHistory = {
    past: TableState[];
    present: TableState;
    future: TableState[];
};

// Helper functions
const key = (row: number, col: number): CellKey => `${row}:${col}`;
const parseKey = (cellKey: CellKey): [number, number] => {
    const [row, col] = cellKey.split(':').map(Number);
    return [row, col];
};

const getColumnName = (index: number): string => {
    let result = '';
    let num = index;
    do {
        result = String.fromCharCode(65 + (num % 26)) + result;
        num = Math.floor(num / 26) - 1;
    } while (num >= 0);
    return result;
};

const getCellAddress = (row: number, col: number): string => {
    return `${getColumnName(col)}${row + 1}`;
};

// Reducer for table state with undo/redo
const tableReducer = (state: TableState, action: TableAction): TableState => {
    switch (action.type) {
        case 'setCell': {
            const cellKey = key(action.row, action.col);
            const newCells = new Map(state.cells);
            if (action.value.value === '' && !action.value.formula) {
                newCells.delete(cellKey);
            } else {
                newCells.set(cellKey, action.value);
            }
            return { ...state, cells: newCells };
        }
        
        case 'setCells': {
            const newCells = new Map(state.cells);
            action.cells.forEach(({ row, col, value }) => {
                const cellKey = key(row, col);
                if (value.value === '' && !value.formula) {
                    newCells.delete(cellKey);
                } else {
                    newCells.set(cellKey, value);
                }
            });
            return { ...state, cells: newCells };
        }
        
        case 'addRows':
            return { ...state, rows: state.rows + action.count };
            
        case 'addCols':
            return { ...state, cols: state.cols + action.count };
            
        case 'insertCol': {
            const newCells = new Map<CellKey, CellVal>();
            // Shift all cells after the insertion point
            for (const [cellKey, cellVal] of state.cells) {
                const [row, col] = parseKey(cellKey);
                if (col >= action.position) {
                    newCells.set(key(row, col + 1), cellVal);
                } else {
                    newCells.set(cellKey, cellVal);
                }
            }
            return { 
                ...state, 
                cells: newCells, 
                cols: state.cols + 1 
            };
        }
        
        case 'setSelection':
            return {
                ...state,
                selection: {
                    anchor: action.anchor,
                    extent: action.extent || action.anchor
                }
            };
            
        case 'setEditing':
            return {
                ...state,
                editingCell: action.cellKey,
                editValue: action.value || ''
            };
            
        case 'loadCSV': {
            const newCells = new Map<CellKey, CellVal>();
            const maxCols = Math.max(...action.data.map(row => row.length));
            const newRows = action.data.length;
            
            action.data.forEach((row, rowIndex) => {
                row.forEach((value, colIndex) => {
                    if (value.trim()) {
                        newCells.set(key(rowIndex, colIndex), { value });
                    }
                });
            });
            
            return {
                ...state,
                cells: newCells,
                rows: Math.max(state.rows, newRows),
                cols: Math.max(state.cols, maxCols)
            };
        }
        
        default:
            return state;
    }
};

// Undo/Redo wrapper reducer
const undoRedoReducer = (state: StateWithHistory, action: TableAction): StateWithHistory => {
    switch (action.type) {
        case 'undo':
            if (state.past.length === 0) return state;
            const previous = state.past[state.past.length - 1];
            const newPast = state.past.slice(0, state.past.length - 1);
            return {
                past: newPast,
                present: previous,
                future: [state.present, ...state.future]
            };
            
        case 'redo':
            if (state.future.length === 0) return state;
            const next = state.future[0];
            const newFuture = state.future.slice(1);
            return {
                past: [...state.past, state.present],
                present: next,
                future: newFuture
            };
            
        default:
            const newPresent = tableReducer(state.present, action);
            if (newPresent === state.present) return state;
            
            return {
                past: [...state.past, state.present].slice(-50), // Keep last 50 states
                present: newPresent,
                future: [] // Clear future on new action
            };
    }
};

interface SpreadsheetScreenProps {
    setCurrentScreen: (screen: string) => void;
    initialData?: any[];
}

const SpreadsheetScreen: React.FC<SpreadsheetScreenProps> = ({ 
    setCurrentScreen, 
    initialData = [] 
}) => {
    console.log('🔥 SpreadsheetScreen component rendering...', { setCurrentScreen: !!setCurrentScreen, initialData: initialData?.length });
    
    // Initialize state with sparse data model
    const initialState: StateWithHistory = {
        past: [],
        present: {
            cells: new Map(),
            styles: [],
            rows: 20,
            cols: 12,
            selection: {
                anchor: { row: 0, col: 0 },
                extent: { row: 0, col: 0 }
            },
            editingCell: null,
            editValue: ''
        },
        future: []
    };

    const [state, dispatch] = useReducer(undoRedoReducer, initialState);
    const { cells, rows, cols, selection, editingCell, editValue } = state.present;
    
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Wolf Table integration
    const wolfTableContainerRef = useRef<HTMLDivElement>(null);
    const wolfTableInstanceRef = useRef<any>(null);
    const [isWolfTableLoaded, setIsWolfTableLoaded] = useState(false);
    const [useWolfTable, setUseWolfTable] = useState(true); // Toggle between implementations
    
    // Derived state for easier access
    const selectedCell = getCellAddress(selection.anchor.row, selection.anchor.col);
    const canUndo = state.past.length > 0;
    const canRedo = state.future.length > 0;

    // New state for column suggestions and menus
    const [columnSuggestions, setColumnSuggestions] = useState<any[]>([]);
    
    // CSV file upload state
    const [csvData, setCsvData] = useState<any[]>([]);
    const [isProcessingCSV, setIsProcessingCSV] = useState(false);
    const [csvError, setCsvError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    // Query processing state
    const [isProcessingQuery, setIsProcessingQuery] = useState(false);
    const [queryResults, setQueryResults] = useState<any[]>([]);
    const [queryHistory, setQueryHistory] = useState<string[]>([]);

    // Initialize Wolf Table
    useEffect(() => {
        let mounted = true;
        
        const initializeWolfTable = async () => {
            if (!useWolfTable || !wolfTableContainerRef.current) return;
            
            try {
                console.log('🐺 Initializing Wolf Table...');
                const WolfTable = await loadWolfTable();
                
                if (!mounted || !wolfTableContainerRef.current) return;
                
                // Create Wolf Table instance with enhanced configuration
                const wolfTableConfig = {
                    container: wolfTableContainerRef.current,
                    rows: Math.max(rows, 50),
                    cols: Math.max(cols, 26),
                    width: () => wolfTableContainerRef.current?.clientWidth || 800,
                    height: () => wolfTableContainerRef.current?.clientHeight || 600,
                    scrollable: true,
                    resizable: true,
                    selectable: true,
                    editable: true,
                    copyable: true,
                    style: {
                        bgcolor: '#ffffff',
                        align: 'left',
                        valign: 'middle',
                        textwrap: false,
                        strike: false,
                        underline: false,
                        color: '#000000',
                        font: {
                            name: 'Arial',
                            size: 11,
                            bold: false,
                            italic: false
                        }
                    }
                };
                
                console.log('🐺 Creating Wolf Table with config:', wolfTableConfig);
                const tableInstance = new WolfTable(wolfTableConfig);
                
                // Set up event listeners
                tableInstance.on('cell-selected', (row: number, col: number) => {
                    dispatch({ 
                        type: 'setSelection', 
                        anchor: { row, col }, 
                        extent: { row, col } 
                    });
                });
                
                tableInstance.on('cell-edited', (row: number, col: number, value: string) => {
                    dispatch({ 
                        type: 'setCell', 
                        row, 
                        col, 
                        value: { value } 
                    });
                });
                
                // Populate with existing data
                cells.forEach((cellVal, cellKey) => {
                    const [row, col] = parseKey(cellKey);
                    tableInstance.cell(row, col, cellVal.value);
                });
                
                wolfTableInstanceRef.current = tableInstance;
                setIsWolfTableLoaded(true);
                console.log('✅ Wolf Table initialized successfully');
                
            } catch (error) {
                console.error('❌ Failed to initialize Wolf Table:', error);
                setUseWolfTable(false); // Fallback to DOM implementation
            }
        };
        
        if (useWolfTable) {
            initializeWolfTable();
        }
        
        return () => {
            mounted = false;
            if (wolfTableInstanceRef.current) {
                wolfTableInstanceRef.current.destroy?.();
                wolfTableInstanceRef.current = null;
            }
        };
    }, [useWolfTable, rows, cols]);

    // Initialize with sparse data if provided
    useEffect(() => {
        if (initialData && initialData.length > 0) {
            const cellsToSet = initialData.flatMap((row: any[], rowIndex: number) => 
                row.map((value: any, colIndex: number) => ({
                    row: rowIndex,
                    col: colIndex,
                    value: { value: value?.toString() || '' }
                })).filter((cell: any) => cell.value.value.trim() !== '')
            );
            
            if (cellsToSet.length > 0) {
                dispatch({ type: 'setCells', cells: cellsToSet });
                
                // Update Wolf Table if loaded
                if (isWolfTableLoaded && wolfTableInstanceRef.current) {
                    cellsToSet.forEach(({ row, col, value }) => {
                        wolfTableInstanceRef.current.cell(row, col, value.value);
                    });
                }
            }
        }
    }, [initialData, isWolfTableLoaded]);

    // Get cell value from sparse map
    const getCellValue = useCallback((row: number, col: number): string => {
        const cellKey = key(row, col);
        const cell = cells.get(cellKey);
        return cell?.value?.toString() || '';
    }, [cells]);

    // Handle cell click with new selection model
    const handleCellClick = useCallback((row: number, col: number) => {
        dispatch({ 
            type: 'setSelection', 
            anchor: { row, col }, 
            extent: { row, col } 
        });
        dispatch({ type: 'setEditing', cellKey: null });
    }, []);

    // Handle cell double click to edit
    const handleCellDoubleClick = useCallback((row: number, col: number) => {
        const cellKey = key(row, col);
        const cellValue = getCellValue(row, col);
        dispatch({ 
            type: 'setEditing', 
            cellKey, 
            value: cellValue 
        });
        setTimeout(() => inputRef.current?.focus(), 0);
    }, [getCellValue]);

    // Handle cell value change with sparse updates
    const handleCellValueChange = useCallback((row: number, col: number, newValue: string) => {
        dispatch({ 
            type: 'setCell', 
            row, 
            col, 
            value: { value: newValue } 
        });
    }, []);

    // Handle edit confirm
    const handleEditConfirm = useCallback(() => {
        if (editingCell) {
            const [row, col] = parseKey(editingCell);
            handleCellValueChange(row, col, editValue);
            dispatch({ type: 'setEditing', cellKey: null });
        }
    }, [editingCell, editValue, handleCellValueChange]);

    // Handle key press in cell
    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            // Check if this is a query (starts with natural language or specific patterns)
            if (editValue && !editValue.startsWith('=') && editValue.length > 3) {
                handleQuerySubmit(editValue);
            } else {
            handleEditConfirm();
            }
        } else if (e.key === 'Escape') {
            dispatch({ type: 'setEditing', cellKey: null });
        }
    }, [handleEditConfirm, editValue]);

    // Handle query submission
    const handleQuerySubmit = useCallback(async (query: string) => {
        if (!query.trim()) return;

        setIsProcessingQuery(true);
        setQueryHistory(prev => [query, ...prev.slice(0, 9)]); // Keep last 10 queries

        try {
            // Determine query type
            if (query.startsWith('=')) {
                // Formula calculation
                handleFormulaCalculation(query);
            } else if (query.toLowerCase().includes('find') || query.toLowerCase().includes('search')) {
                // Search query - integrate with existing search APIs
                await handleSearchQuery(query);
            } else {
                // Direct value or company name
                await handleDirectQuery(query);
            }
        } catch (error) {
            console.error('Query processing error:', error);
            // Show error in a cell or notification
        } finally {
            setIsProcessingQuery(false);
        }
    }, []);

    // Wolf Table specific functions
    const populateWolfTableWithResults = useCallback((results: any[]) => {
        if (!wolfTableInstanceRef.current || !results.length) return;
        
        console.log('🐺 Populating Wolf Table with results:', results.length);
        
        // Set headers with styling
        const headers = ['Company', 'Description', 'Webpage', 'Industry'];
        headers.forEach((header, colIndex) => {
            wolfTableInstanceRef.current.cell(0, colIndex, header);
            // Add header styling
            wolfTableInstanceRef.current.addStyle(0, colIndex, {
                bold: true,
                backgroundColor: '#f3f4f6',
                align: 'center'
            });
        });
        
        // Populate data
        results.forEach((result, index) => {
            const row = index + 1;
            const data = [
                result.company || 'Unknown Company',
                result.description || 'No description available',
                result.webpage || 'No website',
                result.industry || 'Unknown Industry'
            ];
            
            data.forEach((value, colIndex) => {
                wolfTableInstanceRef.current.cell(row, colIndex, value.toString());
            });
        });
        
        // Auto-resize columns
        headers.forEach((_, colIndex) => {
            wolfTableInstanceRef.current.col(colIndex).width = 'auto';
        });
        
        wolfTableInstanceRef.current.render();
    }, []);

    // Enhanced populate function that works with both implementations
    const populateSpreadsheetWithExaResults = useCallback((results: any[]) => {
        console.log('🎯 PopulateSpreadsheetWithExaResults called with:', results);
        
        if (!results.length) {
            console.log('❌ No results to populate');
            return;
        }

        // Use Wolf Table if available, otherwise fall back to DOM
        if (useWolfTable && isWolfTableLoaded && wolfTableInstanceRef.current) {
            populateWolfTableWithResults(results);
        } else {
            // Original DOM implementation
            const cellsToSet: Array<{ row: number; col: number; value: CellVal }> = [];
            
            const headers = ['Company', 'Description', 'Webpage', 'Industry'];
            console.log('📝 Setting headers:', headers);
            
            headers.forEach((header, colIndex) => {
                cellsToSet.push({
                    row: 0,
                    col: colIndex,
                    value: { value: header }
                });
            });

            results.forEach((result, index) => {
                const row = index + 1;
                const data = [
                    result.company || 'Unknown Company',
                    result.description || 'No description available',
                    result.webpage || 'No website',
                    result.industry || 'Unknown Industry'
                ];

                data.forEach((value, colIndex) => {
                    cellsToSet.push({
                        row,
                        col: colIndex,
                        value: { value: value.toString() }
                    });
                });
            });

            dispatch({ type: 'setCells', cells: cellsToSet });

            const neededRows = results.length + 2;
            if (neededRows > rows) {
                dispatch({ type: 'addRows', count: neededRows - rows });
            }
        }

        setQueryResults(results);
        console.log('✅ Population complete, results stored');
    }, [rows, useWolfTable, isWolfTableLoaded, populateWolfTableWithResults]);

    // Handle formula calculations with new data model
    const handleFormulaCalculation = useCallback((formula: string) => {
        try {
            // Simple formula parsing - extend as needed
            if (formula.includes('SUM')) {
                const match = formula.match(/SUM\(([A-Z]+\d+):([A-Z]+\d+)\)/);
                if (match) {
                    // Calculate sum of range
                    const result = calculateSumRange(match[1], match[2]);
                    const { row, col } = selection.anchor;
                    handleCellValueChange(row, col, result.toString());
                }
            }
        } catch (error) {
            console.error('Formula calculation error:', error);
        }
    }, [selection.anchor, handleCellValueChange]);

    // Handle search queries - using Exa.ai API specifically
    const handleSearchQuery = useCallback(async (query: string) => {
        console.log('🔍 Starting search query:', query);
        try {
            // Use Exa.ai API directly for better results
            const response = await fetch('/api/search/exa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, numResults: 10 })
            });
            
            console.log('📡 API response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📊 API response data:', data);
                
                if (data.companies && data.companies.length > 0) {
                    // Format results for spreadsheet with specific columns
                    const formattedResults = data.companies.map((company: Company) => ({
                        company: company.name,
                        description: company.description,
                        webpage: company.website,
                        industry: company.industry || 'Unknown'
                    }));
                    
                    console.log('📋 Formatted results for spreadsheet:', formattedResults);
                    populateSpreadsheetWithExaResults(formattedResults);
                } else {
                    console.log('❌ No companies found in response');
                }
            } else {
                console.log('❌ API response not ok:', response.status);
            }
        } catch (error) {
            console.error('🚨 Exa search query error:', error);
        }
    }, [populateSpreadsheetWithExaResults]);

    // Handle direct queries (company names, etc.)
    const handleDirectQuery = useCallback(async (query: string) => {
        console.log('🎯 Direct query for:', query);
        try {
            // Use Exa API for direct company searches too
            const response = await fetch('/api/search/exa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: `${query} company information`, numResults: 5 })
            });

            console.log('📡 Direct query API response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('📊 Direct query API response data:', data);
                
                if (data.companies && data.companies.length > 0) {
                    // Format results for spreadsheet
                    const formattedResults = data.companies.map((company: Company) => ({
                        company: company.name,
                        description: company.description,
                        webpage: company.website,
                        industry: company.industry || 'Unknown'
                    }));
                    
                    console.log('📋 Direct query formatted results:', formattedResults);
                    populateSpreadsheetWithExaResults(formattedResults);
                } else {
                    console.log('📝 No companies found, setting value in selected cell:', selectedCell);
                    // Just put the value in the selected cell
                    const { row, col } = selection.anchor;
                    handleCellValueChange(row, col, query);
                }
            } else {
                console.log('❌ Direct query API response not ok:', response.status);
            }
        } catch (error) {
            console.error('🚨 Direct query error:', error);
            // Fallback to just setting the value
            const { row, col } = selection.anchor;
            console.log('📝 Fallback: setting value in selected cell:', selectedCell);
            handleCellValueChange(row, col, query);
        }
    }, [selection.anchor, handleCellValueChange, populateSpreadsheetWithExaResults]);

    // Populate spreadsheet with search results (updated for sparse data)
    const populateSpreadsheetWithResults = useCallback((results: any[]) => {
        if (!results.length) return;

        // Find the next empty row by checking sparse data
        let startRow = 0;
        const maxRow = Math.max(...Array.from(cells.keys()).map(cellKey => {
            const [row] = parseKey(cellKey);
            return row;
        }), -1);
        
        if (maxRow >= 0) {
            startRow = maxRow + 2; // Leave one empty row
        }

        // Prepare cells to set
        const cellsToSet: Array<{ row: number; col: number; value: CellVal }> = [];

        // Add headers if starting from empty spreadsheet
        if (startRow === 0) {
            const headers = ['Company Name', 'Description', 'Website', 'Industry', 'Location', 'Employees', 'Founded', 'Source', 'Status'];
            headers.forEach((header, colIndex) => {
                cellsToSet.push({
                    row: 0,
                    col: colIndex,
                    value: { value: header }
                });
            });
            startRow = 1;
        }

        // Add results
        results.forEach((result, index) => {
            const row = startRow + index;
            const data = [
                result.name || result.title || 'Unknown',
                result.description || result.snippet || '',
                result.website || result.url || '',
                result.industry || '',
                result.location || '',
                result.employees || '',
                result.founded || '',
                result.source || 'Search',
                result.status || 'pending'
            ];

            data.forEach((value, colIndex) => {
                cellsToSet.push({
                    row,
                    col: colIndex,
                    value: { value: value.toString() }
                });
            });
        });

        // Batch update all cells
        dispatch({ type: 'setCells', cells: cellsToSet });

        // Ensure we have enough rows
        const neededRows = startRow + results.length + 1;
        if (neededRows > rows) {
            dispatch({ type: 'addRows', count: neededRows - rows });
        }

        setQueryResults(results);
    }, [cells, rows]);

    // Calculate sum of range (simple implementation)
    const calculateSumRange = useCallback((start: string, end: string): number => {
        // Parse cell references and calculate sum
        // This is a simplified implementation
        const startMatch = start.match(/([A-Z]+)(\d+)/);
        const endMatch = end.match(/([A-Z]+)(\d+)/);
        
        if (!startMatch || !endMatch) return 0;

        let sum = 0;
        // Add logic to sum cells in range
        // For now, return 0 as placeholder
        return sum;
    }, []);

    // Add keyboard shortcuts for undo/redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                dispatch({ type: 'undo' });
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                dispatch({ type: 'redo' });
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Add new row
    const addRows = useCallback((count: number) => {
        dispatch({ type: 'addRows', count });
    }, []);

    // Add new column
    const addColumns = useCallback((count: number) => {
        dispatch({ type: 'addCols', count });
    }, []);

    // Add multiple columns at once
    const addMultipleColumns = useCallback((count: number) => {
        dispatch({ type: 'addCols', count });
        console.log(`Added ${count} columns`);
    }, []);

    // CSV file handling functions
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.csv')) {
            setCsvError("Please select a CSV file");
            return;
        }

        setIsProcessingCSV(true);
        setCsvError("");

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n').filter(line => line.trim());
                
                if (lines.length === 0) {
                    setCsvError("CSV file is empty");
                    setIsProcessingCSV(false);
                    return;
                }

                // Parse CSV data
                const parsedData = lines.map(line => {
                    // Simple CSV parsing - split by comma and handle quotes
                    const values = [];
                    let current = '';
                    let inQuotes = false;
                    
                    for (let i = 0; i < line.length; i++) {
                        const char = line[i];
                        if (char === '"') {
                            inQuotes = !inQuotes;
                        } else if (char === ',' && !inQuotes) {
                            values.push(current.trim());
                            current = '';
                        } else {
                            current += char;
                        }
                    }
                    values.push(current.trim());
                    return values;
                });

                setCsvData(parsedData);
                loadCSVIntoSpreadsheet(parsedData);
                setIsProcessingCSV(false);
            } catch (error) {
                setCsvError("Error parsing CSV file");
                setIsProcessingCSV(false);
            }
        };

        reader.onerror = () => {
            setCsvError("Error reading file");
            setIsProcessingCSV(false);
        };

        reader.readAsText(file);
    };

    const loadCSVIntoSpreadsheet = (data: string[][]) => {
        // Use the new loadCSV action for proper state management
        dispatch({ type: 'loadCSV', data });
    };

    const clearCSVData = () => {
        setCsvData([]);
        setCsvError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Insert column at specific position with proper cell shifting
    const insertColumnAt = (position: number) => {
        dispatch({ type: 'insertCol', position });
        console.log(`Inserted column at position ${position} (after ${getColumnName(position - 1)})`);
    };

    // Add column after specific column (by letter)
    const addColumnAfter = useCallback((columnLetter: string) => {
        const columnIndex = columnLetter.charCodeAt(0) - 65; // Convert A=0, B=1, etc.
        insertColumnAt(columnIndex + 1);
    }, [insertColumnAt]);

    // Function to get AI column suggestions
    const getColumnSuggestions = useCallback(async () => {
        setLoadingSuggestions(true);
        setShowSuggestions(true);
        
        try {
            // Get existing column names
            const existingColumns = Array.from({ length: cols }, (_, index) => getColumnName(index));
            
            // Analyze current data for context
            const dataContext = Array.from(cells.values())
                .filter(cell => cell.value)
                .slice(0, 20)
                .map(cell => cell.value?.toString() || '')
                .join(", ");
                
            const response = await fetch('/api/column-suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    existingColumns,
                    dataContext,
                    industryHint: "Business/Market Research"
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setColumnSuggestions(data.suggestions || []);
        } catch (error) {
            console.error('Failed to get column suggestions:', error);
            // Fallback suggestions
            setColumnSuggestions([
                { name: "CEO Name", description: "Name of the company's CEO", type: "text", category: "contact", priority: "high" },
                { name: "Annual Revenue", description: "Company's yearly revenue in USD", type: "number", category: "financial", priority: "high" },
                { name: "Employee Count", description: "Total number of employees", type: "number", category: "operational", priority: "high" },
                { name: "LinkedIn URL", description: "Company's LinkedIn profile", type: "url", category: "social", priority: "medium" },
                { name: "Industry", description: "Primary industry sector", type: "text", category: "market", priority: "high" },
                { name: "Funding Status", description: "Current funding stage", type: "text", category: "financial", priority: "high" }
            ]);
        } finally {
            setLoadingSuggestions(false);
        }
    }, [cols, cells]);

    // Add columns with suggestions
    const addColumnsWithSuggestions = useCallback(async (count: number) => {
        try {
            // Get suggestions first
            const existingColumns = Array.from({ length: cols }, (_, index) => getColumnName(index));
            const response = await fetch('/api/column-suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    existingColumns,
                    dataContext: "Market research data",
                    industryHint: "Business intelligence"
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const suggestions = data.suggestions || [];
            
            // Add the requested number of columns
            addMultipleColumns(count);
            
            // Show suggestions for the new columns
            if (suggestions.length > 0) {
                console.log(`Added ${count} columns. Suggested headers:`, 
                    suggestions.slice(0, count).map((s: any) => s.name).join(', '));
            }
        } catch (error) {
            console.error('Failed to get suggestions, adding blank columns:', error);
            // Fallback to just adding blank columns
            addMultipleColumns(count);
        }
    }, [cols, addMultipleColumns]);

    // Function to apply a suggestion
    const applySuggestion = useCallback((suggestion: any) => {
        addColumns(1);
        setShowSuggestions(false);
        
        // Log the suggestion for debugging
        console.log(`Added column: ${suggestion.name} - ${suggestion.description}`);
    }, [addColumns]);

    // Wolf Table specific toolbar functions
    const applyWolfTableStyle = useCallback((style: Partial<WolfTableStyle>) => {
        if (!wolfTableInstanceRef.current) return;
        
        const { row, col } = selection.anchor;
        wolfTableInstanceRef.current.addStyle(row, col, style);
        wolfTableInstanceRef.current.render();
    }, [selection.anchor]);

    const toggleWolfTableWrap = useCallback(() => {
        if (!wolfTableInstanceRef.current) return;
        
        const { row, col } = selection.anchor;
        applyWolfTableStyle({ wrap: true, verticalAlign: 'top' });
    }, [applyWolfTableStyle]);

    const addWolfTableColumn = useCallback(() => {
        if (!wolfTableInstanceRef.current) return;
        
        wolfTableInstanceRef.current.insertCol(cols);
        dispatch({ type: 'addCols', count: 1 });
    }, [cols]);

    const addWolfTableRow = useCallback(() => {
        if (!wolfTableInstanceRef.current) return;
        
        wolfTableInstanceRef.current.insertRow(rows);
        dispatch({ type: 'addRows', count: 1 });
    }, [rows]);

    // Get cell by position (now just returns the cell value)
    const getCellByPosition = useCallback((row: number, col: number) => {
        return getCellValue(row, col);
    }, [getCellValue]);

    try {
        console.log('🔥 SpreadsheetScreen about to render JSX...');
        return (
            <div className="h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCurrentScreen("action")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="flex items-center gap-2">
                        <Grid3x3 className="w-6 h-6 text-green-600" />
                        <span className="text-lg font-medium">Getnius Spreadsheet</span>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        <Share className="w-4 h-4 inline mr-1" />
                        Share
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        <MessageSquare className="w-4 h-4 inline mr-1" />
                        Chat
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200 bg-gray-50">
                {/* CSV Upload Section */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isProcessingCSV}
                />
                
                {!csvData.length ? (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
                        disabled={isProcessingCSV}
                    >
                        {isProcessingCSV ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Choose CSV File
                            </>
                        )}
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            <FileText className="w-3 h-3" />
                            Change CSV
                        </button>
                        <button
                            onClick={clearCSVData}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            <X className="w-3 h-3" />
                            Clear
                        </button>
                    </div>
                )}

                {csvError && (
                    <div className="flex items-center gap-1 text-red-600 text-xs ml-2">
                        <X className="w-3 h-3" />
                        {csvError}
                    </div>
                )}
                
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                <button 
                    className={`p-1 rounded ${canUndo ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed'}`}
                    onClick={() => dispatch({ type: 'undo' })}
                    disabled={!canUndo}
                    title={`Undo (Ctrl+Z)${canUndo ? '' : ' - No actions to undo'}`}
                >
                    <Undo className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                    className={`p-1 rounded ${canRedo ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed'}`}
                    onClick={() => dispatch({ type: 'redo' })}
                    disabled={!canRedo}
                    title={`Redo (Ctrl+Y)${canRedo ? '' : ' - No actions to redo'}`}
                >
                    <Redo className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                <select className="px-2 py-1 text-sm border border-gray-300 rounded">
                    <option>Arial</option>
                    <option>Times New Roman</option>
                    <option>Courier New</option>
                </select>
                
                <select className="px-2 py-1 text-sm border border-gray-300 rounded ml-1">
                    <option>10</option>
                    <option>12</option>
                    <option>14</option>
                    <option>16</option>
                </select>
                
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                {/* Formatting Controls - Enhanced for Wolf Table */}
                <button 
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => applyWolfTableStyle({ bold: true })}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => applyWolfTableStyle({ italic: true })}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => applyWolfTableStyle({ underline: true })}
                    title="Underline (Ctrl+U)"
                >
                    <Underline className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                {/* Alignment Controls */}
                <button 
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => applyWolfTableStyle({ align: 'left' })}
                    title="Align Left"
                >
                    <AlignLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => applyWolfTableStyle({ align: 'center' })}
                    title="Align Center"
                >
                    <AlignCenter className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => applyWolfTableStyle({ align: 'right' })}
                    title="Align Right"
                >
                    <AlignRight className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                {/* Wolf Table Specific Controls */}
                <button 
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={toggleWolfTableWrap}
                    title="Wrap Text"
                >
                    <WrapText className="w-4 h-4 text-gray-600" />
                </button>
                
                {/* Implementation Toggle */}
                <div className="w-px h-6 bg-gray-300 mx-2" />
                <button
                    onClick={() => setUseWolfTable(!useWolfTable)}
                    className={`px-2 py-1 text-xs rounded font-medium ${
                        useWolfTable 
                            ? 'bg-green-100 text-green-700 border border-green-300' 
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                    title={`Switch to ${useWolfTable ? 'DOM' : 'Wolf Table'} implementation`}
                >
                    🐺 {useWolfTable ? 'Wolf' : 'DOM'}
                </button>
            </div>

            {/* Enhanced Query Bar - Web Search Enabled */}
            <div className="flex items-center px-4 py-2 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-2 mr-4">
                    <span className="text-sm font-medium text-gray-700 w-12">
                        {selectedCell || "A1"}
                    </span>
                    <Search className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 relative">
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => dispatch({ type: 'setEditing', cellKey: editingCell, value: e.target.value })}
                    onKeyDown={handleKeyPress}
                    onBlur={handleEditConfirm}
                        disabled={isProcessingQuery}
                        className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all ${
                            isProcessingQuery ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        placeholder="Search companies with Exa.ai... (e.g., 'AI companies in healthcare', 'fintech startups 2024', or 'Tesla')"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                        {isProcessingQuery && (
                            <div className="flex items-center gap-2 px-2 py-1 text-xs text-blue-600">
                                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                Searching...
                            </div>
                        )}
                        {editValue && !isProcessingQuery && (
                            <button
                                onClick={() => handleQuerySubmit(editValue)}
                                className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                <Search className="w-3 h-3" />
                                Search Web
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Examples & Query History */}
            <div className="px-4 py-2 bg-blue-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-blue-700">Exa.ai Search Examples:</span>
                        <div className="flex gap-2">
                            {[
                                "AI companies in healthcare",
                                "fintech startups 2024", 
                                "SaaS companies in Europe",
                                "renewable energy companies"
                            ].map((example, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        dispatch({ type: 'setEditing', cellKey: editingCell, value: example });
                                        handleQuerySubmit(example);
                                    }}
                                    className="px-2 py-1 text-xs bg-white border border-blue-200 rounded hover:bg-blue-100 text-blue-700 whitespace-nowrap"
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>
                    {queryResults.length > 0 && (
                        <div className="text-xs text-green-600 font-medium">
                            Last search: {queryResults.length} companies found
                        </div>
                    )}
                </div>
                
                {queryHistory.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium text-gray-600">Recent:</span>
                        <div className="flex gap-2 overflow-x-auto">
                            {queryHistory.slice(0, 3).map((query, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        dispatch({ type: 'setEditing', cellKey: editingCell, value: query });
                                        handleQuerySubmit(query);
                                    }}
                                    className="px-2 py-1 text-xs bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 whitespace-nowrap"
                                >
                                    {query.length > 25 ? query.substring(0, 25) + '...' : query}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Wolf Table Integration with Same Design */}
            <div className="flex-1 overflow-hidden">
                {useWolfTable ? (
                    /* Wolf Table Container */
                    <div className="relative h-full">
                        {/* Loading State */}
                        {!isWolfTableLoaded && (
                            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-gray-600 font-medium">🐺 Loading Wolf Table...</span>
                                </div>
                            </div>
                        )}
                        
                        {/* Wolf Table Container */}
                        <div 
                            ref={wolfTableContainerRef}
                            className="w-full h-full"
                            style={{ minHeight: '400px' }}
                        />
                        
                        {/* Wolf Table Status */}
                        {isWolfTableLoaded && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-300">
                                🐺 Wolf Table Active
                            </div>
                        )}
                    </div>
                ) : (
                    /* Fallback: Original DOM Implementation with Same Design */
                    <div className="relative h-full overflow-auto">
                        {/* Precision Grid Background Layer - Perfect Alignment */}
                        <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: `
                                    linear-gradient(to right, #d1d5db 0.5px, transparent 0.5px),
                                    linear-gradient(to bottom, #d1d5db 0.5px, transparent 0.5px)
                                `,
                                backgroundSize: '96px 32px', // Exactly matches cell dimensions (w-24 = 96px, h-8 = 32px)
                                backgroundPosition: '48px 32px' // Offset by header dimensions (w-12 = 48px, h-8 = 32px)
                            }}
                        />
                        
                        {/* Column Headers */}
                        <div className="sticky top-0 z-10 bg-gray-100 border-b-2 border-gray-400 shadow-sm">
                            <div className="flex">
                                {/* Corner cell - Exact dimensions */}
                                <div 
                                    className="bg-gray-200 border-r-2 border-gray-400 flex items-center justify-center"
                                    style={{ width: '48px', height: '32px', boxSizing: 'border-box' }}
                                >
                                    <Grid3x3 className="w-3 h-3 text-gray-500" />
                                </div>
                                
                                {/* Column headers with perfect alignment */}
                                {Array.from({ length: cols }, (_, index) => (
                                    <div
                                        key={index}
                                        className="relative flex items-center justify-center text-xs font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 cursor-pointer group transition-colors border-r border-gray-300 last:border-r-2 last:border-gray-400"
                                        style={{ width: '96px', height: '32px', boxSizing: 'border-box' }}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            setSelectedColumn(index);
                                            setShowColumnMenu(true);
                                            setMenuPosition({ x: e.clientX, y: e.clientY });
                                        }}
                                        onClick={() => {
                                            setSelectedColumn(index);
                                            // Select entire column
                                            dispatch({ 
                                                type: 'setSelection', 
                                                anchor: { row: 0, col: index }, 
                                                extent: { row: rows - 1, col: index } 
                                            });
                                        }}
                                    >
                                        {getColumnName(index)}
                                        
                                        {/* Enhanced dropdown arrow */}
                                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedColumn(index);
                                                    setShowColumnMenu(true);
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    setMenuPosition({ x: rect.left, y: rect.bottom });
                                                }}
                                                className="w-3 h-3 flex items-center justify-center hover:bg-gray-300 rounded-sm"
                                            >
                                                <ChevronDown className="w-2 h-2" />
                                            </button>
                                        </div>
                                        
                                        {/* Column selection indicator */}
                                        {selectedColumn === index && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                                        )}
                                    </div>
                                ))}
                                
                                {/* Add Column Button */}
                                <div className="relative">
                                    <button
                                        onClick={() => useWolfTable ? addWolfTableColumn() : getColumnSuggestions()}
                                        className="flex items-center justify-center text-xs font-medium text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 border-r-2 border-gray-400"
                                        style={{ width: '128px', height: '32px', boxSizing: 'border-box' }}
                                        title="Add column with AI suggestions"
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Add column
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Grid Body with Enhanced Cell Rendering */}
                        <div className="relative">
                            {Array.from({ length: rows }, (_, rowIndex) => (
                                <div key={rowIndex} className="flex relative">
                                    {/* Precisely Aligned Row header */}
                                    <div 
                                        className="flex items-center justify-center text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors border-r border-gray-300 cursor-pointer"
                                        style={{ width: '48px', height: '32px', boxSizing: 'border-box' }}
                                         onClick={() => {
                                             // Select entire row
                                             dispatch({ 
                                                 type: 'setSelection', 
                                                 anchor: { row: rowIndex, col: 0 }, 
                                                 extent: { row: rowIndex, col: cols - 1 } 
                                             });
                                         }}
                                         title={`Select row ${rowIndex + 1}`}
                                    >
                                        {rowIndex + 1}
                                    </div>
                                    
                                    {/* Perfectly Aligned Cells - No Borders, Grid Background Handles Lines */}
                                    {Array.from({ length: cols }, (_, colIndex) => {
                                        const cellValue = getCellByPosition(rowIndex, colIndex);
                                        const cellAddress = getCellAddress(rowIndex, colIndex);
                                        const isSelected = selection.anchor.row === rowIndex && selection.anchor.col === colIndex;
                                        const isInRange = (
                                            rowIndex >= Math.min(selection.anchor.row, selection.extent.row) &&
                                            rowIndex <= Math.max(selection.anchor.row, selection.extent.row) &&
                                            colIndex >= Math.min(selection.anchor.col, selection.extent.col) &&
                                            colIndex <= Math.max(selection.anchor.col, selection.extent.col)
                                        );
                                        const isCurrentlyEditing = editingCell === key(rowIndex, colIndex);
                                        
                                        return (
                                            <div
                                                key={colIndex}
                                                className={`relative transition-all duration-150 ${
                                                    isSelected ? 'ring-2 ring-blue-500 bg-blue-100 z-10' : 
                                                    isInRange ? 'bg-blue-50' :
                                                    'hover:bg-gray-50'
                                                }`}
                                                style={{
                                                    width: '96px', // Exact pixel width to match grid
                                                    height: '32px', // Exact pixel height to match grid
                                                    boxSizing: 'border-box'
                                                }}
                                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                                onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                                            >
                                                {isCurrentlyEditing ? (
                                                    <input
                                                        ref={inputRef}
                                                        type="text"
                                                        value={editValue}
                                                        onChange={(e) => dispatch({ type: 'setEditing', cellKey: editingCell, value: e.target.value })}
                                                        onKeyDown={handleKeyPress}
                                                        onBlur={handleEditConfirm}
                                                        className="w-full h-full px-2 text-xs border-2 border-blue-500 outline-none bg-white rounded-sm shadow-sm"
                                                        style={{ boxSizing: 'border-box' }}
                                                    />
                                                ) : (
                                                    <div 
                                                        className="w-full h-full px-2 flex items-center text-xs text-gray-900 overflow-hidden cursor-cell"
                                                        style={{ boxSizing: 'border-box' }}
                                                    >
                                                        <span className="truncate">{cellValue}</span>
                                                    </div>
                                                )}
                                                
                                                {/* Cell address tooltip on hover */}
                                                {isSelected && (
                                                    <div className="absolute -top-6 left-0 px-1 py-0.5 bg-gray-800 text-white text-xs rounded shadow-lg z-20">
                                                        {cellAddress}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    
                                    {/* Enhanced empty cell to match add column button */}
                                    <div className="w-32 h-8 bg-gradient-to-r from-gray-50 to-gray-100"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* AI Suggestions Dropdown - Shared between both implementations */}
                {showSuggestions && (
                    <div className="absolute top-20 right-4 w-80 bg-white border-2 border-gray-300 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
                        <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-gray-900">📊 AI Column Suggestions</h4>
                                <button
                                    onClick={() => setShowSuggestions(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            {loadingSuggestions && (
                                <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    🤖 Getting intelligent suggestions...
                                </div>
                            )}
                        </div>
                        
                        <div className="max-h-64 overflow-y-auto">
                            {columnSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => applySuggestion(suggestion)}
                                    className="w-full text-left px-3 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-b border-gray-100 last:border-b-0 transition-all duration-200"
                                >
                                    <div className="font-medium text-sm text-gray-900">{suggestion.name}</div>
                                    <div className="text-xs text-gray-600 mt-1">{suggestion.description}</div>
                                    <div className="flex gap-2 mt-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                                            suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {suggestion.priority} priority
                                        </span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                            {suggestion.category}
                                        </span>
                                    </div>
                                </button>
                            ))}
                            
                            {!loadingSuggestions && columnSuggestions.length === 0 && (
                                <div className="p-4 text-sm text-gray-500 text-center">
                                    No suggestions available. Try adding some data first.
                                </div>
                            )}
                        </div>
                        
                        <div className="p-2 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => { 
                                    useWolfTable ? addWolfTableColumn() : addColumns(1); 
                                    setShowSuggestions(false); 
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            >
                                ➕ Add blank column
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                    {/* Row Controls - Enhanced for Wolf Table */}
                    <button
                        onClick={() => useWolfTable ? addWolfTableRow() : addRows(1)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
                        title={useWolfTable ? "Add row (Wolf Table)" : "Add row (DOM)"}
                    >
                        <Plus className="w-3 h-3" />
                        Add row {useWolfTable ? '🐺' : ''}
                    </button>
                    
                    {!useWolfTable && (
                        <>
                            <button
                                onClick={() => addRows(10)}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
                            >
                                <Plus className="w-3 h-3" />
                                Add 10 rows
                            </button>
                            
                            <button
                                onClick={() => addRows(100)}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
                            >
                                <Plus className="w-3 h-3" />
                                Add 100 rows
                            </button>
                            
                            <button
                                onClick={() => addRows(1000)}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
                            >
                                <Plus className="w-3 h-3" />
                                Add 1000
                            </button>
                        </>
                    )}
                    
                    <div className="w-px h-6 bg-gray-300 mx-2" />
                    
                    {/* Column Controls - Enhanced for Wolf Table */}
                    <button
                        onClick={() => useWolfTable ? addWolfTableColumn() : addColumns(1)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
                        title={useWolfTable ? "Add column (Wolf Table)" : "Add column (DOM)"}
                    >
                        <Plus className="w-3 h-3" />
                        Add column {useWolfTable ? '🐺' : ''}
                    </button>
                    
                    {!useWolfTable && (
                        <>
                            <button
                                onClick={() => addMultipleColumns(3)}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:bg-green-100 rounded font-medium"
                            >
                                <Plus className="w-3 h-3" />
                                Add 3 columns
                            </button>
                            
                            <button
                                onClick={() => addMultipleColumns(5)}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:bg-green-100 rounded font-medium"
                            >
                                <Plus className="w-3 h-3" />
                                Add 5 columns
                            </button>
                            
                            <button
                                onClick={() => addColumnsWithSuggestions(5)}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 hover:bg-purple-100 rounded font-medium"
                            >
                                🤖 <Plus className="w-3 h-3" />
                                Add 5 smart columns
                            </button>
                            
                            <div className="w-px h-6 bg-gray-300 mx-2" />
                            
                            {/* Special Actions */}
                            <button
                                onClick={() => addColumnAfter('J')}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 rounded font-medium"
                            >
                                <Plus className="w-3 h-3" />
                                Add after column J
                            </button>
                        </>
                    )}
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="text-xs text-gray-500">
                        {rows} rows × {cols} columns
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                        useWolfTable 
                            ? 'bg-green-100 text-green-700 border border-green-300' 
                            : 'bg-blue-100 text-blue-700 border border-blue-300'
                    }`}>
                        {useWolfTable ? (
                            isWolfTableLoaded ? '🐺 Wolf Table Ready' : '🐺 Wolf Table Loading...'
                        ) : (
                            '🏠 DOM Implementation'
                        )}
                    </div>
                </div>
            </div>

            {/* Column Context Menu */}
            {showColumnMenu && selectedColumn !== null && (
                <>
                    {/* Overlay to close menu */}
                    <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowColumnMenu(false)}
                    />
                    
                    {/* Context Menu */}
                    <div 
                        className="fixed bg-white border border-gray-300 rounded-md shadow-lg z-20 py-1 min-w-48"
                        style={{ 
                            left: menuPosition.x, 
                            top: menuPosition.y,
                            transform: 'translateY(-100%)' 
                        }}
                    >
                        <button
                            onClick={() => {
                                insertColumnAt(selectedColumn!);
                                setShowColumnMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Insert column before {getColumnName(selectedColumn)}
                        </button>
                        
                        <button
                            onClick={() => {
                                insertColumnAt(selectedColumn! + 1);
                                setShowColumnMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Insert column after {getColumnName(selectedColumn)}
                        </button>
                        
                        {/* Special highlight for column J */}
                        {selectedColumn === 9 && (
                            <div className="border-t border-gray-200 mt-1 pt-1">
                                <button
                                    onClick={() => {
                                        addColumnAfter('J');
                                        setShowColumnMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-blue-600 font-medium flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add column after column J ⭐
                                </button>
                            </div>
                        )}
                        
                        <div className="border-t border-gray-200 mt-1 pt-1">
                            <button
                                onClick={() => {
                                    getColumnSuggestions();
                                    setShowColumnMenu(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                            >
                                🤖 AI Column Suggestions
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
        );
    } catch (error) {
        console.error('🚨 SpreadsheetScreen render error:', error);
        return (
            <div className="h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Spreadsheet Error</h1>
                    <p className="text-gray-600 mt-2">An error occurred while rendering the spreadsheet.</p>
                    <p className="text-sm text-gray-500 mt-1">Check the console for details.</p>
                    <button
                        onClick={() => setCurrentScreen("action")}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }
};

SpreadsheetScreen.displayName = "SpreadsheetScreen";
export default SpreadsheetScreen;