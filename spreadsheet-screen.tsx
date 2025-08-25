import React, { useState, useRef, useEffect } from "react";
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
    X
} from "lucide-react";

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
    const [cols, setCols] = useState(10);
    const inputRef = useRef<HTMLInputElement>(null);

    // New state for column suggestions and menus
    const [columnSuggestions, setColumnSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    // Column headers (A, B, C, etc.)
    const getColumnHeader = (index: number): string => {
        let result = '';
        let num = index;
        do {
            result = String.fromCharCode(65 + (num % 26)) + result;
            num = Math.floor(num / 26) - 1;
        } while (num >= 0);
        return result;
    };

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
    const handleCellClick = (cellId: string) => {
        setSelectedCell(cellId);
        setEditingCell(null);
        const cell = cells.find(c => c.id === cellId);
        if (cell) {
            setEditValue(cell.value);
        }
    };

    // Handle cell double click to edit
    const handleCellDoubleClick = (cellId: string) => {
        setEditingCell(cellId);
        const cell = cells.find(c => c.id === cellId);
        if (cell) {
            setEditValue(cell.value);
        }
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    // Handle cell value change
    const handleCellValueChange = (cellId: string, newValue: string) => {
        setCells(prev => prev.map(cell => 
            cell.id === cellId ? { ...cell, value: newValue } : cell
        ));
        setEditValue(newValue);
    };

    // Handle edit confirm
    const handleEditConfirm = () => {
        if (editingCell) {
            handleCellValueChange(editingCell, editValue);
            setEditingCell(null);
        }
    };

    // Handle key press in cell
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleEditConfirm();
        } else if (e.key === 'Escape') {
            setEditingCell(null);
        }
    };

    // Add new row
    const addRows = (count: number) => {
        setRows(prev => prev + count);
    };

    // Add new column
    const addColumns = (count: number) => {
        setCols(prev => prev + count);
    };

    // Add multiple columns at once
    const addMultipleColumns = (count: number) => {
        setCols(prev => prev + count);
        console.log(`Added ${count} columns`);
    };

    // Insert column at specific position
    const insertColumnAt = (position: number) => {
        // Increase total columns
        setCols(prev => prev + 1);
        
        // Shift existing cells to the right
        setCells(prev => {
            const newCells: Cell[] = [];
            
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols + 1; col++) {
                    const cellId = `${getColumnHeader(col)}${row + 1}`;
                    
                    if (col < position) {
                        // Keep cells before insertion point
                        const existingCell = prev.find(c => c.row === row && c.col === col);
                        newCells.push({
                            id: cellId,
                            value: existingCell?.value || "",
                            row,
                            col,
                            isSelected: false,
                            isEditing: false
                        });
                    } else if (col === position) {
                        // Insert new empty column
                        newCells.push({
                            id: cellId,
                            value: "",
                            row,
                            col,
                            isSelected: false,
                            isEditing: false
                        });
                    } else {
                        // Shift existing cells to the right
                        const existingCell = prev.find(c => c.row === row && c.col === col - 1);
                        newCells.push({
                            id: cellId,
                            value: existingCell?.value || "",
                            row,
                            col,
                            isSelected: false,
                            isEditing: false
                        });
                    }
                }
            }
            
            return newCells;
        });
        
        console.log(`Inserted column at position ${position} (after ${getColumnHeader(position - 1)})`);
    };

    // Add column after specific column (by letter)
    const addColumnAfter = (columnLetter: string) => {
        const columnIndex = columnLetter.charCodeAt(0) - 65; // Convert A=0, B=1, etc.
        insertColumnAt(columnIndex + 1);
    };

    // Function to get AI column suggestions
    const getColumnSuggestions = async () => {
        setLoadingSuggestions(true);
        setShowSuggestions(true);
        
        try {
            // Get existing column names
            const existingColumns = Array.from({ length: cols }, (_, index) => getColumnHeader(index));
            
            // Analyze current data for context
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
                    industryHint: "Business/Market Research"
                })
            });
            
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
    };

    // Add columns with suggestions
    const addColumnsWithSuggestions = async (count: number) => {
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
            
            const data = await response.json();
            const suggestions = data.suggestions || [];
            
            // Add the requested number of columns
            addMultipleColumns(count);
            
            // Show suggestions for the new columns
            if (suggestions.length > 0) {
                console.log(`Added ${count} columns. Suggested headers:`, 
                    suggestions.slice(0, count).map(s => s.name).join(', '));
            }
        } catch (error) {
            // Fallback to just adding blank columns
            addMultipleColumns(count);
        }
    };

    // Function to apply a suggestion
    const applySuggestion = (suggestion: any) => {
        addColumns(1);
        setShowSuggestions(false);
        
        // Log the suggestion for debugging
        console.log(`Added column: ${suggestion.name} - ${suggestion.description}`);
    };

    // Get cell by position
    const getCellByPosition = (row: number, col: number) => {
        return cells.find(cell => cell.row === row && cell.col === col);
    };

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

            {/* Formula Bar */}
            <div className="flex items-center px-4 py-2 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-2 mr-4">
                    <span className="text-sm font-medium text-gray-700 w-12">
                        {selectedCell || "A1"}
                    </span>
                    <Type className="w-4 h-4 text-gray-500" />
                </div>
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={handleEditConfirm}
                    className="flex-1 px-2 py-1 text-sm border-none outline-none"
                    placeholder="Enter formula or value..."
                />
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
                                            isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                                        }`}
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
        </div>
    );
};

SpreadsheetScreen.displayName = "SpreadsheetScreen";
export default SpreadsheetScreen;