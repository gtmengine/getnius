"use client"

import React, { useState, useMemo } from 'react';
import { Plus, Info } from 'lucide-react';

interface ColumnSelectorProps {
  availableColumns?: string[];
  suggestedColumns?: string[];
  selectedColumns?: string[];
  onChange?: (selected: string[]) => void;
  columnReasons?: Record<string, string>;
  // External deps
  selectedCompanies: Set<string>;
  relevantCompanies: any[]; // Or use your Company type
  handleSelectAll: () => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ 
  availableColumns = [
    'Company Name', 
    'Industry', 
    'Revenue', 
    'Employee Count', 
    'Location', 
    'Founded Year',
    'Website',
    'LinkedIn',
    'Technology Stack',
    'Funding Stage',
    'Market Cap',
    'Growth Rate'
  ],
  suggestedColumns = [
    'Description',
    'Phone Number',
    'CEO Name',
    'Headquarters',
    'Company Size',
    'Business Model'
  ],
  selectedColumns = ['Company Name', 'Industry'], 
  onChange = (selected) => console.log('Selected:', selected),
  columnReasons = {},

  // External deps
  selectedCompanies,
  relevantCompanies,
  handleSelectAll
}) => {
  const [internalSelected, setInternalSelected] = useState(selectedColumns);
  
  const handleToggleColumn = (column: string) => {
    const newSelected = internalSelected.includes(column)
      ? internalSelected.filter(col => col !== column)
      : [...internalSelected, column];
    
    setInternalSelected(newSelected);
    onChange(newSelected);
  };

  const handleAddCustom = () => {
    const customName = window.prompt('Enter custom column name:');
    if (customName && customName.trim()) {
      const trimmedName = customName.trim();
      if (!internalSelected.includes(trimmedName) && 
          !availableColumns.includes(trimmedName) && 
          !suggestedColumns.includes(trimmedName)) {
        const newSelected = [...internalSelected, trimmedName];
        setInternalSelected(newSelected);
        onChange(newSelected);
      } else {
        alert('Column name already exists');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: string, column: string | null = null) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (action === 'toggle' && column) {
        handleToggleColumn(column);
      } else if (action === 'addCustom') {
        handleAddCustom();
      }
    }
  };

  // Create display order: selected first, then unselected available, then custom, then suggestions
  const selectedAvailable = availableColumns.filter(col => internalSelected.includes(col));
  const unselectedAvailable = availableColumns.filter(col => !internalSelected.includes(col));
  const unselectedSuggestions = suggestedColumns.filter(col => !internalSelected.includes(col));
  const customColumns = internalSelected.filter(col => 
    !availableColumns.includes(col) && !suggestedColumns.includes(col)
  );
  
const allDisplayColumns = useMemo(() => {
  // Combine all possible columns
  const allPossible = [...availableColumns, ...suggestedColumns];
  
  // Remove duplicates while preserving order
  const uniqueColumns = allPossible.filter(
    (item, index) => allPossible.indexOf(item) === index
  );
  
  // Create display order
  return uniqueColumns.sort((a, b) => {
    const aSelected = internalSelected.includes(a);
    const bSelected = internalSelected.includes(b);
    
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    
    // Keep original order for same selection status
    return allPossible.indexOf(a) - allPossible.indexOf(b);
  });
}, [availableColumns, suggestedColumns, internalSelected]);

  return (
    <thead className="bg-gray-50">
      <tr>
        {/* Row selector header */}
        <th className="sticky left-0 z-30 w-16 h-10 border-t border-b border-l border-r border-gray-200 bg-gray-100 text-center shadow-sm">
          <input
            type="checkbox"
            checked={selectedCompanies.size === relevantCompanies.length && relevantCompanies.length > 0}
            onChange={handleSelectAll}
            className="rounded border-gray-300"
          />
        </th>
        
        {/* Company header */}
        <th 
          className="sticky left-16 z-30 min-w-64 h-10 border-t border-b border-r border-gray-200 bg-gray-100 text-center shadow-sm"
        >
          <span className="text-xs text-gray-500">Company</span>
        </th>
        {/* Source header */}
        <th 
          className="w-32 h-10 border-t border-b border-r border-gray-200 bg-gray-100 text-center"
        >
          <span className="text-xs text-gray-500">Source</span>
        </th>

        {/* Column headers */}
        {allDisplayColumns.map((column, index) => {
          const isSelected = internalSelected.includes(column);
          const isSuggestion = suggestedColumns.includes(column) && !isSelected;
          const isAvailable = availableColumns.includes(column);
          
          return (
            <th
              key={column}
              className={`
                relative min-w-32 max-w-48 h-10 border-t border-b border-r border-gray-200
                ${isSelected 
                  ? 'bg-blue-100 text-blue-800' 
                  : isSuggestion 
                    ? 'bg-gray-100 text-gray-500 hover:bg-gray-150'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }
                transition-colors duration-150
              `}
            >
              <div 
                className="h-full w-full flex items-center justify-center cursor-pointer"
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`${isSelected ? 'Selected' : isSuggestion ? 'Suggested' : 'Available'} column: ${column}`}
                onClick={() => handleToggleColumn(column)}
                onKeyDown={(e) => handleKeyDown(e, 'toggle', column)}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>
                )}
                
                {/* Suggestion indicator */}
                {isSuggestion && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gray-400 opacity-50"></div>
                )}
                
                <div className="flex items-center px-2 w-full justify-center">
                  {/* Plus icon for suggestions */}
                  {isSuggestion && (
                    <Plus size={12} className="mr-1 text-gray-400" />
                  )}
                  
                  <span 
                    className={`text-sm font-medium truncate ${isSuggestion ? 'italic' : ''}`}
                    title={isSuggestion && columnReasons[column] ? columnReasons[column] : undefined}
                  >
                    {column}
                  </span>
                  
                  {/* Info icon for suggested columns with reasons */}
                  {isSuggestion && columnReasons[column] && (
                    <Info size={10} className="ml-1 text-gray-400" />
                  )}
                </div>
                
                {/* Column letter (like Google Sheets) */}
                <div className="absolute top-1 right-1 text-xs text-gray-400">
                  {String.fromCharCode(65 + (allDisplayColumns.indexOf(column) % 26))}
                </div>
              </div>
            </th>
          );
        })}
        
        {/* Add Custom Column */}
        <th 
          className="min-w-32 h-10 border-t border-b border-r border-gray-200 bg-white hover:bg-gray-50"
          style={{ borderLeft: 'none' }}
        >
          <div
            className="h-full w-full flex items-center justify-center cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label="Add custom column"
            onClick={handleAddCustom}
            onKeyDown={(e) => handleKeyDown(e, 'addCustom')}
          >
            <Plus size={16} className="text-gray-400 mr-1" />
            <span className="text-sm text-gray-500">Add Custom</span>
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default ColumnSelector;
