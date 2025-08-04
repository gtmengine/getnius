"use client"

import React, { useState } from 'react';
import { Plus, Info } from 'lucide-react';

interface ColumnSelectorProps {
  availableColumns?: string[];
  suggestedColumns?: string[];
  selectedColumns?: string[];
  onChange?: (selected: string[]) => void;
  columnReasons?: Record<string, string>;
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
  columnReasons = {}
}) => {
  const [internalSelected, setInternalSelected] = useState(selectedColumns);
  
  const handleToggleColumn = (column: string, isApproving = false) => {
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

  // Create display order: selected first, then unselected available, then suggestions, then custom
  const selectedAvailable = availableColumns.filter(col => internalSelected.includes(col));
  const unselectedAvailable = availableColumns.filter(col => !internalSelected.includes(col));
  const unselectedSuggestions = suggestedColumns.filter(col => !internalSelected.includes(col));
  const customColumns = internalSelected.filter(col => 
    !availableColumns.includes(col) && !suggestedColumns.includes(col)
  );
  
  const allDisplayColumns = [
    ...selectedAvailable,
    ...unselectedAvailable, 
    ...customColumns,
    ...unselectedSuggestions
  ];

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Enrichment Columns
      </h2>
      
      {/* Column Headers Bar */}
      <div className="overflow-x-auto bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex min-w-max">
          {/* Row number column (fixed) */}
          <div className="flex-shrink-0 w-12 h-10 border-r border-gray-200 bg-gray-100 flex items-center justify-center">
            <span className="text-xs text-gray-500">#</span>
          </div>
          
          {/* Column Headers */}
          {allDisplayColumns.map((column, index) => {
            const isSelected = internalSelected.includes(column);
            const isSuggestion = suggestedColumns.includes(column) && !isSelected;
            const isAvailable = availableColumns.includes(column);
            
            return (
              <div
                key={column}
                className={`
                  relative flex-shrink-0 min-w-32 max-w-48 h-10 border-r border-gray-200 flex items-center justify-center cursor-pointer
                  ${isSelected 
                    ? 'bg-blue-100 text-blue-800 border-blue-200' 
                    : isSuggestion 
                      ? 'bg-gray-100 text-gray-500 hover:bg-gray-150 border-dashed'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }
                  transition-colors duration-150
                `}
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
                
                <div className="flex items-center px-2">
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
            );
          })}
          
          {/* Add Custom Column */}
          <div
            className="flex-shrink-0 w-32 h-10 border-r border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center cursor-pointer transition-colors duration-150"
            tabIndex={0}
            role="button"
            aria-label="Add custom column"
            onClick={handleAddCustom}
            onKeyDown={(e) => handleKeyDown(e, 'addCustom')}
          >
            <Plus size={16} className="text-gray-400 mr-1" />
            <span className="text-sm text-gray-500">Add Custom</span>
          </div>
        </div>
      </div>

      {/* Selection Summary */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>
          {internalSelected.length} of {allDisplayColumns.length} columns selected • {unselectedSuggestions.length} context-aware suggestions available
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded-sm"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white border border-gray-200 rounded-sm"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 border-dashed rounded-sm"></div>
            <span>Suggested</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnSelector;
