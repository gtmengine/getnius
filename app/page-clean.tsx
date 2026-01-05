'use client'

import React, { useState } from 'react';
import { Search, Upload, Building2, Users, Newspaper, TrendingUp, Filter, Bell, Settings, History, Plus, X, FileText, BookOpen, Info, Bookmark } from 'lucide-react';
import { DataGridLayout } from '@/components/data-grid-layout';

export default function Page() {
  const [activeTab, setActiveTab] = useState('companies');

  const tabs = [
    { id: 'companies', label: 'COMPANIES / PRODUCTS' },
    { id: 'people', label: 'PEOPLE / CONTACTS' },
    { id: 'news', label: 'NEWS / DIGESTS' },
    { id: 'signals', label: 'SIGNALS / INTENTS / CHANGES' },
    { id: 'market', label: 'MARKET REPORTS' },
    { id: 'patents', label: 'PATENTS / RESEARCH PAPERS' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Getnius
              </h1>
              <nav className="hidden md:flex gap-1">
                <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  New Search
                </button>
                <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2">
                  <History className="w-4 h-4" />
                  History
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <button className="text-slate-800 font-semibold text-sm uppercase tracking-wide hover:text-indigo-600 transition-colors">
            NEW SEARCH
          </button>
          <button className="flex items-center gap-2 text-slate-800 font-semibold text-sm uppercase tracking-wide hover:text-indigo-600 transition-colors">
            <History className="w-5 h-5" />
            HISTORY (list of spreadsheets)
          </button>
          <button className="flex items-center gap-2 text-slate-800 font-semibold text-sm uppercase tracking-wide hover:text-indigo-600 transition-colors">
            <Settings className="w-5 h-5" />
            SETTINGS
          </button>
        </div>

        <div className="mb-8">
          <div className="bg-white shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 p-4">
              <div className="flex-1 relative">
                <input
                  placeholder="e.g. SaaS startups in San Francisco with ~50 employees"
                  className="w-full px-4 py-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-700 placeholder-slate-400"
                  type="text"
                  value="o[k[[k"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-500 text-white hover:bg-slate-600 transition-colors font-medium">
                <Search className="w-4 h-4" />
                Search...
              </button>
              <div className="flex flex-col items-center">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">UPLOADS DOCS</div>
                <div className="text-xs text-slate-500 mb-2">(CSVs images etc)</div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium">
                  <Upload className="w-3 h-3" />
                  Import CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 mb-6 bg-slate-100 border border-slate-200 rounded-full p-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-all rounded-full ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <DataGridLayout activeTab={activeTab} />
      </main>
    </div>
  );
}
