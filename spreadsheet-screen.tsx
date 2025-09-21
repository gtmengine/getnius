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
    Search
} from "lucide-react";
import { searchCompanies, type Company } from "./lib/search-apis";

interface Cell {
    id: string;
    value: string;
    row: number;
    col: number;
    isSelected: boolean;
    isEditing: boolean;
}

interface SpreadsheetScreenProps {
    setCurrentScreen: (screen: string) => void;
    initialData?: any[];
}

const SpreadsheetScreen: React.FC<SpreadsheetScreenProps> = ({ 
    setCurrentScreen, 
    initialData = [] 
}) => {
    const [cells, setCells] = useState<Cell[]>([]);
    const [selectedCell, setSelectedCell] = useState<string | null>(null);
    const [editingCell, setEditingCell] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [rows, setRows] = useState(20);
    const [cols, setCols] = useState(12); // Increased to accommodate more company data columns
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

    // Copy/Paste state
    const [copiedCell, setCopiedCell] = useState<{cellId: string, value: string} | null>(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [contextMenuCell, setContextMenuCell] = useState<string | null>(null);

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
    }, [rows, cols, initialData]);


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

    // Get cell value by ID
    const getCellValue = useCallback((cellId: string) => {
        const cell = cells.find(c => c.id === cellId);
        return cell ? cell.value : "";
    }, [cells]);

    // Copy cell functionality
    const copyCell = useCallback((cellId: string) => {
        const cellValue = getCellValue(cellId);
        setCopiedCell({ cellId, value: cellValue });
        
        // Copy to system clipboard as well
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(cellValue).catch(err => {
                console.warn('Could not copy to clipboard:', err);
            });
        }
        
        console.log(`Copied cell ${cellId}: "${cellValue}"`);
    }, [getCellValue]);

    // Paste cell functionality
    const pasteCell = useCallback((targetCellId: string) => {
        if (copiedCell) {
            handleCellValueChange(targetCellId, copiedCell.value);
            console.log(`Pasted "${copiedCell.value}" to cell ${targetCellId}`);
        } else {
            // Try to paste from system clipboard
            if (navigator.clipboard && navigator.clipboard.readText) {
                navigator.clipboard.readText().then(text => {
                    if (text) {
                        handleCellValueChange(targetCellId, text);
                        console.log(`Pasted from clipboard: "${text}" to cell ${targetCellId}`);
                    }
                }).catch(err => {
                    console.warn('Could not read from clipboard:', err);
                });
            }
        }
    }, [copiedCell, handleCellValueChange]);

    // Handle right-click context menu
    const handleCellRightClick = useCallback((e: React.MouseEvent, cellId: string) => {
        e.preventDefault();
        setContextMenuCell(cellId);
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
    }, []);

    // Close context menu
    const closeContextMenu = useCallback(() => {
        setShowContextMenu(false);
        setContextMenuCell(null);
    }, []);

    // Global keyboard shortcuts and click handlers
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'c' || e.key === 'C') {
                    if (selectedCell && !editingCell) {
                        e.preventDefault();
                        copyCell(selectedCell);
                    }
                } else if (e.key === 'v' || e.key === 'V') {
                    if (selectedCell && !editingCell) {
                        e.preventDefault();
                        pasteCell(selectedCell);
                    }
                }
            }
        };

        const handleGlobalClick = () => {
            closeContextMenu();
        };

        document.addEventListener('keydown', handleGlobalKeyDown);
        document.addEventListener('click', handleGlobalClick);

        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
            document.removeEventListener('click', handleGlobalClick);
        };
    }, [selectedCell, editingCell, copyCell, pasteCell, closeContextMenu]);

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
        } else if (e.ctrlKey || e.metaKey) {
            // Handle Ctrl/Cmd + key combinations
            if (e.key === 'c' || e.key === 'C') {
                e.preventDefault();
                if (selectedCell) {
                    copyCell(selectedCell);
                }
            } else if (e.key === 'v' || e.key === 'V') {
                e.preventDefault();
                if (selectedCell) {
                    pasteCell(selectedCell);
                }
            }
        }
    }, [handleEditConfirm, editValue, selectedCell, copyCell, pasteCell]);

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

    // Handle search queries - using mock data like search screen
    const handleSearchQuery = useCallback(async (query: string) => {
        try {
            // Mock companies data similar to search screen
            const mockCompanies = [
                {
                    name: "TechCorp",
                    description: "Leading technology company specializing in cloud solutions and enterprise software",
                    website: "https://techcorp.com",
                    industry: "Technology"
                },
                {
                    name: "InnovateLabs",
                    description: "AI-powered research and development company focused on machine learning solutions",
                    website: "https://innovatelabs.io",
                    industry: "AI"
                },
                {
                    name: "DataFlow Systems",
                    description: "Big data analytics platform helping businesses make data-driven decisions",
                    website: "https://dataflow.com",
                    industry: "Analytics"
                },
                {
                    name: "CloudBridge",
                    description: "Cloud infrastructure provider offering scalable computing solutions",
                    website: "https://cloudbridge.net",
                    industry: "Cloud Computing"
                },
                {
                    name: "SecureNet",
                    description: "Cybersecurity firm providing advanced threat detection and prevention services",
                    website: "https://securenet.com",
                    industry: "Cybersecurity"
                },
                {
                    name: "GreenTech Solutions",
                    description: "Sustainable technology company developing renewable energy management systems",
                    website: "https://greentech.com",
                    industry: "CleanTech"
                },
                {
                    name: "HealthAI",
                    description: "Healthcare technology startup using AI for medical diagnosis and treatment optimization",
                    website: "https://healthai.com",
                    industry: "HealthTech"
                },
                {
                    name: "FinanceFlow",
                    description: "Financial technology platform providing digital banking and payment solutions",
                    website: "https://financeflow.com",
                    industry: "FinTech"
                }
            ];

            // Filter companies based on query (simple matching)
            const filteredCompanies = mockCompanies.filter(company => 
                company.name.toLowerCase().includes(query.toLowerCase()) ||
                company.description.toLowerCase().includes(query.toLowerCase()) ||
                company.industry.toLowerCase().includes(query.toLowerCase())
            );

            // If no matches, return all companies
            const companies = filteredCompanies.length > 0 ? filteredCompanies : mockCompanies;

            // Format results for spreadsheet with specific columns
            const formattedResults = companies.slice(0, 10).map((company) => ({
                company: company.name,
                description: company.description,
                webpage: company.website,
                industry: company.industry
            }));
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            populateSpreadsheetWithExaResults(formattedResults);
        } catch (error) {
            console.error('Search query error:', error);
        }
    }, []);

    // Handle direct queries (company names, etc.)
    const handleDirectQuery = useCallback(async (query: string) => {
        try {
            // Same mock data as search queries
            const mockCompanies = [
                {
                    name: "TechCorp",
                    description: "Leading technology company specializing in cloud solutions and enterprise software",
                    website: "https://techcorp.com",
                    industry: "Technology"
                },
                {
                    name: "InnovateLabs",
                    description: "AI-powered research and development company focused on machine learning solutions",
                    website: "https://innovatelabs.io",
                    industry: "AI"
                },
                {
                    name: "DataFlow Systems",
                    description: "Big data analytics platform helping businesses make data-driven decisions",
                    website: "https://dataflow.com",
                    industry: "Analytics"
                },
                {
                    name: "CloudBridge",
                    description: "Cloud infrastructure provider offering scalable computing solutions",
                    website: "https://cloudbridge.net",
                    industry: "Cloud Computing"
                },
                {
                    name: "SecureNet",
                    description: "Cybersecurity firm providing advanced threat detection and prevention services",
                    website: "https://securenet.com",
                    industry: "Cybersecurity"
                }
            ];

            // Try to find exact or partial matches
            const matchedCompanies = mockCompanies.filter(company => 
                company.name.toLowerCase().includes(query.toLowerCase())
            );

            if (matchedCompanies.length > 0) {
                // Format results for spreadsheet
                const formattedResults = matchedCompanies.slice(0, 5).map((company) => ({
                    company: company.name,
                    description: company.description,
                    webpage: company.website,
                    industry: company.industry
                }));
                
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 300));
                
                populateSpreadsheetWithExaResults(formattedResults);
            } else {
                // Just put the value in the selected cell
                if (selectedCell) {
                    handleCellValueChange(selectedCell, query);
                }
            }
        } catch (error) {
            console.error('Direct query error:', error);
            // Fallback to just setting the value
            if (selectedCell) {
                handleCellValueChange(selectedCell, query);
            }
        }
    }, [selectedCell, handleCellValueChange]);

    // Populate spreadsheet with search results
    const populateSpreadsheetWithResults = useCallback((results: any[]) => {
        if (!results.length) return;

        // Find the next empty row
        let startRow = 0;
        const usedCells = cells.filter(cell => cell.value.trim() !== '');
        if (usedCells.length > 0) {
            startRow = Math.max(...usedCells.map(cell => cell.row)) + 2; // Leave one empty row
        }

        // Ensure we have enough rows
        const neededRows = startRow + results.length + 1;
        if (neededRows > rows) {
            setRows(neededRows);
        }

        // Add headers if starting from empty spreadsheet
        if (startRow === 0) {
            const headers = ['Company Name', 'Description', 'Website', 'Industry', 'Location', 'Employees', 'Founded', 'Source', 'Status'];
            headers.forEach((header, colIndex) => {
                const cellId = `${getColumnHeader(colIndex)}1`;
                handleCellValueChange(cellId, header);
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
                const cellId = `${getColumnHeader(colIndex)}${row + 1}`;
                handleCellValueChange(cellId, value.toString());
            });
        });

        setQueryResults(results);
    }, [cells, rows, getColumnHeader, handleCellValueChange]);

    // Populate spreadsheet with Exa results in specific format: Company | Description | Webpage | Industry
    const populateSpreadsheetWithExaResults = useCallback((results: any[]) => {
        if (!results.length) return;

        // Clear existing data and set headers in row 1
        const headers = ['Company', 'Description', 'Webpage', 'Industry'];
        headers.forEach((header, colIndex) => {
            const cellId = `${getColumnHeader(colIndex)}1`;
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

            data.forEach((value, colIndex) => {
                const cellId = `${getColumnHeader(colIndex)}${row}`;
                handleCellValueChange(cellId, value.toString());
            });
        });

        // Ensure we have enough rows
        const neededRows = results.length + 2; // +1 for header, +1 for buffer
        if (neededRows > rows) {
            setRows(neededRows);
        }

        setQueryResults(results);
    }, [getColumnHeader, handleCellValueChange, rows]);

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

    // Add multiple columns at once
    const addMultipleColumns = useCallback((count: number) => {
        setCols(prev => prev + count);
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

    // Insert column at specific position
    const insertColumnAt = (position: number) => {
        setCols(prev => prev + 1);
        
        // Update existing cells to shift columns after insertion point
        setCells(prev => prev.map(cell => {
            if (cell.col >= position) {
                // Shift cells to the right
                return {
                    ...cell,
                    col: cell.col + 1,
                    id: `${getColumnHeader(cell.col + 1)}${cell.row + 1}`
                };
            }
            return cell;
        }));
        
        console.log(`Inserted column at position ${position} (after ${getColumnHeader(position - 1)})`);
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
            // Mock suggestions that will trigger company searches
            const mockSuggestions = [
                { name: "AI companies", description: "Find artificial intelligence companies", type: "search", category: "industry", priority: "high" },
                { name: "fintech startups", description: "Discover financial technology startups", type: "search", category: "industry", priority: "high" },
                { name: "healthcare technology", description: "Search for healthcare tech companies", type: "search", category: "industry", priority: "medium" },
                { name: "cloud computing", description: "Find cloud infrastructure companies", type: "search", category: "industry", priority: "medium" },
                { name: "cybersecurity firms", description: "Discover cybersecurity companies", type: "search", category: "industry", priority: "high" },
                { name: "green technology", description: "Find sustainable tech companies", type: "search", category: "industry", priority: "medium" },
                { name: "data analytics", description: "Search for data analytics platforms", type: "search", category: "industry", priority: "medium" },
                { name: "e-commerce platforms", description: "Find e-commerce technology companies", type: "search", category: "industry", priority: "low" }
            ];
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            setColumnSuggestions(mockSuggestions);
        } catch (error) {
            console.error('Failed to get column suggestions:', error);
            // Fallback suggestions that will trigger company searches
            setColumnSuggestions([
                { name: "AI companies", description: "Find artificial intelligence companies", type: "search", category: "industry", priority: "high" },
                { name: "fintech startups", description: "Discover financial technology startups", type: "search", category: "industry", priority: "high" },
                { name: "healthcare technology", description: "Search for healthcare tech companies", type: "search", category: "industry", priority: "medium" },
                { name: "cloud computing", description: "Find cloud infrastructure companies", type: "search", category: "industry", priority: "medium" },
                { name: "cybersecurity firms", description: "Discover cybersecurity companies", type: "search", category: "industry", priority: "high" },
                { name: "green technology", description: "Find sustainable tech companies", type: "search", category: "industry", priority: "medium" }
            ]);
        } finally {
            setLoadingSuggestions(false);
        }
    }, [cols, cells, getColumnHeader]);

    // Add columns with suggestions
    const addColumnsWithSuggestions = useCallback(async (count: number) => {
        try {
            // Get suggestions first
            const existingColumns = Array.from({ length: cols }, (_, index) => getColumnHeader(index));
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
    }, [cols, getColumnHeader, addMultipleColumns]);

    // Function to apply a suggestion
    const applySuggestion = useCallback(async (suggestion: any) => {
        addColumns(1);
        setShowSuggestions(false);
        
        // Log the suggestion for debugging
        console.log(`Added column: ${suggestion.name} - ${suggestion.description}`);
        
        // Trigger search with suggestion name to populate spreadsheet
        if (suggestion.name) {
            setIsProcessingQuery(true);
            try {
                // Use the same mock search functionality
                await handleSearchQuery(suggestion.name);
            } catch (error) {
                console.error('Error applying suggestion search:', error);
            } finally {
                setIsProcessingQuery(false);
            }
        }
    }, [addColumns, handleSearchQuery]);

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

            {/* Spreadsheet */}
            <div className="flex-1 overflow-auto">
                <div className="relative">
                    {/* Column Headers */}
                    <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-300">
                        <div className="flex">
                            {/* Corner cell */}
                            <div className="w-12 h-8 border-r border-gray-300 bg-gray-200"></div>
                            
                            {/* Column headers with context menu */}
                            {Array.from({ length: cols }, (_, index) => (
                                <div
                                    key={index}
                                    className="relative w-24 h-8 flex items-center justify-center border-r border-gray-300 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 cursor-pointer group"
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        setSelectedColumn(index);
                                        setShowColumnMenu(true);
                                        setMenuPosition({ x: e.clientX, y: e.clientY });
                                    }}
                                    onClick={() => setSelectedColumn(index)}
                                >
                                    {getColumnHeader(index)}
                                    
                                    {/* Dropdown arrow on hover */}
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedColumn(index);
                                                setShowColumnMenu(true);
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setMenuPosition({ x: rect.left, y: rect.bottom });
                                            }}
                                            className="w-3 h-3 flex items-center justify-center hover:bg-gray-300 rounded"
                                        >
                                            <ChevronDown className="w-2 h-2" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Add Column Button with AI Suggestions */}
                            <div className="relative">
                                <button
                                    onClick={() => getColumnSuggestions()}
                                    className="w-32 h-8 flex items-center justify-center border-r border-gray-300 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-200 transition-colors"
                                    title="Add column with AI suggestions"
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add column
                                </button>
                                
                                {/* AI Suggestions Dropdown */}
                                {showSuggestions && (
                                    <div className="absolute top-8 left-0 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-96 overflow-y-auto">
                                        <div className="p-3 border-b border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium text-gray-900">📊 AI Column Suggestions</h4>
                                                <button
                                                    onClick={() => setShowSuggestions(false)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {loadingSuggestions && (
                                                <div className="text-xs text-gray-500 mt-1">🤖 Getting intelligent suggestions...</div>
                                            )}
                                        </div>
                                        
                                        <div className="max-h-64 overflow-y-auto">
                                            {columnSuggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => applySuggestion(suggestion)}
                                                    className="w-full text-left px-3 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                                >
                                                    <div className="font-medium text-sm text-gray-900">{suggestion.name}</div>
                                                    <div className="text-xs text-gray-600 mt-1">{suggestion.description}</div>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                            suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                            suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {suggestion.priority} priority
                                                        </span>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
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
                                        
                                        <div className="p-2 border-t border-gray-200">
                                            <button
                                                onClick={() => { addColumns(1); setShowSuggestions(false); }}
                                                className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded"
                                            >
                                                ➕ Add blank column
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Rows */}
                    {Array.from({ length: rows }, (_, rowIndex) => (
                        <div key={rowIndex} className="flex">
                            {/* Row header */}
                            <div className="w-12 h-8 flex items-center justify-center border-r border-b border-gray-300 text-xs font-medium text-gray-700 bg-gray-100">
                                {rowIndex + 1}
                            </div>
                            
                            {/* Cells */}
                            {Array.from({ length: cols }, (_, colIndex) => {
                                const cell = getCellByPosition(rowIndex, colIndex);
                                const cellId = `${getColumnHeader(colIndex)}${rowIndex + 1}`;
                                const isSelected = selectedCell === cellId;
                                const isEditing = editingCell === cellId;
                                
                                return (
                                    <div
                                        key={colIndex}
                                        className={`w-24 h-8 border-r border-b border-gray-300 relative ${
                                            isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 
                                            copiedCell && copiedCell.cellId === cellId ? 'ring-2 ring-green-400 bg-green-50' :
                                            'hover:bg-gray-50'
                                        }`}
                                        onClick={() => handleCellClick(cellId)}
                                        onDoubleClick={() => handleCellDoubleClick(cellId)}
                                        onContextMenu={(e) => handleCellRightClick(e, cellId)}
                                    >
                                        {isEditing ? (
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyDown={handleKeyPress}
                                                onBlur={handleEditConfirm}
                                                className="w-full h-full px-1 text-xs border-none outline-none bg-white"
                                            />
                                        ) : (
                                            <div className="w-full h-full px-1 flex items-center text-xs text-gray-900 overflow-hidden">
                                                {cell?.value || ""}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            
                            {/* Empty cell to match add column button */}
                            <div className="w-32 h-8 border-r border-b border-gray-300 bg-gray-50"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                    {/* Row Controls */}
                    <button
                        onClick={() => addRows(1)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
                    >
                        <Plus className="w-3 h-3" />
                        Add row
                    </button>
                    
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
                    
                    <div className="w-px h-6 bg-gray-300 mx-2" />
                    
                    {/* Column Controls */}
                    <button
                        onClick={() => addColumns(1)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
                    >
                        <Plus className="w-3 h-3" />
                        Add column
                    </button>
                    
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
                </div>
                
                <div className="text-xs text-gray-500">
                    {rows} rows × {cols} columns
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
                            Insert column before {getColumnHeader(selectedColumn)}
                        </button>
                        
                        <button
                            onClick={() => {
                                insertColumnAt(selectedColumn! + 1);
                                setShowColumnMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Insert column after {getColumnHeader(selectedColumn)}
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

            {/* Context Menu for Copy/Paste */}
            {showContextMenu && contextMenuCell && (
                <div 
                    className="fixed bg-white border border-gray-300 rounded-md shadow-lg z-50 py-1"
                    style={{ 
                        left: contextMenuPosition.x, 
                        top: contextMenuPosition.y,
                        minWidth: '150px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => {
                            copyCell(contextMenuCell);
                            closeContextMenu();
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                    >
                        📋 Copy (Ctrl+C)
                    </button>
                    <button
                        onClick={() => {
                            pasteCell(contextMenuCell);
                            closeContextMenu();
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                        disabled={!copiedCell}
                    >
                        📥 Paste (Ctrl+V)
                        {copiedCell && (
                            <span className="text-xs text-gray-500 ml-auto">
                                "{copiedCell.value.length > 10 ? copiedCell.value.substring(0, 10) + '...' : copiedCell.value}"
                            </span>
                        )}
                    </button>
                    {copiedCell && (
                        <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
                            Copied from: {copiedCell.cellId}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

SpreadsheetScreen.displayName = "SpreadsheetScreen";
export default SpreadsheetScreen;