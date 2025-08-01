"use client"

import React, { useState } from "react";
import { X, Plus } from "lucide-react";

interface ColumnSelectorProps {
  availableColumns: string[];
  suggestedColumns: string[];
  selectedColumns: string[];
  onChange: (selected: string[]) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  availableColumns,
  suggestedColumns,
  selectedColumns,
  onChange,
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customColumnName, setCustomColumnName] = useState("");

  // Get all unselected columns (available + suggested)
  const unselectedColumns = [...availableColumns, ...suggestedColumns].filter(
    (col) => !selectedColumns.includes(col)
  );

  const handleAddColumn = (columnName: string) => {
    if (!selectedColumns.includes(columnName)) {
      onChange([...selectedColumns, columnName]);
    }
  };

  const handleRemoveColumn = (columnName: string) => {
    onChange(selectedColumns.filter((col) => col !== columnName));
  };

  const handleAddCustomColumn = () => {
    const customName = customColumnName.trim();
    if (customName && !selectedColumns.includes(customName)) {
      onChange([...selectedColumns, customName]);
      setCustomColumnName("");
      setShowCustomInput(false);
    }
  };

  const handleCustomInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCustomColumn();
    } else if (e.key === "Escape") {
      setShowCustomInput(false);
      setCustomColumnName("");
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrichment Columns</h3>
      
      {/* Selected Columns - Blue Pills */}
      <div className="flex flex-wrap gap-3 mb-4">
        {selectedColumns.map((column) => (
          <button
            key={column}
            className="inline-flex items-center gap-2 px-6 py-4 bg-[#E0F2FF] text-[#0369A1] rounded-full text-sm font-medium hover:bg-[#D1E7FF] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-pressed="true"
            aria-label={`Remove column ${column}`}
            onClick={() => handleRemoveColumn(column)}
          >
            <span>{column}</span>
            <X className="w-4 h-4 hover:text-[#023E5F] transition-colors" />
          </button>
        ))}
      </div>

      {/* Unselected Columns - Gray Pills */}
      {unselectedColumns.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {unselectedColumns.map((column) => (
            <button
              key={column}
              className="inline-flex items-center px-6 py-4 bg-[#F3F4F6] text-[#6B7280] rounded-full text-sm font-medium hover:bg-[#E5E7EB] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-pressed="false"
              aria-label={`Add column ${column}`}
              onClick={() => handleAddColumn(column)}
            >
              {column}
            </button>
          ))}
        </div>
      )}

      {/* Add Custom Column */}
      {showCustomInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customColumnName}
            onChange={(e) => setCustomColumnName(e.target.value)}
            onKeyDown={handleCustomInputKeyDown}
            placeholder="Enter column name..."
            className="px-6 py-4 border-2 border-[#F3F4F6] rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          <button
            onClick={handleAddCustomColumn}
            className="px-4 py-4 bg-[#0369A1] text-white rounded-full text-sm font-medium hover:bg-[#023E5F] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowCustomInput(false);
              setCustomColumnName("");
            }}
            className="px-4 py-4 bg-[#F3F4F6] text-[#6B7280] rounded-full text-sm font-medium hover:bg-[#E5E7EB] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowCustomInput(true)}
          className="inline-flex items-center gap-2 px-6 py-4 bg-[#F3F4F6] text-[#6B7280] rounded-full text-sm font-medium hover:bg-[#E5E7EB] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
          <Plus className="w-4 h-4" />
          Add Custom
        </button>
      )}
    </div>
  );
};

export default ColumnSelector; 