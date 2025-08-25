"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
    Plus, MoreHorizontal, Undo, Redo, Share, MessageSquare, ChevronDown, Grid3x3, 
    Type, Palette, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
    ArrowLeft, X, Save, Download, Upload, Filter, Sort, Search, 
    Calculator, TrendingUp, PieChart, BarChart3, Eye, EyeOff,
    Copy, Clipboard, Cut, RotateCcw, ZoomIn, ZoomOut, Maximize2,
    FileText, Hash, Calendar, Link, Mail, Phone, DollarSign, Percent
} from 'lucide-react';

interface Cell {
    id: string;
    value: string;
    row: number;
    col: number;
    isSelected: boolean;
    isEditing: boolean;
    formula?: string;
    type?: 'text' | 'number' | 'date' | 'currency' | 'percentage' | 'email' | 'url' | 'phone';
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderlined?: boolean;
    alignment?: 'left' | 'center' | 'right';
    isLocked?: boolean;
    validation?: {
        type: 'range' | 'list' | 'custom';
        rule: string;
        message?: string;
    };
}

interface ColumnSuggestion {
    name: string;
    description: string;
    type: "text" | "number" | "date" | "url" | "email" | "currency" | "percentage" | "phone";
    category: "basic" | "financial" | "contact" | "social" | "operational" | "market" | "analytics";
    priority: "high" | "medium" | "low";
    icon?: string;
    example?: string;
}

interface EnhancedSpreadsheetScreenProps {
    setCurrentScreen: (screen: string) => void;
    initialData?: any[];
}

const EnhancedSpreadsheetScreen: React.FC<EnhancedSpreadsheetScreenProps> = ({
    setCurrentScreen,
    initialData = []
}) => {
    // State management
    const [cells, setCells] = useState<Cell[]>([]);
    const [selectedCell, setSelectedCell] = useState<string | null>(null);
    const [selectedRange, setSelectedRange] = useState<string[]>([]);
    const [editingCell, setEditingCell] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [rows, setRows] = useState(30);
    const [cols, setCols] = useState(15);
    const [zoom, setZoom] = useState(100);
    const [showGrid, setShowGrid] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    // AI and suggestions
    const [columnSuggestions, setColumnSuggestions] = useState<ColumnSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    // Formatting and tools
    const [showFormatMenu, setShowFormatMenu] = useState(false);
    const [showCellTypeMenu, setShowCellTypeMenu] = useState(false);
    const [clipboard, setClipboard] = useState<Cell[]>([]);
    const [history, setHistory] = useState<Cell[][]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isFilterMode, setIsFilterMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAnalytics, setShowAnalytics] = useState(false);

    // Advanced features
    const [frozenRows, setFrozenRows] = useState(0);
    const [frozenCols, setFrozenCols] = useState(0);
    const [showFormulas, setShowFormulas] = useState(false);
    const [protectedCells, setProtectedCells] = useState<Set<string>>(new Set());

    // Helper functions
    const getColumnHeader = (index: number): string => {
        let result = '';
        while (index >= 0) {
            result = String.fromCharCode(65 + (index % 26)) + result;
            index = Math.floor(index / 26) - 1;
        }
        return result;
    };

    // Initialize cells
    useEffect(() => {
        const newCells: Cell[] = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cellId = `${getColumnHeader(col)}${row + 1}`;
                
                // Load initial data if available
                let initialValue = "";
                if (initialData && initialData[row] && col < Object.keys(initialData[row]).length) {
                    const keys = Object.keys(initialData[row]);
                    initialValue = initialData[row][keys[col]]?.toString() || "";
                }
                
                newCells.push({
                    id: cellId,
                    value: initialValue,
                    row,
                    col,
                    isSelected: false,
                    isEditing: false,
                    type: 'text',
                    backgroundColor: '#ffffff',
                    textColor: '#000000',
                    fontSize: 12,
                    isBold: false,
                    isItalic: false,
                    isUnderlined: false,
                    alignment: 'left',
                    isLocked: false
                });
            }
        }
        setCells(newCells);
    }, [rows, cols, initialData]);

    // Cell interaction handlers
    const handleCellClick = (cellId: string) => {
        setSelectedCell(cellId);
        setSelectedRange([cellId]);
        setEditingCell(null);
        const cell = cells.find(c => c.id === cellId);
        if (cell) {
            setEditValue(showFormulas && cell.formula ? cell.formula : cell.value);
        }
    };

    const handleCellDoubleClick = (cellId: string) => {
        if (protectedCells.has(cellId)) return;
        setEditingCell(cellId);
        const cell = cells.find(c => c.id === cellId);
        if (cell) {
            setEditValue(showFormulas && cell.formula ? cell.formula : cell.value);
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    };

    const handleEditConfirm = () => {
        if (editingCell && editValue !== undefined) {
            // Save to history for undo/redo
            setHistory(prev => [...prev.slice(0, historyIndex + 1), [...cells]]);
            setHistoryIndex(prev => prev + 1);

            setCells(prev => prev.map(cell => 
                cell.id === editingCell 
                    ? { 
                        ...cell, 
                        value: editValue,
                        formula: editValue.startsWith('=') ? editValue : undefined
                    }
                    : cell
            ));
        }
        setEditingCell(null);
        setEditValue("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleEditConfirm();
        } else if (e.key === 'Escape') {
            setEditingCell(null);
            setEditValue("");
        }
    };

    // Column and row management
    const addRows = (count: number) => {
        setRows(prev => prev + count);
    };

    const addColumns = (count: number) => {
        setCols(prev => prev + count);
    };

    const addMultipleColumns = (count: number) => {
        setCols(prev => prev + count);
        console.log(`Added ${count} columns`);
    };

    const insertColumnAt = (position: number) => {
        setCols(prev => prev + 1);
        
        setCells(prev => {
            const newCells: Cell[] = [];
            
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols + 1; col++) {
                    const cellId = `${getColumnHeader(col)}${row + 1}`;
                    
                    if (col < position) {
                        const existingCell = prev.find(c => c.row === row && c.col === col);
                        newCells.push({
                            id: cellId,
                            value: existingCell?.value || "",
                            row,
                            col,
                            isSelected: false,
                            isEditing: false,
                            type: existingCell?.type || 'text',
                            backgroundColor: existingCell?.backgroundColor || '#ffffff',
                            textColor: existingCell?.textColor || '#000000',
                            fontSize: existingCell?.fontSize || 12,
                            isBold: existingCell?.isBold || false,
                            isItalic: existingCell?.isItalic || false,
                            isUnderlined: existingCell?.isUnderlined || false,
                            alignment: existingCell?.alignment || 'left',
                            isLocked: existingCell?.isLocked || false
                        });
                    } else if (col === position) {
                        newCells.push({
                            id: cellId,
                            value: "",
                            row,
                            col,
                            isSelected: false,
                            isEditing: false,
                            type: 'text',
                            backgroundColor: '#ffffff',
                            textColor: '#000000',
                            fontSize: 12,
                            isBold: false,
                            isItalic: false,
                            isUnderlined: false,
                            alignment: 'left',
                            isLocked: false
                        });
                    } else {
                        const existingCell = prev.find(c => c.row === row && c.col === col - 1);
                        newCells.push({
                            id: cellId,
                            value: existingCell?.value || "",
                            row,
                            col,
                            isSelected: false,
                            isEditing: false,
                            type: existingCell?.type || 'text',
                            backgroundColor: existingCell?.backgroundColor || '#ffffff',
                            textColor: existingCell?.textColor || '#000000',
                            fontSize: existingCell?.fontSize || 12,
                            isBold: existingCell?.isBold || false,
                            isItalic: existingCell?.isItalic || false,
                            isUnderlined: existingCell?.isUnderlined || false,
                            alignment: existingCell?.alignment || 'left',
                            isLocked: existingCell?.isLocked || false
                        });
                    }
                }
            }
            
            return newCells;
        });
        
        console.log(`Inserted column at position ${position}`);
    };

    const addColumnAfter = (columnLetter: string) => {
        const columnIndex = columnLetter.charCodeAt(0) - 65;
        insertColumnAt(columnIndex + 1);
    };

    // AI Column Suggestions
    const getColumnSuggestions = async () => {
        setLoadingSuggestions(true);
        setShowSuggestions(true);
        
        try {
            const existingColumns = Array.from({ length: cols }, (_, index) => getColumnHeader(index));
            
            const dataContext = cells
                .filter(cell => cell.value)
                .slice(0, 20)
                .map(cell => cell.value)
                .join(", ");
                
            const response = await fetch('/api/column-suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    existingColumns,
                    dataContext,
                    industryHint: "Business Intelligence & Analytics"
                })
            });
            
            const data = await response.json();
            setColumnSuggestions(data.suggestions || getEnhancedFallbackSuggestions());
        } catch (error) {
            console.error('Failed to get column suggestions:', error);
            setColumnSuggestions(getEnhancedFallbackSuggestions());
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const getEnhancedFallbackSuggestions = (): ColumnSuggestion[] => [
        { name: "Revenue Growth", description: "Year-over-year revenue growth percentage", type: "percentage", category: "financial", priority: "high", icon: "📈", example: "25%" },
        { name: "Market Cap", description: "Current market capitalization", type: "currency", category: "financial", priority: "high", icon: "💰", example: "$1.2B" },
        { name: "CEO Contact", description: "Chief Executive Officer email", type: "email", category: "contact", priority: "high", icon: "👨‍💼", example: "ceo@company.com" },
        { name: "Headcount", description: "Total number of employees", type: "number", category: "operational", priority: "high", icon: "👥", example: "1,250" },
        { name: "Founded Date", description: "Company founding date", type: "date", category: "basic", priority: "medium", icon: "📅", example: "2010-05-15" },
        { name: "Website", description: "Company website URL", type: "url", category: "basic", priority: "medium", icon: "🌐", example: "https://company.com" },
        { name: "Phone", description: "Main company phone number", type: "phone", category: "contact", priority: "medium", icon: "📞", example: "+1-555-0123" },
        { name: "Profit Margin", description: "Net profit margin percentage", type: "percentage", category: "financial", priority: "high", icon: "📊", example: "15.5%" },
        { name: "Market Share", description: "Market share in primary industry", type: "percentage", category: "market", priority: "high", icon: "🎯", example: "8.2%" },
        { name: "Risk Score", description: "Investment risk assessment score", type: "number", category: "analytics", priority: "medium", icon: "⚠️", example: "7.5" }
    ];

    const addColumnsWithSuggestions = async (count: number) => {
        try {
            await getColumnSuggestions();
            addMultipleColumns(count);
        } catch (error) {
            addMultipleColumns(count);
        }
    };

    const applySuggestion = (suggestion: ColumnSuggestion) => {
        addColumns(1);
        setShowSuggestions(false);
        
        // Apply the suggestion type to the new column
        const newColIndex = cols;
        const headerCell = cells.find(c => c.row === 0 && c.col === newColIndex);
        if (headerCell) {
            setCells(prev => prev.map(cell => 
                cell.id === headerCell.id 
                    ? { ...cell, value: suggestion.name, type: suggestion.type }
                    : cell
            ));
        }
        
        console.log(`Added column: ${suggestion.name} (${suggestion.type}) - ${suggestion.description}`);
    };

    // Formatting functions
    const formatSelectedCells = (format: Partial<Cell>) => {
        if (selectedRange.length === 0) return;
        
        setCells(prev => prev.map(cell => 
            selectedRange.includes(cell.id) ? { ...cell, ...format } : cell
        ));
    };

    const setCellType = (type: Cell['type']) => {
        if (selectedRange.length === 0) return;
        
        setCells(prev => prev.map(cell => 
            selectedRange.includes(cell.id) ? { ...cell, type } : cell
        ));
    };

    // Copy/Paste functionality
    const copyCells = () => {
        const selectedCells = cells.filter(cell => selectedRange.includes(cell.id));
        setClipboard(selectedCells);
    };

    const pasteCells = () => {
        if (clipboard.length === 0 || !selectedCell) return;
        
        const targetCell = cells.find(c => c.id === selectedCell);
        if (!targetCell) return;
        
        const startRow = targetCell.row;
        const startCol = targetCell.col;
        
        setCells(prev => {
            const newCells = [...prev];
            clipboard.forEach(clipCell => {
                const newRow = startRow + clipCell.row - clipboard[0].row;
                const newCol = startCol + clipCell.col - clipboard[0].col;
                const targetIndex = newCells.findIndex(c => c.row === newRow && c.col === newCol);
                
                if (targetIndex !== -1 && newRow < rows && newCol < cols) {
                    newCells[targetIndex] = {
                        ...newCells[targetIndex],
                        value: clipCell.value,
                        type: clipCell.type,
                        backgroundColor: clipCell.backgroundColor,
                        textColor: clipCell.textColor,
                        fontSize: clipCell.fontSize,
                        isBold: clipCell.isBold,
                        isItalic: clipCell.isItalic,
                        isUnderlined: clipCell.isUnderlined,
                        alignment: clipCell.alignment
                    };
                }
            });
            return newCells;
        });
    };

    // Undo/Redo functionality
    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            setCells(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
            setCells(history[historyIndex + 1]);
        }
    };

    // Export functionality
    const exportToCSV = () => {
        const csvContent = Array.from({ length: rows }, (_, rowIndex) => 
            Array.from({ length: cols }, (_, colIndex) => {
                const cell = cells.find(c => c.row === rowIndex && c.col === colIndex);
                return cell?.value || "";
            }).join(",")
        ).join("\n");
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'getnius-spreadsheet.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Get cell by position
    const getCellByPosition = (row: number, col: number) => {
        return cells.find(cell => cell.row === row && cell.col === col);
    };

    // Cell type icons
    const getCellTypeIcon = (type: Cell['type']) => {
        switch (type) {
            case 'number': return <Hash className="w-3 h-3" />;
            case 'currency': return <DollarSign className="w-3 h-3" />;
            case 'percentage': return <Percent className="w-3 h-3" />;
            case 'date': return <Calendar className="w-3 h-3" />;
            case 'email': return <Mail className="w-3 h-3" />;
            case 'phone': return <Phone className="w-3 h-3" />;
            case 'url': return <Link className="w-3 h-3" />;
            default: return <FileText className="w-3 h-3" />;
        }
    };

    return (
        <div className="h-screen bg-white flex flex-col">
            {/* Enhanced Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCurrentScreen("action")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="flex items-center gap-2">
                        <Grid3x3 className="w-6 h-6 text-blue-600" />
                        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Enhanced Getnius Spreadsheet
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                            AI-Powered
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowAnalytics(!showAnalytics)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1 transition-colors"
                    >
                        <TrendingUp className="w-4 h-4" />
                        Analytics
                    </button>
                    <button 
                        onClick={exportToCSV}
                        className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 flex items-center gap-1 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 transition-colors">
                        <Share className="w-4 h-4" />
                        Share
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        AI Chat
                    </button>
                </div>
            </div>

            {/* Enhanced Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200 bg-gray-50">
                {/* Undo/Redo */}
                <button 
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Undo className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Redo className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                {/* Copy/Paste */}
                <button onClick={copyCells} className="p-1 hover:bg-gray-200 rounded" title="Copy">
                    <Copy className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={pasteCells} className="p-1 hover:bg-gray-200 rounded" title="Paste">
                    <Clipboard className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                {/* Font controls */}
                <select className="px-2 py-1 text-sm border border-gray-300 rounded">
                    <option>Arial</option>
                    <option>Times New Roman</option>
                    <option>Courier New</option>
                    <option>Helvetica</option>
                </select>
                
                <select className="px-2 py-1 text-sm border border-gray-300 rounded ml-1">
                    <option>10</option>
                    <option>12</option>
                    <option>14</option>
                    <option>16</option>
                    <option>18</option>
                </select>
                
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                {/* Text formatting */}
                <button 
                    onClick={() => formatSelectedCells({ isBold: true })}
                    className="p-1 hover:bg-gray-200 rounded"
                >
                    <Bold className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                    onClick={() => formatSelectedCells({ isItalic: true })}
                    className="p-1 hover:bg-gray-200 rounded"
                >
                    <Italic className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                    onClick={() => formatSelectedCells({ isUnderlined: true })}
                    className="p-1 hover:bg-gray-200 rounded"
                >
                    <Underline className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                {/* Alignment */}
                <button 
                    onClick={() => formatSelectedCells({ alignment: 'left' })}
                    className="p-1 hover:bg-gray-200 rounded"
                >
                    <AlignLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                    onClick={() => formatSelectedCells({ alignment: 'center' })}
                    className="p-1 hover:bg-gray-200 rounded"
                >
                    <AlignCenter className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                    onClick={() => formatSelectedCells({ alignment: 'right' })}
                    className="p-1 hover:bg-gray-200 rounded"
                >
                    <AlignRight className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                {/* Cell type dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowCellTypeMenu(!showCellTypeMenu)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
                    >
                        {getCellTypeIcon('text')}
                        Text
                        <ChevronDown className="w-3 h-3" />
                    </button>
                    
                    {showCellTypeMenu && (
                        <div className="absolute top-8 left-0 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-20">
                            {[
                                { type: 'text' as const, label: 'Text', icon: <FileText className="w-4 h-4" /> },
                                { type: 'number' as const, label: 'Number', icon: <Hash className="w-4 h-4" /> },
                                { type: 'currency' as const, label: 'Currency', icon: <DollarSign className="w-4 h-4" /> },
                                { type: 'percentage' as const, label: 'Percentage', icon: <Percent className="w-4 h-4" /> },
                                { type: 'date' as const, label: 'Date', icon: <Calendar className="w-4 h-4" /> },
                                { type: 'email' as const, label: 'Email', icon: <Mail className="w-4 h-4" /> },
                                { type: 'phone' as const, label: 'Phone', icon: <Phone className="w-4 h-4" /> },
                                { type: 'url' as const, label: 'URL', icon: <Link className="w-4 h-4" /> }
                            ].map(({ type, label, icon }) => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setCellType(type);
                                        setShowCellTypeMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                >
                                    {icon}
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                {/* View options */}
                <button 
                    onClick={() => setShowFormulas(!showFormulas)}
                    className={`p-1 hover:bg-gray-200 rounded ${showFormulas ? 'bg-blue-100' : ''}`}
                    title="Show formulas"
                >
                    <Calculator className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                    onClick={() => setShowGrid(!showGrid)}
                    className={`p-1 hover:bg-gray-200 rounded ${showGrid ? 'bg-blue-100' : ''}`}
                    title="Toggle grid"
                >
                    {showGrid ? <Eye className="w-4 h-4 text-gray-600" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                {/* Zoom controls */}
                <button 
                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Zoom in"
                >
                    <ZoomIn className="w-4 h-4 text-gray-600" />
                </button>
                <span className="text-xs text-gray-600 px-2">{zoom}%</span>
                <button 
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Zoom out"
                >
                    <ZoomOut className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="flex-1" />
                
                {/* Search */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded w-32"
                        />
                    </div>
                </div>
            </div>

            {/* Enhanced Formula Bar */}
            <div className="flex items-center px-4 py-2 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-2 mr-4">
                    <span className="text-sm font-medium text-gray-700 w-16 bg-gray-50 px-2 py-1 rounded border">
                        {selectedCell || "A1"}
                    </span>
                    <Type className="w-4 h-4 text-gray-500" />
                    {selectedCell && cells.find(c => c.id === selectedCell)?.type && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {cells.find(c => c.id === selectedCell)?.type}
                        </span>
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={handleEditConfirm}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter formula or value..."
                />
            </div>

            {/* Analytics Panel */}
            {showAnalytics && (
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <PieChart className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Cells with data: {cells.filter(c => c.value).length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">Columns: {cols}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium">Rows: {rows}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium">Formulas: {cells.filter(c => c.formula).length}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Spreadsheet */}
            <div className="flex-1 overflow-auto" style={{ fontSize: `${zoom}%` }}>
                <div className="relative">
                    {/* Column Headers */}
                    <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-300">
                        <div className="flex">
                            {/* Corner cell */}
                            <div className="w-12 h-8 border-r border-gray-300 bg-gray-200 flex items-center justify-center">
                                <Maximize2 className="w-3 h-3 text-gray-500" />
                            </div>
                            
                            {/* Enhanced column headers */}
                            {Array.from({ length: cols }, (_, index) => (
                                <div
                                    key={index}
                                    className="relative w-24 h-8 flex items-center justify-center border-r border-gray-300 text-xs font-bold text-gray-700 bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 cursor-pointer group transition-colors"
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        setSelectedColumn(index);
                                        setShowColumnMenu(true);
                                        setMenuPosition({ x: e.clientX, y: e.clientY });
                                    }}
                                    onClick={() => setSelectedColumn(index)}
                                >
                                    {getColumnHeader(index)}
                                    
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
                                            className="w-4 h-4 flex items-center justify-center hover:bg-gray-400 rounded transition-colors"
                                        >
                                            <ChevronDown className="w-2 h-2" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Enhanced Add Column Button */}
                            <div className="relative">
                                <button
                                    onClick={() => getColumnSuggestions()}
                                    className="w-40 h-8 flex items-center justify-center border-r border-gray-300 text-xs font-medium text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors"
                                    title="Add intelligent column with AI suggestions"
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    🤖 Add AI Column
                                </button>
                                
                                {/* Enhanced AI Suggestions Dropdown */}
                                {showSuggestions && (
                                    <div className="absolute top-8 left-0 w-96 bg-white border border-gray-300 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
                                        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                    🤖 AI Column Suggestions
                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                                        Enhanced
                                                    </span>
                                                </h4>
                                                <button
                                                    onClick={() => setShowSuggestions(false)}
                                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {loadingSuggestions && (
                                                <div className="text-xs text-blue-600 mt-2 flex items-center gap-2">
                                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                                    Generating intelligent suggestions...
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="max-h-80 overflow-y-auto">
                                            {columnSuggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => applySuggestion(suggestion)}
                                                    className="w-full text-left px-4 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-b border-gray-100 last:border-b-0 transition-colors group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="text-lg">{suggestion.icon}</div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 transition-colors">
                                                                {suggestion.name}
                                                            </div>
                                                            <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                                {suggestion.description}
                                                            </div>
                                                            {suggestion.example && (
                                                                <div className="text-xs text-blue-600 mt-1 italic">
                                                                    Example: {suggestion.example}
                                                                </div>
                                                            )}
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
                                                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                                                    {suggestion.type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        
                                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                                            <button
                                                onClick={() => {
                                                    addColumns(1);
                                                    setShowSuggestions(false);
                                                }}
                                                className="w-full text-center py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                            >
                                                + Add blank column instead
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Rows and Cells */}
                    <div className="relative">
                        {Array.from({ length: rows }, (_, rowIndex) => (
                            <div key={rowIndex} className="flex">
                                {/* Row header */}
                                <div className="w-12 h-8 border-r border-b border-gray-300 bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
                                    {rowIndex + 1}
                                </div>
                                
                                {/* Enhanced cells */}
                                {Array.from({ length: cols }, (_, colIndex) => {
                                    const cell = getCellByPosition(rowIndex, colIndex);
                                    const cellId = `${getColumnHeader(colIndex)}${rowIndex + 1}`;
                                    const isSelected = selectedCell === cellId || selectedRange.includes(cellId);
                                    const isEditing = editingCell === cellId;
                                    const isProtected = protectedCells.has(cellId);
                                    const matchesSearch = searchTerm && cell?.value.toLowerCase().includes(searchTerm.toLowerCase());
                                    
                                    return (
                                        <div
                                            key={cellId}
                                            className={`relative w-24 h-8 border-r border-b text-xs cursor-cell flex items-center px-1 transition-colors ${
                                                showGrid ? 'border-gray-300' : 'border-transparent'
                                            } ${
                                                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 
                                                matchesSearch ? 'bg-yellow-100' :
                                                isProtected ? 'bg-red-50' :
                                                'bg-white hover:bg-gray-50'
                                            } ${
                                                cell?.isBold ? 'font-bold' : ''
                                            } ${
                                                cell?.isItalic ? 'italic' : ''
                                            } ${
                                                cell?.isUnderlined ? 'underline' : ''
                                            }`}
                                            style={{
                                                backgroundColor: isSelected ? undefined : cell?.backgroundColor,
                                                color: cell?.textColor,
                                                textAlign: cell?.alignment || 'left',
                                                fontSize: cell?.fontSize ? `${cell.fontSize}px` : undefined
                                            }}
                                            onClick={() => handleCellClick(cellId)}
                                            onDoubleClick={() => handleCellDoubleClick(cellId)}
                                        >
                                            {isEditing ? (
                                                <input
                                                    ref={inputRef}
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onKeyDown={handleKeyPress}
                                                    onBlur={handleEditConfirm}
                                                    className="w-full h-full bg-transparent border-none outline-none text-xs"
                                                    autoFocus
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center">
                                                    {cell?.type && cell.type !== 'text' && (
                                                        <span className="mr-1 opacity-60">
                                                            {getCellTypeIcon(cell.type)}
                                                        </span>
                                                    )}
                                                    <span className="flex-1 truncate">
                                                        {showFormulas && cell?.formula ? cell.formula : cell?.value || ""}
                                                    </span>
                                                    {isProtected && (
                                                        <span className="ml-1 opacity-60">🔒</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Enhanced Bottom Controls */}
            <div className="border-t border-gray-200 px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Basic controls */}
                        <button
                            onClick={() => addRows(5)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs text-green-600 hover:bg-green-100 rounded-md font-medium transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                            Add 5 rows
                        </button>
                        
                        <button
                            onClick={() => addColumns(1)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-100 rounded-md font-medium transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                            Add column
                        </button>
                        
                        <div className="w-px h-6 bg-gray-300" />
                        
                        {/* Bulk operations */}
                        <button
                            onClick={() => addMultipleColumns(3)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs text-purple-600 hover:bg-purple-100 rounded-md font-medium transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                            Add 3 columns
                        </button>
                        
                        <button
                            onClick={() => addColumnsWithSuggestions(5)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs text-orange-600 hover:bg-orange-100 rounded-md font-medium transition-colors"
                        >
                            🤖 <Plus className="w-3 h-3" />
                            Add 5 AI columns
                        </button>
                        
                        <div className="w-px h-6 bg-gray-300" />
                        
                        {/* Special actions */}
                        <button
                            onClick={() => addColumnAfter('J')}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-100 rounded-md font-medium transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                            Add after column J
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                            <Grid3x3 className="w-3 h-3" />
                            {rows} × {cols} cells
                        </span>
                        <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {cells.filter(c => c.value).length} with data
                        </span>
                        <span className="flex items-center gap-1">
                            <Calculator className="w-3 h-3" />
                            {cells.filter(c => c.formula).length} formulas
                        </span>
                        {selectedRange.length > 1 && (
                            <span className="flex items-center gap-1 text-blue-600 font-medium">
                                <span>📋</span>
                                {selectedRange.length} selected
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Column Context Menu */}
            {showColumnMenu && selectedColumn !== null && (
                <>
                    <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowColumnMenu(false)}
                    />
                    
                    <div 
                        className="fixed bg-white border border-gray-300 rounded-lg shadow-xl z-20 py-2 min-w-64"
                        style={{ 
                            left: menuPosition.x, 
                            top: menuPosition.y,
                            transform: 'translateY(-100%)' 
                        }}
                    >
                        <div className="px-3 py-2 border-b border-gray-200">
                            <h4 className="text-sm font-bold text-gray-900">
                                Column {getColumnHeader(selectedColumn)} Options
                            </h4>
                        </div>
                        
                        <button
                            onClick={() => {
                                insertColumnAt(selectedColumn!);
                                setShowColumnMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4 text-blue-600" />
                            Insert column before {getColumnHeader(selectedColumn)}
                        </button>
                        
                        <button
                            onClick={() => {
                                insertColumnAt(selectedColumn! + 1);
                                setShowColumnMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4 text-blue-600" />
                            Insert column after {getColumnHeader(selectedColumn)}
                        </button>
                        
                        <div className="border-t border-gray-200 my-1" />
                        
                        <button
                            onClick={() => {
                                getColumnSuggestions();
                                setShowColumnMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors"
                        >
                            🤖 AI Column Suggestions
                        </button>
                        
                        {selectedColumn === 9 && (
                            <div className="border-t border-gray-200 mt-1 pt-1">
                                <button
                                    onClick={() => {
                                        addColumnAfter('J');
                                        setShowColumnMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-green-50 text-green-600 font-medium flex items-center gap-2 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add column after column J ⭐
                                </button>
                            </div>
                        )}
                        
                        <div className="border-t border-gray-200 mt-1 pt-1">
                            <button
                                onClick={() => {
                                    // Format entire column
                                    const columnCells = cells.filter(c => c.col === selectedColumn).map(c => c.id);
                                    setSelectedRange(columnCells);
                                    setShowColumnMenu(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                            >
                                <Palette className="w-4 h-4 text-gray-600" />
                                Format column
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

EnhancedSpreadsheetScreen.displayName = "EnhancedSpreadsheetScreen";
export default EnhancedSpreadsheetScreen;
