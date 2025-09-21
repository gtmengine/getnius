import React, { useState, useRef, useEffect, useCallback } from "react";
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
    Download
} from "lucide-react";
import { searchCompanies, type Company } from "../lib/search-apis";

// Import Wolf Table - dynamic import to avoid SSR issues
let WolfTable: any = null;
if (typeof window !== 'undefined') {
  import('@wolf-table/table').then((module) => {
    WolfTable = module.default;
  });
}

interface Cell {
    id: string;
    value: string;
    row: number;
    col: number;
    isSelected: boolean;
    isEditing: boolean;
}

interface Spreadsheet2ScreenProps {
    setCurrentScreen: (screen: string) => void;
    initialData?: any[];
}

const Spreadsheet2Screen: React.FC<Spreadsheet2ScreenProps> = ({ 
    setCurrentScreen, 
    initialData = [] 
}) => {
    const [cells, setCells] = useState<Cell[]>([]);
    const [selectedCell, setSelectedCell] = useState<string | null>(null);
    const [editingCell, setEditingCell] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [rows, setRows] = useState(20);
    const [cols, setCols] = useState(12);
    const inputRef = useRef<HTMLInputElement>(null);

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

    // Wolf Table state
    const tableRef = useRef<HTMLDivElement>(null);
    const tableInstanceRef = useRef<any>(null);

    // Initialize Wolf Table
    useEffect(() => {
        const initTable = async () => {
            try {
                console.log('Initializing Wolf Table...');
                
                if (tableRef.current && typeof window !== 'undefined') {
                    // Import Wolf Table CSS
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/@wolf-table/table/dist/table.min.css';
                    document.head.appendChild(link);

                    // Wait for Wolf Table to load
                    let attempts = 0;
                    const maxAttempts = 50;
                    
                    const tryCreateTable = () => {
                        if (WolfTable && tableRef.current) {
                            createRealWolfTable();
                        } else if (attempts < maxAttempts) {
                            attempts++;
                            setTimeout(tryCreateTable, 100);
                        } else {
                            console.log('Wolf Table not available, using mock...');
                            createMockTable();
                        }
                    };
                    
                    tryCreateTable();
                }
            } catch (error) {
                console.error('Failed to initialize Wolf Table:', error);
                createMockTable();
            }
        };

        initTable();

        return () => {
            // Cleanup table instance
            if (tableInstanceRef.current) {
                try {
                    // tableInstanceRef.current.destroy?.();
                } catch (e) {
                    console.log('Cleanup completed');
                }
            }
        };
    }, []);

    const createRealWolfTable = () => {
        if (!tableRef.current || !WolfTable) return;

        try {
            console.log('Creating real Wolf Table...');
            
            // Clear the container and create table element
            tableRef.current.innerHTML = '';
            const tableElement = document.createElement('div');
            tableElement.id = 'wolf-table-container';
            tableElement.style.width = '100%';
            tableElement.style.height = '400px';
            tableRef.current.appendChild(tableElement);

            // Create Wolf Table instance
            const table = WolfTable.create(
                '#wolf-table-container',
                () => 1200, // width
                () => 400,  // height
                {
                    scrollable: true,
                    resizable: true,
                    selectable: true,
                    editable: true,
                    copyable: true,
                }
            )
            .freeze('D5')
            .merge('F10:G11')
            .merge('I10:K11')
            .formulaParser((v: string) => `${v}-formula`)
            .data({
                styles: [],
                cells: [
                    // Headers
                    [0, 0, 'YOUR SEARCH REQUEST'],
                    [0, 1, 'COLUMN NAME'],
                    [0, 2, 'Enter a short, descriptive header for this column'],
                    
                    // Data rows
                    [1, 0, 'Entity to Research - Replace each placeholder with the company, product, or topic you need to look up.:'],
                    [1, 1, 'Data Type (text/ url / email)'],
                    [1, 2, 'Data Type - Specify the expected data format'],
                    
                    [2, 0, 'Prompt Details'],
                    [2, 1, 'Prompt Details'],
                    [2, 2, 'Prompt Details - Give prompting instructions'],
                    
                    [3, 0, 'Format Options'],
                    [3, 1, 'Format Options'],
                    [3, 2, 'Format Options - Define output formatting rules'],
                    
                    // Additional sample data
                    [5, 0, 'Company'],
                    [5, 1, 'Revenue'],
                    [5, 2, 'Employees'],
                    [5, 3, 'Industry'],
                    [6, 0, 'OpenAI'],
                    [6, 1, '$1.3B'],
                    [6, 2, '500+'],
                    [6, 3, 'AI/ML'],
                    [7, 0, 'Anthropic'],
                    [7, 1, '$750M'],
                    [7, 2, '150+'],
                    [7, 3, 'AI Safety'],
                    [9, 5, { value: '', formula: '=sum(A1:A10)' }],
                ],
            })
            .render();

            // Add basic text style without background colors
            const basicStyle = table.addStyle({
                bold: true,
                color: '#333',
                fontSize: 11,
                align: 'left'
            });

            // Apply basic style to key cells (no background colors)
            table.cell(0, 0, { value: 'YOUR SEARCH REQUEST', style: basicStyle });
            table.cell(0, 1, { value: 'COLUMN NAME', style: basicStyle });
            table.cell(0, 2, { value: 'Enter a short, descriptive header for this column', style: basicStyle });

            table.render();

            // Store table instance
            tableInstanceRef.current = table;

            console.log('✅ Real Wolf Table created successfully!');
        } catch (error) {
            console.error('Failed to create real Wolf Table:', error);
            createMockTable();
        }
    };

    const createMockTable = () => {
        if (!tableRef.current) return;

        // Create a canvas-based table simulation
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 400;
        canvas.style.border = '1px solid #ddd';
        canvas.style.background = '#fff';
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Draw grid
            drawGrid(ctx, canvas.width, canvas.height);
            // Add sample data
            drawSampleData(ctx);
        }
        
        tableRef.current.innerHTML = '';
        tableRef.current.appendChild(canvas);
    };

    const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const cellWidth = 120;
        const cellHeight = 30;
        const rows = Math.floor(height / cellHeight);
        const cols = Math.floor(width / cellWidth);

        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;

        // Draw vertical lines
        for (let i = 0; i <= cols; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellWidth, 0);
            ctx.lineTo(i * cellWidth, height);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let i = 0; i <= rows; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * cellHeight);
            ctx.lineTo(width, i * cellHeight);
            ctx.stroke();
        }

        // Draw headers
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, cellHeight);
        ctx.fillRect(0, 0, cellWidth, height);

        // Column headers (A, B, C, etc.)
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        for (let i = 1; i < cols; i++) {
            const letter = String.fromCharCode(64 + i); // A, B, C...
            ctx.fillText(letter, i * cellWidth + cellWidth / 2, cellHeight / 2 + 4);
        }

        // Row headers (1, 2, 3, etc.)
        ctx.textAlign = 'center';
        for (let i = 1; i < rows; i++) {
            ctx.fillText(i.toString(), cellWidth / 2, i * cellHeight + cellHeight / 2 + 4);
        }
    };

    const drawSampleData = (ctx: CanvasRenderingContext2D) => {
        const cellWidth = 120;
        const cellHeight = 30;
        
        ctx.fillStyle = '#333';
        ctx.font = '11px Arial';
        ctx.textAlign = 'left';

        // Sample data matching the search request structure
        const sampleData = [
            // Headers
            [1, 1, 'YOUR SEARCH REQUEST'],
            [1, 2, 'COLUMN NAME'],
            [1, 3, 'Enter a short, descriptive header'],
            
            // Data rows
            [2, 1, 'Entity to Research'],
            [2, 2, 'Data Type (text/url/email)'],
            [2, 3, 'Data Type - Specify format'],
            
            [3, 1, 'Prompt Details'],
            [3, 2, 'Prompt Details'],
            [3, 3, 'Prompt Details - Give instructions'],
            
            [4, 1, 'Format Options'],
            [4, 2, 'Format Options'],
            [4, 3, 'Format Options - Define rules'],
            
            // Additional data
            [6, 1, 'Company'],
            [6, 2, 'Revenue'],
            [6, 3, 'Employees'],
            [6, 4, 'Industry'],
            [7, 1, 'OpenAI'],
            [7, 2, '$1.3B'],
            [7, 3, '500+'],
            [7, 4, 'AI/ML'],
        ];

        sampleData.forEach(([row, col, value]) => {
            const x = (col as number) * cellWidth + 5;
            const y = (row as number) * cellHeight + cellHeight / 2 + 4;
            
            // Use regular text color for all cells
            ctx.fillStyle = '#333';
            ctx.fillText(value.toString(), x, y);
        });
    };

    // Column headers (A, B, C, etc.)
    const getColumnHeader = useCallback((index: number): string => {
        let result = '';
        let num = index;
        do {
            result = String.fromCharCode(65 + (num % 26)) + result;
            num = Math.floor(num / 26) - 1;
        } while (num >= 0);
        return result;
    }, []);

    // Initialize cells
    useEffect(() => {
        const initialCells: Cell[] = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cellId = `${getColumnHeader(col)}${row + 1}`;
                
                // Pre-populate with initial data if provided
                let value = "";
                if (initialData && initialData[row] && initialData[row][col]) {
                    value = initialData[row][col].toString();
                }
                
                initialCells.push({
                    id: cellId,
                    value,
                    row,
                    col,
                    isSelected: false,
                    isEditing: false
                });
            }
        }
        setCells(initialCells);
    }, [rows, cols, initialData, getColumnHeader]);

    // Handle cell click
    const handleCellClick = useCallback((cellId: string) => {
        setSelectedCell(cellId);
        setEditingCell(null);
        const cell = cells.find(c => c.id === cellId);
        if (cell) {
            setEditValue(cell.value);
        }
    }, [cells]);

    // Handle cell double click to edit
    const handleCellDoubleClick = useCallback((cellId: string) => {
        setEditingCell(cellId);
        const cell = cells.find(c => c.id === cellId);
        if (cell) {
            setEditValue(cell.value);
        }
        setTimeout(() => inputRef.current?.focus(), 0);
    }, [cells]);

    // Handle cell value change
    const handleCellValueChange = useCallback((cellId: string, newValue: string) => {
        setCells(prev => prev.map(cell => 
            cell.id === cellId ? { ...cell, value: newValue } : cell
        ));
        setEditValue(newValue);
    }, []);

    // Handle edit confirm
    const handleEditConfirm = useCallback(() => {
        if (editingCell) {
            handleCellValueChange(editingCell, editValue);
            setEditingCell(null);
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
            setEditingCell(null);
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

    // Populate spreadsheet with Exa results in specific format: Company | Description | Webpage | Industry
    const populateSpreadsheetWithExaResults = useCallback((results: any[]) => {
        console.log('🎯 PopulateSpreadsheetWithExaResults called with:', results);
        
        if (!results.length) {
            console.log('❌ No results to populate');
            return;
        }

        // Clear existing data and set headers in row 1
        const headers = ['Company', 'Description', 'Webpage', 'Industry'];
        console.log('📝 Setting headers:', headers);
        
        headers.forEach((header, colIndex) => {
            const cellId = `${getColumnHeader(colIndex)}1`;
            console.log(`📝 Setting header "${header}" in cell ${cellId}`);
            handleCellValueChange(cellId, header);
        });

        // Populate data starting from row 2
        results.forEach((result, index) => {
            const row = index + 2; // Start from row 2 (row 1 is headers)
            const data = [
                result.company || 'Unknown Company',
                result.description || 'No description available',
                result.webpage || 'No website',
                result.industry || 'Unknown Industry'
            ];

            console.log(`📝 Row ${row} data:`, data);

            data.forEach((value, colIndex) => {
                const cellId = `${getColumnHeader(colIndex)}${row}`;
                console.log(`📝 Setting "${value}" in cell ${cellId}`);
                handleCellValueChange(cellId, value.toString());
            });
        });

        // Ensure we have enough rows
        const neededRows = results.length + 2; // +1 for header, +1 for buffer
        console.log(`📏 Current rows: ${rows}, needed: ${neededRows}`);
        if (neededRows > rows) {
            console.log(`📏 Expanding rows to ${neededRows}`);
            setRows(neededRows);
        }

        setQueryResults(results);
        console.log('✅ Population complete, results stored');
    }, [getColumnHeader, handleCellValueChange, rows]);

    // Handle formula calculations
    const handleFormulaCalculation = useCallback((formula: string) => {
        try {
            // Simple formula parsing - extend as needed
            if (formula.includes('SUM')) {
                const match = formula.match(/SUM\(([A-Z]+\d+):([A-Z]+\d+)\)/);
                if (match) {
                    // Calculate sum of range
                    const result = calculateSumRange(match[1], match[2]);
                    if (selectedCell) {
                        handleCellValueChange(selectedCell, result.toString());
                    }
                }
            }
        } catch (error) {
            console.error('Formula calculation error:', error);
        }
    }, [selectedCell, handleCellValueChange]);

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
                    if (selectedCell) {
                        handleCellValueChange(selectedCell, query);
                    }
                }
            } else {
                console.log('❌ Direct query API response not ok:', response.status);
            }
        } catch (error) {
            console.error('🚨 Direct query error:', error);
            // Fallback to just setting the value
            if (selectedCell) {
                console.log('📝 Fallback: setting value in selected cell:', selectedCell);
                handleCellValueChange(selectedCell, query);
            }
        }
    }, [selectedCell, handleCellValueChange, populateSpreadsheetWithExaResults]);

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

    // Add new row
    const addRows = useCallback((count: number) => {
        setRows(prev => prev + count);
    }, []);

    // Add new column
    const addColumns = useCallback((count: number) => {
        setCols(prev => prev + count);
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
        const maxCols = Math.max(...data.map(row => row.length));
        const newRows = data.length;
        
        // Ensure we have enough columns and rows
        if (maxCols > cols) setCols(maxCols);
        if (newRows > rows) setRows(newRows);

        // Create new cells with CSV data
        const newCells: Cell[] = [];
        
        for (let row = 0; row < newRows; row++) {
            for (let col = 0; col < maxCols; col++) {
                const value = data[row]?.[col] || '';
                newCells.push({
                    id: `${row}-${col}`,
                    value: value,
                    row: row,
                    col: col,
                    isSelected: false,
                    isEditing: false
                });
            }
        }

        setCells(newCells);
    };

    const clearCSVData = () => {
        setCsvData([]);
        setCsvError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Get cell by position
    const getCellByPosition = useCallback((row: number, col: number) => {
        return cells.find(cell => cell.row === row && cell.col === col);
    }, [cells]);

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
                        <Grid3x3 className="w-6 h-6 text-purple-600" />
                        <span className="text-lg font-medium">Spreadsheet 2 - Wolf Table</span>
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
                
                <button className="p-1 hover:bg-gray-200 rounded">
                    <Undo className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
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
                
                <button className="p-1 hover:bg-gray-200 rounded">
                    <Bold className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                    <Italic className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                    <Underline className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                <button className="p-1 hover:bg-gray-200 rounded">
                    <AlignLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                    <AlignCenter className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                    <AlignRight className="w-4 h-4 text-gray-600" />
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
                    onChange={(e) => setEditValue(e.target.value)}
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
                                        setEditValue(example);
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
                                        setEditValue(query);
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

            {/* Wolf Table Only Layout */}
            <div className="flex-1 overflow-auto">
                {/* Wolf Table Panel */}
                <div className="w-full bg-gray-50 overflow-auto">
                    <div className="p-4">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Wolf Table - Advanced Canvas</h3>
                                    <p className="text-sm text-gray-600">
                                        Canvas-based spreadsheet with advanced features like freeze, merge, borders, and formulas.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${WolfTable ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                    <span className="text-xs text-gray-600">
                                        {WolfTable ? 'Wolf Table Loaded' : 'Loading...'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Table will be rendered here */}
                            <div 
                                ref={tableRef}
                                className="border border-gray-300 rounded overflow-hidden"
                                style={{ minHeight: '400px' }}
                            />

                            {/* Table Actions */}
                            <div className="mt-4 flex gap-2 flex-wrap">
                                <button 
                                    onClick={() => {
                                        if (WolfTable && tableInstanceRef.current) {
                                            createRealWolfTable();
                                        } else {
                                            createMockTable();
                                        }
                                    }}
                                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Refresh Table
                                </button>
                                <button 
                                    className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                    onClick={() => {
                                        if (tableInstanceRef.current) {
                                            // Add a formula to cell
                                            tableInstanceRef.current.cell(3, 4, { 
                                                value: '', 
                                                formula: '=sum(B1:B3)' 
                                            }).render();
                                            console.log('Formula added to cell D5');
                                        } else {
                                            console.log('Add formula clicked (Wolf Table not available)');
                                        }
                                    }}
                                >
                                    Add Formula
                                </button>
                                <button 
                                    className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                    onClick={() => {
                                        if (tableInstanceRef.current) {
                                            // Merge some cells
                                            tableInstanceRef.current.merge('A6:B7').render();
                                            console.log('Merged cells A6:B7');
                                        } else {
                                            console.log('Merge cells clicked (Wolf Table not available)');
                                        }
                                    }}
                                >
                                    Merge Cells
                                </button>
                                <button 
                                    className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                    onClick={() => {
                                        if (tableInstanceRef.current) {
                                            // Add text wrapping style to description columns
                                            const wrapStyle = tableInstanceRef.current.addStyle({
                                                wrap: true,
                                                align: 'left',
                                                fontSize: 9,
                                                color: '#333',
                                                verticalAlign: 'top'
                                            });
                                            
                                            // Wrap text in description columns (column 2)
                                            for (let row = 1; row <= 4; row++) {
                                                const cell = tableInstanceRef.current.cell(row, 2);
                                                if (cell && cell.value) {
                                                    tableInstanceRef.current.cell(row, 2, { 
                                                        value: cell.value, 
                                                        style: wrapStyle 
                                                    });
                                                }
                                            }
                                            
                                            tableInstanceRef.current.render();
                                            console.log('Text wrapping applied to description columns');
                                        } else {
                                            console.log('Wrap descriptions clicked (Wolf Table not available)');
                                        }
                                    }}
                                >
                                    Wrap Text
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                    {/* Row Controls */}
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
                    
                    <div className="w-px h-6 bg-gray-300 mx-2" />
                    
                    {/* Column Controls */}
                    <button
                        onClick={() => addColumns(5)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:bg-green-100 rounded font-medium"
                    >
                        <Plus className="w-3 h-3" />
                        Add 5 columns
                    </button>
                </div>
                
                <div className="text-xs text-gray-500">
                    Wolf Table: Canvas-based with advanced features
                </div>
            </div>
        </div>
    );
};

Spreadsheet2Screen.displayName = "Spreadsheet2Screen";
export default Spreadsheet2Screen;
