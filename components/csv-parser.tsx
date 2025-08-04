"use client"

import React, { useState, useCallback } from "react";
import { Upload, FileText, X, Eye, EyeOff, Download, Search, AlertCircle, CheckCircle } from "lucide-react";

interface CSVData {
  headers: string[];
  rows: string[][];
}

interface CSVParserProps {
  onDataProcessed?: (data: CSVData) => void;
  onSearchFromCSV?: (searchQueries: string[]) => void;
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
  const [showPreview, setShowPreview] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [searchColumn, setSearchColumn] = useState<string>("");
  const [previewRows, setPreviewRows] = useState<number>(5);

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
        setSelectedColumns(parsedData.headers);
        setSearchColumn(parsedData.headers[0] || "");
        onDataProcessed?.(parsedData);
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
  }, [parseCSV, onDataProcessed]);

  const handleSearchFromCSV = useCallback(() => {
    if (!csvData || !searchColumn) return;

    const columnIndex = csvData.headers.indexOf(searchColumn);
    if (columnIndex === -1) return;

    const searchQueries = csvData.rows
      .map(row => row[columnIndex])
      .filter(query => query && query.trim())
      .map(query => query.trim());

    onSearchFromCSV?.(searchQueries);
  }, [csvData, searchColumn, onSearchFromCSV]);

  const exportProcessedData = useCallback(() => {
    if (!csvData) return;

    const csvContent = [
      csvData.headers.join(','),
      ...csvData.rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [csvData]);

  const clearData = useCallback(() => {
    setCsvData(null);
    setSelectedColumns([]);
    setSearchColumn("");
    setError(null);
    setShowPreview(false);
  }, []);

  return (
    <div>
      {/* File Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Upload CSV File</h3>
            <p className="text-sm text-gray-500 mt-1">
              Upload a CSV file to extract search queries or preview data
            </p>
          </div>

          <div className="flex justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessing}
              />
              <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-2">
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Choose CSV File
                  </>
                )}
              </div>
            </label>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Data Preview and Controls */}
      {csvData && (
        <div className="space-y-4">
          {/* Success Message */}
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            CSV file loaded successfully! {csvData.rows.length} rows, {csvData.headers.length} columns
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>

              <button
                onClick={exportProcessedData}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>

            <button
              onClick={clearData}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
            >
              <X className="w-4 h-4" />
              Clear Data
            </button>
          </div>

          {/* Column Selection for Search */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Search Configuration</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select column for search queries:
                </label>
                <select
                  value={searchColumn}
                  onChange={(e) => setSearchColumn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {csvData.headers.map((header, index) => (
                    <option key={index} value={header}>
                      {header} ({csvData.rows.filter(row => row[index] && row[index].trim()).length} non-empty values)
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearchFromCSV}
                disabled={!searchColumn}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                <Search className="w-4 h-4" />
                Generate Search Queries ({csvData.rows.filter(row => {
                  const index = csvData.headers.indexOf(searchColumn);
                  return index >= 0 && row[index] && row[index].trim();
                }).length} queries)
              </button>
            </div>
          </div>

          {/* Data Preview */}
          {showPreview && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Data Preview</h4>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Show rows:</label>
                    <select
                      value={previewRows}
                      onChange={(e) => setPreviewRows(Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {csvData.headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b border-gray-200"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.rows.slice(0, previewRows).map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100"
                          >
                            {cell || <span className="text-gray-400">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {csvData.rows.length > previewRows && (
                <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600 border-t border-gray-200">
                  Showing {previewRows} of {csvData.rows.length} rows
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CSVParser; 
