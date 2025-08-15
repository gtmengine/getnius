"use client"

import React, { useState, useRef, useEffect } from "react";
import {
    Download,
    Building,
    ExternalLink,
    ArrowRight,
    Plus,
    X
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
    const [customColumns, setCustomColumns] = useState<{id: string; name: string}[]>([
        { id: crypto.randomUUID(), name: 'Industry' }
    ]);
    
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

    // Add new custom column
    const handleAddColumn = () => {
        const newId = crypto.randomUUID();
        setCustomColumns(prev => [
            ...prev,
            { id: newId, name: 'New Column' }
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
                
                <div className="flex flex-wrap gap-2">
                    {customColumns.map((column) => (
                        <div key={column.id} className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                            <input
                                ref={(el) => { inputRefs.current[column.id] = el; }}
                                type="text"
                                value={column.name}
                                onChange={(e) => handleColumnNameChange(column.id, e.target.value)}
                                className="bg-transparent outline-none w-32"
                                placeholder="Column name"
                            />
                            <button
                                onClick={() => handleRemoveColumn(column.id)}
                                className="ml-2 text-gray-400 hover:text-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
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
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        checked={selectedCompanies.size === relevantCompanies.length}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300"
                                    />
                                </th>
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
                                    <td className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedCompanies.has(company.id)}
                                            onChange={() => handleSelectCompany(company.id)}
                                            className="rounded border-gray-300"
                                        />
                                    </td>
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
                    Take Action
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

EnrichmentScreen.displayName = "EnrichmentScreen"
export default EnrichmentScreen
