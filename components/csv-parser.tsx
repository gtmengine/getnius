"use client"

import React, { useState, useCallback } from "react";
import { Upload, FileText, X, Search, AlertCircle, CheckCircle } from "lucide-react";

interface CSVData {
  headers: string[];
  rows: string[][];
}

interface CSVParserProps {
  onDataProcessed?: (data: CSVData) => void;
  onSearchFromCSV: (searchQueries: string[]) => void;
  className?: string;
}

const CSVParser: React.FC<CSVParserProps> = ({ 
  onDataProcessed, 
  onSearchFromCSV, 
  className = "" 
}) => {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchColumn, setSearchColumn] = useState<string>("");

  const parseCSV = useCallback((text: string): CSVData => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }

    // Simple CSV parsing (handles basic cases)
    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      result.push(current.trim());
      return result;
    };

    const headers = parseLine(lines[0]);
    const rows = lines.slice(1).map(line => parseLine(line));

    return { headers, rows };
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError("Please upload a CSV file");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsedData = parseCSV(text);
        
        if (parsedData.headers.length === 0) {
          throw new Error("No headers found in CSV");
        }

        setCsvData(parsedData);
        setSearchColumn(parsedData.headers[0] || "");
        onDataProcessed?.(parsedData);
        
        // Automatically extract first column and generate search queries
        const columnIndex = 0;
        const searchQueries = parsedData.rows
          .map(row => row[columnIndex])
          .filter(query => query && query.trim())
          .map(query => query.trim());
          
        onSearchFromCSV(searchQueries);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse CSV file");
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file");
      setIsProcessing(false);
    };

    reader.readAsText(file);
  }, [parseCSV, onDataProcessed, onSearchFromCSV]);

  const handleColumnChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newColumn = e.target.value;
    setSearchColumn(newColumn);
    
    if (csvData) {
      const columnIndex = csvData.headers.indexOf(newColumn);
      if (columnIndex !== -1) {
        const searchQueries = csvData.rows
          .map(row => row[columnIndex])
          .filter(query => query && query.trim())
          .map(query => query.trim());
          
        onSearchFromCSV(searchQueries);
      }
    }
  }, [csvData, onSearchFromCSV]);

  const clearData = useCallback(() => {
    setCsvData(null);
    setSearchColumn("");
    setError(null);
    onSearchFromCSV([]); // Clear search queries
  }, [onSearchFromCSV]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleChangeCSV = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      {/* File Upload Section */}
      <div className="flex justify-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isProcessing}
        />
        
        {!csvData ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-2"
            disabled={isProcessing}
          >
            {isProcessing ? (
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
              onClick={handleChangeCSV}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Change CSV
            </button>
            <button
              onClick={clearData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {/* Column Selection */}
      {csvData && (
        <div className="mt-4 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select column for search queries:
                </label>
                <select
                  value={searchColumn}
                  onChange={handleColumnChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {csvData.headers.map((header, index) => (
                    <option key={index} value={header}>
                      {header} ({csvData.rows.filter(row => row[index] && row[index].trim()).length} non-empty values)
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-600">
                {csvData.rows.filter(row => {
                  const index = csvData.headers.indexOf(searchColumn);
                  return index >= 0 && row[index] && row[index].trim();
                }).length} search queries generated
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVParser;
