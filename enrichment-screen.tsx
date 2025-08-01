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
  Globe,
  Users,
  DollarSign,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Database,
  Target,
  FileText,
  Zap,
} from "lucide-react";
import { type Company } from "./lib/search-apis";
import ColumnSelector from "./column-selector";

interface EnrichmentScreenProps {
    relevantCompanies: Company[];
    searchResults: Company[];
    setCurrentScreen: (screen: string) => void;
    handleExport: () => void;
}

const EnrichmentScreen: React.FC<EnrichmentScreenProps> = ({
    relevantCompanies,
    setCurrentScreen,
    handleExport
}) => {
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  
  // Updated column structure to match the new ColumnSelector
  const [availableColumns] = useState([
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
  ]);

  const [suggestedColumns] = useState([
    'Description',
    'Phone Number',
    'CEO Name',
    'Headquarters',
    'Company Size',
    'Business Model',
    'Social Media',
    'Year Founded'
  ]);

  const [selectedColumns, setSelectedColumns] = useState([
    'Company Name', 'Industry', 'Revenue', 'Employee Count'
  ]);

  const [isEnriching, setIsEnriching] = useState(false);

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
    setTimeout(() => {
      setIsEnriching(false);
    }, 3000);
  }, [selectedCompanies]);

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
            {isEnriching ? 'Enriching...' : `Enrich Selected (${selectedCompanies.size})`}
        </button>
        <button onClick={handleExport} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
        </button>
        </div>
    </div>

    {/* Column Selector */}
    <ColumnSelector
        availableColumns={availableColumns}
        suggestedColumns={suggestedColumns}
        selectedColumns={selectedColumns}
        onChange={setSelectedColumns}
    />

    {/* Data Table */}
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
            <thead className="bg-gray-50 border-b">
            <tr>
                <th className="px-4 py-3 text-left">
                <input
                    type="checkbox"
                    checked={selectedCompanies.size === relevantCompanies.length && relevantCompanies.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                {selectedColumns.map(columnName => (
                <th key={columnName} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {columnName}
                </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {enrichedCompanies.map((company) => (
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
                <td className="px-4 py-4">
                    <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        company.source === "firecrawl"
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
                {selectedColumns.map(columnName => (
                    <td key={columnName} className="px-4 py-4 text-sm text-gray-900">
                    {columnName === "Company Name" ? (
                        company.name || "—"
                    ) : columnName === "Industry" ? (
                        company.industry || "—"
                    ) : columnName === "Revenue" ? (
                        company.funding || "—"
                    ) : columnName === "Employee Count" ? (
                        company.employees || "—"
                    ) : columnName === "Location" ? (
                        company.location || "—"
                    ) : columnName === "Founded Year" ? (
                        company.founded || "—"
                    ) : columnName === "Website" ? (
                        company.website ? (
                            <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                            >
                            {new URL(company.website).hostname}
                            </a>
                        ) : "—"
                    ) : columnName === "LinkedIn" ? (
                        "—"
                    ) : columnName === "Technology Stack" ? (
                        "—"
                    ) : columnName === "Funding Stage" ? (
                        company.funding || "—"
                    ) : columnName === "Market Cap" ? (
                        "—"
                    ) : columnName === "Growth Rate" ? (
                        "—"
                    ) : columnName === "Description" ? (
                        company.description || "—"
                    ) : columnName === "Phone Number" ? (
                        company.phone || "—"
                    ) : columnName === "CEO Name" ? (
                        "—"
                    ) : columnName === "Headquarters" ? (
                        company.location || "—"
                    ) : columnName === "Company Size" ? (
                        company.employees || "—"
                    ) : columnName === "Business Model" ? (
                        "—"
                    ) : columnName === "Social Media" ? (
                        "—"
                    ) : columnName === "Year Founded" ? (
                        company.founded || "—"
                    ) : (
                        "—"
                    )}
                    </td>
                ))}
                <td className="px-4 py-4">
                    <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        company.enriched
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

    {/* Summary Stats */}
    <div className="grid grid-cols-4 gap-4">
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
        <div className="text-2xl font-bold text-gray-600">
            {selectedColumns.length}
        </div>
        <div className="text-sm text-gray-600">Active Columns</div>
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
