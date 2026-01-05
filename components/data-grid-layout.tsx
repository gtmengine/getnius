"use client";

import { useState } from 'react';
import { CompaniesGrid } from '@/components/grids/companies-grid';
import { PeopleGrid } from '@/components/grids/people-grid';
import { PatentsGrid } from '@/components/grids/patents-grid';
import { SlideSidebar } from '@/components/ui/slide-sidebar';

interface DataGridLayoutProps {
  activeTab: string;
}

export function DataGridLayout({ activeTab }: DataGridLayoutProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleRowSelect = (item: any) => {
    setSelectedItem(item);
  };

  const handleCloseSidebar = () => {
    setSelectedItem(null);
  };

  const renderGrid = () => {
    switch (activeTab) {
      case 'companies':
        return <CompaniesGrid onRowSelect={handleRowSelect} />;
      case 'people':
        return <PeopleGrid onRowSelect={handleRowSelect} />;
      case 'patents':
        return <PatentsGrid onRowSelect={handleRowSelect} />;
      default:
        return <PatentsGrid onRowSelect={handleRowSelect} />;
    }
  };

  const renderSidebarContent = () => {
    if (!selectedItem) return null;

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-slate-800 mb-2">
            {selectedItem.name || selectedItem.title}
          </h4>
          <p className="text-sm text-slate-600">
            {selectedItem.company || selectedItem.inventor}
          </p>
        </div>

        <div className="space-y-3">
          {selectedItem.description && (
            <div className="py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-600">Description:</span>
              <p className="text-sm text-slate-800 mt-1">{selectedItem.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {selectedItem.location && (
              <div className="py-2 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-600">Location:</span>
                <p className="text-sm text-slate-800 mt-1">{selectedItem.location}</p>
              </div>
            )}

            {selectedItem.founded && (
              <div className="py-2 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-600">Founded:</span>
                <p className="text-sm text-slate-800 mt-1">{selectedItem.founded} employees</p>
              </div>
            )}

            {selectedItem.year && (
              <div className="py-2 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-600">Founded Year:</span>
                <p className="text-sm text-slate-800 mt-1">{selectedItem.year}</p>
              </div>
            )}

            {selectedItem.revenue && (
              <div className="py-2 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-600">Revenue:</span>
                <p className="text-sm text-slate-800 mt-1">{selectedItem.revenue}</p>
              </div>
            )}

            {selectedItem.status && (
              <div className="py-2 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-600">Status:</span>
                <p className="text-sm text-green-600 mt-1 font-semibold">{selectedItem.status}</p>
              </div>
            )}

            {selectedItem.people !== undefined && (
              <div className="py-2 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-600">People:</span>
                <p className="text-sm text-slate-800 mt-1">{selectedItem.people} people</p>
              </div>
            )}

            {selectedItem.news !== undefined && (
              <div className="py-2 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-600">News:</span>
                <p className="text-sm text-slate-800 mt-1">{selectedItem.news} news articles</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            View People ({selectedItem.people || 0})
          </button>
          <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            View News ({selectedItem.news || 0})
          </button>
          <button className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
            Save
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="flex">
        <div className="flex-1">
          {renderGrid()}
        </div>
      </div>

      <SlideSidebar item={selectedItem} onClose={handleCloseSidebar}>
        {renderSidebarContent()}
      </SlideSidebar>
    </div>
  );
}
