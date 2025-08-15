"use client"

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    Download,
    Building,
    ExternalLink,
    ArrowRight,
    Plus,
    X,
    Sparkles
} from "lucide-react";
import { type Company } from "./lib/search-apis";

interface EnrichmentScreenProps {
    relevantCompanies: Company[];
    setCurrentScreen: (screen: string) => void;
    handleExport: (companies: Company[], customColumns: {id: string; name: string}[]) => void;
}

const EnrichmentScreen: React.FC<EnrichmentScreenProps> = ({
    relevantCompanies,
    setCurrentScreen,
    handleExport
}) => {
    const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
    const [customColumns, setCustomColumns] = useState<{
        id: string;
        name: string;
        prompt: string; // NEW: prompt field
    }[]>([
        {
            id: crypto.randomUUID(),
            name: 'Industry',
            prompt: 'Extract the primary industry from company description' // Default prompt
        }
    ]);

    // Add state for suggestions and loading
    const [suggestions, setSuggestions] = useState<{ name: string; prompt: string }[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    // Fetch suggestions when relevantCompanies change
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (relevantCompanies.length === 0) return;

            setLoadingSuggestions(true);
            try {
                const response = await fetch('/api/generate-suggestions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ companies: relevantCompanies })
                });

                if (!response.ok) throw new Error('Failed to fetch suggestions');

                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                // Fallback to default suggestions
                setSuggestions([
                    { name: "Funding Amount", prompt: "Extract the total funding amount raised" },
                    { name: "Headquarters", prompt: "Extract the company headquarters location" },
                    { name: "Founding Year", prompt: "Extract the year the company was founded" }
                ]);
            } finally {
                setLoadingSuggestions(false);
            }
        };

        // Only fetch if we haven't already
        if (suggestions.length === 0) {
            fetchSuggestions();
        }
    }, [relevantCompanies]);

    // NEW: Add all suggestions as columns
    const addAllSuggestions = useCallback(() => {
        setCustomColumns(prev => {
            const newColumns = suggestions
                .filter(suggestion =>
                    !prev.some(col => col.name === suggestion.name)
                )
                .map(suggestion => ({
                    id: crypto.randomUUID(),
                    name: suggestion.name,
                    prompt: suggestion.prompt
                }));

            return [...prev, ...newColumns];
        });

        // Clear suggestions after adding
        setSuggestions([]);
    }, [suggestions]);
    
    // Ref to track the last added column ID
    const [lastAddedColumnId, setLastAddedColumnId] = useState<string | null>(null);
    // Ref to store input element references
    const inputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

    // Handle column name changes
    const handleColumnNameChange = (columnId: string, newName: string) => {
        setCustomColumns(prev => 
            prev.map(col => col.id === columnId ? { ...col, name: newName } : col)
        );
    };

    
    // Auto-resize function for textareas
    const autoGrow = useCallback((el: HTMLTextAreaElement) => {
        // Always reset to auto to get correct scrollHeight
        el.style.height = 'auto';
        
        if (document.activeElement === el) {
            // When focused, expand to fit content
            el.style.height = el.scrollHeight + 'px';
        } else {
            // When blurred, compress to min-height
            el.style.height = '60px';
        }
    }, []);

    // Handle blur event with transition
    const handleBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
        const el = e.currentTarget;
        
        // Add transition class
        el.classList.add('transition-[height]', 'duration-200', 'ease-out');
        
        // Compress to min-height
        el.style.height = '60px';
        
        // Remove transition class after animation completes
        setTimeout(() => {
            el.classList.remove('transition-[height]', 'duration-200', 'ease-out');
        }, 200);
    }, []);

    // Handle focus event
    const handleFocus = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
        const el = e.currentTarget;
        // Remove transition for instant expansion
        el.classList.remove('transition-[height]', 'duration-200', 'ease-out');
        // Expand to fit content
        autoGrow(el);
    }, [autoGrow]);

    // Ref for textareas
    const textareaRefs = useRef<{[key: string]: HTMLTextAreaElement | null}>({});

    // Setup auto-resize on mount and when customColumns change
    useEffect(() => {
        Object.values(textareaRefs.current).forEach(textarea => {
            if (textarea) {
                autoGrow(textarea);
            }
        });
    }, [customColumns, autoGrow]);

    // Handle prompt changes with auto-resize
    const handleColumnPromptChange = (columnId: string, newPrompt: string) => {
        setCustomColumns(prev => 
            prev.map(col => col.id === columnId ? { ...col, prompt: newPrompt } : col)
        );
        
        // Auto-resize immediately after change
        const textarea = textareaRefs.current[columnId];
        if (textarea) {
            autoGrow(textarea);
        }
    };

    // Add new custom column
    // Update handleAddColumn to include prompt
    const handleAddColumn = () => {
        const newId = crypto.randomUUID();
        setCustomColumns(prev => [
            ...prev,
            { 
                id: newId, 
                name: 'New Column',
                prompt: '' // Empty prompt by default
            }
        ]);
        setLastAddedColumnId(newId);
    };

    // Remove custom column
    const handleRemoveColumn = (columnId: string) => {
        setCustomColumns(prev => prev.filter(col => col.id !== columnId));
    };

    // Focus the input when a new column is added
    useEffect(() => {
        if (lastAddedColumnId && inputRefs.current[lastAddedColumnId]) {
            inputRefs.current[lastAddedColumnId]?.focus();
            // Select all text for easy editing
            inputRefs.current[lastAddedColumnId]?.select();
            setLastAddedColumnId(null);
        }
    }, [lastAddedColumnId, customColumns]);

    // Handle company selection
    const handleSelectCompany = (companyId: string) => {
        setSelectedCompanies(prev => {
            const newSelected = new Set(prev);
            newSelected.has(companyId) 
                ? newSelected.delete(companyId)
                : newSelected.add(companyId);
            return newSelected;
        });
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectedCompanies.size === relevantCompanies.length) {
            setSelectedCompanies(new Set());
        } else {
            setSelectedCompanies(new Set(relevantCompanies.map(c => c.id)));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Enrich Your Market List</h2>
                    <p className="text-gray-600 mt-1">
                        {relevantCompanies.length} companies • {selectedCompanies.size} selected
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => handleExport(relevantCompanies, customColumns)} 
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Custom Columns Header */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <button
                        onClick={handleAddColumn}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Custom Column
                    </button>
                </div>

            {/* NEW: Suggestions Section */}
            {suggestions.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <h3 className="font-medium text-blue-800">AI Suggestions</h3>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                New
                            </span>
                        </div>
                        <button
                            onClick={addAllSuggestions}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add All
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {suggestions.map((suggestion, index) => (
                            <div 
                                key={index} 
                                className="bg-white p-3 rounded-lg border border-blue-200"
                            >
                                <div className="font-medium text-blue-700 mb-1">
                                    {suggestion.name}
                                </div>
                                <p className="text-sm text-gray-600 truncate">
                                    {suggestion.prompt}
                                </p>
                                <button
                                    onClick={() => {
                                        setCustomColumns(prev => [
                                            ...prev,
                                            {
                                                id: crypto.randomUUID(),
                                                name: suggestion.name,
                                                prompt: suggestion.prompt
                                            }
                                        ]);
                                        setSuggestions(prev => 
                                            prev.filter(s => s.name !== suggestion.name))
                                    }}
                                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading state */}
            {loadingSuggestions && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-700">Generating AI suggestions...</span>
                </div>
            )}
                
                {/* Custom columns on a grid*/}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customColumns.map((column) => (
                        <div key={column.id} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                                        Column Name
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            ref={(el) => { 
                                                if (column.id === lastAddedColumnId) {
                                                    inputRefs.current[column.id] = el;
                                                }
                                            }}
                                            type="text"
                                            value={column.name}
                                            onChange={(e) => handleColumnNameChange(column.id, e.target.value)}
                                            className="bg-white border rounded px-2 py-1 w-full text-sm"
                                            placeholder="Column name"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveColumn(column.id)}
                                    className="ml-2 mt-5 text-gray-400 hover:text-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            
                            {/* Auto-resizing textarea */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">
                                    Neural Network Prompt
                                </label>
                                <textarea
                                    ref={(el) => {
                                        textareaRefs.current[column.id] = el;
                                        if (el) {
                                            autoGrow(el);
                                        }
                                    }}
                                    value={column.prompt}
                                    onChange={(e) => handleColumnPromptChange(column.id, e.target.value)}
                                    onInput={(e) => {
                                        if (e.currentTarget) {
                                            autoGrow(e.currentTarget);
                                        }
                                    }}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className="bg-white border rounded px-2 py-1 w-full text-sm min-h-[60px] overflow-hidden resize-none"
                                    placeholder="Describe what data to extract: Extract funding amount from description"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        checked={selectedCompanies.size === relevantCompanies.length}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300"
                                    />
                                </th> */}
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-64">
                                    Company
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-96">
                                    Description
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">
                                    Webpage
                                </th>
                                {customColumns.map(column => (
                                    <th 
                                        key={column.id} 
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48"
                                    >
                                        {column.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {relevantCompanies.map((company) => (
                                <tr key={company.id} className="hover:bg-gray-50">
                                    {/* <td className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedCompanies.has(company.id)}
                                            onChange={() => handleSelectCompany(company.id)}
                                            className="rounded border-gray-300"
                                        />
                                    </td> */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            {company.logo ? (
                                                <img
                                                    src={company.logo}
                                                    alt={company.name}
                                                    className="w-8 h-8 rounded"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "";
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : null}
                                            
                                            {/* Always show the generic icon */}
                                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                                <Building className="w-4 h-4 text-gray-400" />
                                            </div>
                                            
                                            <div className="text-sm font-medium text-gray-900">
                                                {company.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900 max-w-md">
                                        {company.description || "—"}
                                    </td>
                                    <td className="px-4 py-4">
                                        {company.website ? (
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Visit
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    
                                    {/* Custom Columns Data - show dash */}
                                    {customColumns.map(column => (
                                        <td 
                                            key={`${company.id}-${column.id}`} 
                                            className="px-4 py-4 text-sm text-gray-500"
                                        >
                                            —
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={() => setCurrentScreen("search")}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to Search
                </button>
                <button
                    onClick={() => setCurrentScreen("action")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    Send for Enrichment
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

EnrichmentScreen.displayName = "EnrichmentScreen"
export default EnrichmentScreen
