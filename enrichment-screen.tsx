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
} from "lucide-react";
import { type Company } from "./lib/search-apis";

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
  const [enrichmentColumns, setEnrichmentColumns] = useState([
    { id: "website", name: "Website", enabled: true },
    { id: "employees", name: "Employee Count", enabled: true },
    { id: "funding", name: "Total Funding", enabled: true },
    { id: "location", name: "HQ Location", enabled: true },
    { id: "industry", name: "Industry", enabled: false },
    { id: "founded", name: "Founded Year", enabled: false },
    { id: "email", name: "Contact Email", enabled: false },
    { id: "phone", name: "Phone Number", enabled: false },
  ]);

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
            disabled={selectedCompanies.size === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 flex items-center gap-2"
        >
            <Sparkles className="w-4 h-4" />
            Enrich Selected ({selectedCompanies.size})
        </button>
        <button onClick={handleExport} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
        </button>
        </div>
    </div>

    {/* Column Selection */}
    <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-3">Enrichment Columns</h3>
        <div className="grid grid-cols-4 gap-3">
        {enrichmentColumns.map((column) => (
            <label key={column.id} className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={column.enabled}
                onChange={(e) => {
                setEnrichmentColumns(prev => 
                    prev.map(col => 
                    col.id === column.id ? { ...col, enabled: e.target.checked } : col
                    )
                )
                }}
                className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">{column.name}</span>
            </label>
        ))}
        </div>
    </div>

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
                {enrichmentColumns.filter(col => col.enabled).map(column => (
                <th key={column.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {column.name}
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
                {enrichmentColumns.filter(col => col.enabled).map(column => (
                    <td key={column.id} className="px-4 py-4 text-sm text-gray-900">
                    {column.id === "website" && company.website ? (
                        <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                        >
                        {new URL(company.website).hostname}
                        </a>
                    ) : column.id === "employees" ? (
                        company.employees || "—"
                    ) : column.id === "funding" ? (
                        company.funding || "—"
                    ) : column.id === "location" ? (
                        company.location || "—"
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
            {enrichmentColumns.filter(col => col.enabled).length}
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
        disabled={selectedCompanies.size === 0}
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
