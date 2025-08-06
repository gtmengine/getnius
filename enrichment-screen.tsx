"use client"

import React, { useState, useMemo, useCallback } from "react";
import {
    Check,
    Download,
    Building,
    ExternalLink,
    Sparkles,
    ArrowRight,
    Plus,
  Edit3,
  Save,
  X
} from "lucide-react";
import { type Company } from "./lib/search-apis";
import ColumnSelector from "./column-selector";
import { getSuggestedColumns, getColumnReason, type UseCaseContext } from "./lib/column-suggestions";

interface EnrichmentScreenProps {
    relevantCompanies: Company[];
    searchResults: Company[];
    setCurrentScreen: (screen: string) => void;
    handleExport: () => void;
    searchQuery?: string;
    selectedCategory?: string;
    customCategory?: string;
    handleEnrichedData: (companies: Company[]) => void;
}

const EnrichmentScreen: React.FC<EnrichmentScreenProps> = ({
    relevantCompanies,
    setCurrentScreen,
    handleExport,
    searchQuery,
    selectedCategory,
    customCategory,
    handleEnrichedData
}) => {
    const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());

    // Updated column structure to match the new ColumnSelector
    const [availableColumns] = useState([
        'Company Name',
        'Industry',
        'Funding',
        'Employee Count',
        'Location',
        'Founded Year',
        'Website',
        'LinkedIn',
        'Technology Stack',
        'Market Cap',
        'Growth Rate'
    ]);

    // Generate dynamic suggested columns based on use case context
    const useCaseContext: UseCaseContext = {
        searchQuery,
        selectedCategory,
        customCategory
    };

    // Define which columns are editable and their corresponding company field keys
    const getColumnFieldMapping = (columnName: string): { fieldKey: string; isEditable: boolean } => {
        switch (columnName) {
            case 'Company Name':
                return { fieldKey: 'name', isEditable: true };
            case 'Industry':
                return { fieldKey: 'industry', isEditable: true };
            case 'Funding':
                return { fieldKey: 'funding', isEditable: true };
            case 'Employee Count':
                return { fieldKey: 'employees', isEditable: true };
            case 'Location':
                return { fieldKey: 'location', isEditable: true };
            case 'Founded Year':
                return { fieldKey: 'founded', isEditable: true };
            case 'Website':
                return { fieldKey: 'website', isEditable: false }; // Special rendering
            case 'Description':
                return { fieldKey: 'description', isEditable: true };
            case 'Phone Number':
                return { fieldKey: 'phone', isEditable: true };
            case 'CEO Name':
                return { fieldKey: 'ceo', isEditable: true };
            case 'Business Model':
                return { fieldKey: 'businessModel', isEditable: true };
            case 'Social Media':
                return { fieldKey: 'socialMedia', isEditable: true };
            default:
                return { fieldKey: columnName.toLowerCase().replace(/\s+/g, ''), isEditable: true };
        }
    };

    const getColumnValue = (columnName: string, company: Company): React.ReactNode => {
        switch (columnName) {
            case 'Company Name':
                return company.name || '—';
            case 'Industry':
                return company.industry || '—';
            case 'Funding':
                return company.funding || '—';
            case 'Employee Count':
                return company.employees || '—';
            case 'Location':
                return company.location || '—';
            case 'Founded Year':
                return company.founded || '—';
            case 'Website':
                return company.website ? (
                    <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                    >
                        {new URL(company.website).hostname}
                    </a>
                ) : '—';
            case 'Description':
                return company.description || '—';
            case 'Phone Number':
                return company.phone || '—';
            case 'CEO Name':
                return '-';
            case 'Business Model':
                return '—';
            case 'Social Media':
                return '-';
            // Add cases for other columns as needed
            default:
                return '—';
        }
    };

    const [suggestedColumns] = useState(() => getSuggestedColumns(useCaseContext));

    // Generate column reasons for tooltips
    const columnReasons = useMemo(() => {
        const reasons: Record<string, string> = {};
        suggestedColumns.forEach(column => {
            reasons[column] = getColumnReason(column, useCaseContext);
        });
        return reasons;
    }, [suggestedColumns, useCaseContext]);

    const [selectedColumns, setSelectedColumns] = useState([
        'Company Name', 'Industry', 'Funding', 'Employee Count'
    ]);
  const [isEnriching, setIsEnriching] = useState(false);
  
  // Second iteration functionality
  const [evaluationPhase, setEvaluationPhase] = useState<'first' | 'second' | 'completed'>('first');
  const [firstIterationResults, setFirstIterationResults] = useState<Company[]>([]);
  const [showSecondIteration, setShowSecondIteration] = useState(false);

  // Manual editing functionality
  const [editingCell, setEditingCell] = useState<{companyId: string, field: string} | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [modifiedCompanies, setModifiedCompanies] = useState<Record<string, Partial<Company>>>({});
  const [confirmedResults, setConfirmedResults] = useState<Set<string>>(new Set());

    const handleSelectAll = useCallback(() => {
        if (selectedCompanies.size === relevantCompanies.length) {
            setSelectedCompanies(new Set());
        } else {
            setSelectedCompanies(new Set(relevantCompanies.map(company => company.id)));
        }
    }, [selectedCompanies, relevantCompanies]);

    const handleSelectCompany = useCallback((companyId: string) => {
        setSelectedCompanies(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(companyId)) {
                newSelected.delete(companyId);
            } else {
                newSelected.add(companyId);
            }
            return newSelected;
        });
    }, []);

const handleEnrichSelected = useCallback(() => {
  console.log("Enriching selected companies:", Array.from(selectedCompanies));
  setIsEnriching(true);
  // Simulate API call
  setTimeout(() => {
    setIsEnriching(false);
      
      // After first iteration, store results and show second iteration option
      if (evaluationPhase === 'first') {
        const selectedCompaniesList = relevantCompanies.filter(company => 
          selectedCompanies.has(company.id)
        );
        setFirstIterationResults(selectedCompaniesList);
        setEvaluationPhase('completed');
        setShowSecondIteration(true);
      } else if (evaluationPhase === 'second') {
        setEvaluationPhase('completed');
        setShowSecondIteration(false);
      }
    // Pass enriched data to parent
    handleEnrichedData(
      relevantCompanies.filter(company => 
        selectedCompanies.has(company.id)
    ));
  }, 3000);
}, [selectedCompanies, relevantCompanies, handleEnrichedData, evaluationPhase, relevantCompanies]);

  const handleStartSecondIteration = useCallback(() => {
    setEvaluationPhase('second');
    setShowSecondIteration(false);
    setSelectedCompanies(new Set()); // Reset selection for second iteration
  }, []);

  // Manual editing handlers
  const handleStartEdit = useCallback((companyId: string, field: string, currentValue: string) => {
    setEditingCell({ companyId, field });
    setEditingValue(currentValue || '');
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editingCell) return;

    setModifiedCompanies(prev => ({
      ...prev,
      [editingCell.companyId]: {
        ...prev[editingCell.companyId],
        [editingCell.field]: editingValue
      }
    }));

    setEditingCell(null);
    setEditingValue('');
  }, [editingCell, editingValue]);

  const handleCancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditingValue('');
  }, []);

  const handleConfirmResult = useCallback((companyId: string) => {
    setConfirmedResults(prev => new Set([...prev, companyId]));
  }, []);

  const handleUnconfirmResult = useCallback((companyId: string) => {
    setConfirmedResults(prev => {
      const newSet = new Set(prev);
      newSet.delete(companyId);
      return newSet;
    });
  }, []);

  // Get the display value for a field (either modified or original)
  const getFieldValue = useCallback((company: Company, field: string) => {
    const modified = modifiedCompanies[company.id];
    if (modified && field in modified) {
      return modified[field as keyof Company] as string;
    }
    return company[field as keyof Company] as string;
  }, [modifiedCompanies]);

  // Render editable cell
  const renderEditableCell = useCallback((company: Company, columnName: string, fieldKey: string) => {
    const isEditing = editingCell?.companyId === company.id && editingCell?.field === fieldKey;
    const currentValue = getFieldValue(company, fieldKey);
    const isModified = modifiedCompanies[company.id] && fieldKey in (modifiedCompanies[company.id] || {});
    
    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveEdit();
              if (e.key === 'Escape') handleCancelEdit();
            }}
          />
          <button
            onClick={handleSaveEdit}
            className="p-1 text-green-600 hover:bg-green-100 rounded"
            title="Save"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancelEdit}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="group flex items-center justify-between">
        <span className={`${isModified ? 'text-blue-600 font-medium' : ''}`}>
          {currentValue || "—"}
        </span>
        <button
          onClick={() => handleStartEdit(company.id, fieldKey, currentValue)}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-opacity"
          title="Edit"
        >
          <Edit3 className="w-3 h-3" />
        </button>
      </div>
    );
  }, [editingCell, editingValue, getFieldValue, modifiedCompanies, handleStartEdit, handleSaveEdit, handleCancelEdit]);

    const enrichedCompanies = useMemo(() =>
        relevantCompanies.map(company => ({
            ...company,
            enriched: selectedCompanies.has(company.id)
        })),
        [relevantCompanies, selectedCompanies]
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Enrich Your Market List</h2>
                    <p className="text-gray-600 mt-1">
                        {relevantCompanies.length} relevant companies • {selectedCompanies.size} selected for enrichment
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleEnrichSelected}
                        disabled={selectedCompanies.size === 0 || isEnriching}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        {isEnriching ? 'Enriching...' : 
             evaluationPhase === 'second' ? `Second Iteration (${selectedCompanies.size})` :
             `Enrich Selected (${selectedCompanies.size})`}
                    </button>
                    <button onClick={handleExport} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">

                        {/* Column Selector */}
                        <ColumnSelector
                            availableColumns={availableColumns}
                            suggestedColumns={suggestedColumns}
                            selectedColumns={selectedColumns}
                            onChange={setSelectedColumns}
                            columnReasons={columnReasons}
                            // Pass the new props
                            selectedCompanies={selectedCompanies}
                            relevantCompanies={relevantCompanies}
                            handleSelectAll={handleSelectAll}
                        />
                        <tbody className="divide-y divide-gray-200">
                            {enrichedCompanies.map((company) => (
                                <tr key={company.id} className="hover:bg-gray-50">
                                    <td className="sticky left-0 z-20 bg-white border-b border-gray-200 px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedCompanies.has(company.id)}
                                            onChange={() => handleSelectCompany(company.id)}
                                            className="rounded border-gray-300"
                                        />
                                    </td>
                                    <td className="sticky left-12 z-20 bg-white border-b border-r border-gray-200 px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            {company.logo ? (
                                                <img
                                                    src={company.logo || "/placeholder.svg"}
                                                    alt={company.name}
                                                    className="w-8 h-8 rounded"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/placeholder.svg?height=32&width=32"
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                                    <Building className="w-4 h-4 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{company.name}</div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">{company.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="bg-white border-b border-r border-gray-200 px-4 py-4">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${company.source === "firecrawl"
                                                ? "bg-purple-100 text-purple-700"
                                                : company.source === "google"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : company.source === "exa"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {company.source}
                                        </span>
                                    </td>
                                    {selectedColumns.map(columnName => {
                                        const { fieldKey, isEditable } = getColumnFieldMapping(columnName);
                                        return (
                                            <td key={columnName} className="px-4 py-4 text-sm text-gray-900">
                                                {isEditable ? 
                                                    renderEditableCell(company, columnName, fieldKey) : 
                                                    getColumnValue(columnName, company)
                                                }
                                            </td>
                                        );
                                    })}
                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${company.enriched
                                                ? "bg-green-100 text-green-700"
                                                : company.relevance === "relevant"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : company.relevance === "not_relevant"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {company.enriched ? "Enriched" :
                                                company.relevance === "relevant" ? "Relevant" :
                                                    company.relevance === "not_relevant" ? "Not Relevant" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleSelectCompany(company.id)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                {selectedCompanies.has(company.id) ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Plus className="w-4 h-4 text-gray-400" />
                                                )}
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <ExternalLink className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Enrichment Progress */}
            {isEnriching && (
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">Enriching data...</span>
                        <span className="text-sm text-blue-700">Processing...</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }} />
                    </div>
                </div>
            )}

    {/* Second Iteration Options */}
    {showSecondIteration && (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-green-900">First Iteration Complete</h3>
            <p className="text-sm text-green-700 mt-1">
              {firstIterationResults.length} companies processed. Would you like to run a second iteration for deeper analysis?
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSecondIteration(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              Skip
            </button>
            <button
              onClick={handleStartSecondIteration}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Start Second Iteration
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Phase Indicator */}
    {evaluationPhase !== 'first' && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${evaluationPhase === 'second' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
          <span className="text-sm font-medium text-blue-900">
            {evaluationPhase === 'second' ? 'Second Iteration Mode' : 'Evaluation Complete'}
          </span>
          {firstIterationResults.length > 0 && (
            <span className="text-sm text-blue-700">
              ({firstIterationResults.length} companies from first iteration)
            </span>
          )}
        </div>
      </div>
    )}

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">{relevantCompanies.length}</div>
                    <div className="text-sm text-gray-600">Relevant Companies</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{selectedCompanies.size}</div>
                    <div className="text-sm text-gray-600">Selected for Enrichment</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600">
                        {enrichedCompanies.filter(c => c.enriched).length}
                    </div>
                    <div className="text-sm text-gray-600">Enriched</div>
                </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-2xl font-bold text-green-600">
            {confirmedResults.size}
        </div>
        <div className="text-sm text-gray-600">Confirmed Results</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-2xl font-bold text-blue-600">
            {Object.keys(modifiedCompanies).length}
        </div>
        <div className="text-sm text-gray-600">Modified Entries</div>
        </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-gray-600">
                        {selectedColumns.length}
                    </div>
                    <div className="text-sm text-gray-600">Active Columns</div>
                </div>
            </div>

    {/* Bulk Actions */}
    {(Object.keys(modifiedCompanies).length > 0 || confirmedResults.size > 0) && (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-yellow-900">Pending Changes</h3>
            <p className="text-sm text-yellow-700 mt-1">
              {Object.keys(modifiedCompanies).length > 0 && 
                `${Object.keys(modifiedCompanies).length} modified entries`}
              {Object.keys(modifiedCompanies).length > 0 && confirmedResults.size > 0 && " • "}
              {confirmedResults.size > 0 && 
                `${confirmedResults.size} confirmed results`}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setModifiedCompanies({});
                setConfirmedResults(new Set());
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              Reset All
            </button>
            <button
              onClick={() => {
                // Here you would typically save to backend
                console.log("Saving modifications:", modifiedCompanies);
                console.log("Confirmed results:", Array.from(confirmedResults));
                // For demo, just show success
                alert(`Saved ${Object.keys(modifiedCompanies).length} modifications and ${confirmedResults.size} confirmations!`);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    )}

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
                    disabled={selectedCompanies.size === 0 || isEnriching}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-2"
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
