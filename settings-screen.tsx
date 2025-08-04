"use client"

import React, { useState } from "react";
import {
  Settings,
  User,
  Lock,
  Sparkles,
  Search,
  Save,
  Eye,
  EyeOff,
  ChevronDown,
  Check,
  AlertCircle,
} from "lucide-react";

interface SettingsScreenProps {
  setCurrentScreen: (screen: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ setCurrentScreen }) => {
  const [activeTab, setActiveTab] = useState("account");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    email: "user@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: {
      email: true,
      push: false,
      marketing: false,
    },
  });

  // Default enrich parameters
  const [enrichSettings, setEnrichSettings] = useState({
    defaultColumns: [
      "Company Name",
      "Industry", 
      "Funding",
      "Employee Count",
      "Location",
      "Website"
    ],
    autoEnrich: false,
    enrichLimit: 50,
    dataSources: {
      firecrawl: true,
      google: true,
      exa: true,
      alternative: true,
    },
    enrichFields: {
      contactInfo: true,
      financialData: true,
      technologyStack: true,
      socialMedia: true,
      competitors: false,
    },
  });

  // Search model settings
  const [searchSettings, setSearchSettings] = useState({
    defaultModel: "gpt-4",
    searchDepth: "comprehensive",
    resultLimit: 100,
    relevanceThreshold: 0.7,
    autoSuggestions: true,
    searchHistory: true,
  });

  const handleSaveSettings = () => {
    // TODO: Implement settings save logic
    console.log("Saving settings...", {
      accountSettings,
      enrichSettings,
      searchSettings,
    });
  };

  const handlePasswordReset = () => {
    // TODO: Implement password reset logic
    console.log("Password reset requested");
  };

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "enrich", label: "Enrichment", icon: Sparkles },
    { id: "search", label: "Search", icon: Search },
  ];

  const models = [
    { id: "gpt-4", name: "GPT-4", description: "Most capable model for complex searches" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and cost-effective" },
    { id: "claude-3", name: "Claude-3", description: "Excellent for research tasks" },
    { id: "perplexity", name: "Perplexity", description: "Real-time web search" },
  ];

  const searchDepths = [
    { id: "basic", name: "Basic", description: "Quick search with essential results" },
    { id: "standard", name: "Standard", description: "Balanced depth and speed" },
    { id: "comprehensive", name: "Comprehensive", description: "Deep analysis with extensive results" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and search parameters</p>
        </div>
        <button
          onClick={() => setCurrentScreen("search")}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Back to Search
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Account Settings */}
        {activeTab === "account" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={accountSettings.email}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={accountSettings.currentPassword}
                      onChange={(e) => setAccountSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={accountSettings.newPassword}
                        onChange={(e) => setAccountSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={accountSettings.confirmPassword}
                        onChange={(e) => setAccountSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePasswordReset}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              
              <div className="space-y-3">
                {Object.entries(accountSettings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 capitalize">
                        {key} Notifications
                      </label>
                      <p className="text-xs text-gray-500">
                        Receive notifications via {key === "email" ? "email" : key === "push" ? "browser" : "marketing channels"}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setAccountSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, [key]: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enrichment Settings */}
        {activeTab === "enrich" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Enrichment Parameters</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Columns
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      "Company Name", "Industry", "Funding", "Employee Count", 
                      "Location", "Website", "Description", "Phone Number",
                      "Founded Year", "LinkedIn", "Technology Stack", "Market Cap"
                    ].map((column) => (
                      <label key={column} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={enrichSettings.defaultColumns.includes(column)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEnrichSettings(prev => ({
                                ...prev,
                                defaultColumns: [...prev.defaultColumns, column]
                              }));
                            } else {
                              setEnrichSettings(prev => ({
                                ...prev,
                                defaultColumns: prev.defaultColumns.filter(c => c !== column)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-sm text-gray-700">{column}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto-Enrich Results
                    </label>
                    <input
                      type="checkbox"
                      checked={enrichSettings.autoEnrich}
                      onChange={(e) => setEnrichSettings(prev => ({ ...prev, autoEnrich: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Automatically enrich search results</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enrichment Limit
                    </label>
                    <input
                      type="number"
                      value={enrichSettings.enrichLimit}
                      onChange={(e) => setEnrichSettings(prev => ({ ...prev, enrichLimit: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum companies to enrich per search</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Sources
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(enrichSettings.dataSources).map(([source, enabled]) => (
                      <label key={source} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setEnrichSettings(prev => ({
                            ...prev,
                            dataSources: { ...prev.dataSources, [source]: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-sm text-gray-700 capitalize">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enrichment Fields
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(enrichSettings.enrichFields).map(([field, enabled]) => (
                      <label key={field} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setEnrichSettings(prev => ({
                            ...prev,
                            enrichFields: { ...prev.enrichFields, [field]: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-sm text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Settings */}
        {activeTab === "search" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Configuration</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default AI Model
                  </label>
                  <select
                    value={searchSettings.defaultModel}
                    onChange={(e) => setSearchSettings(prev => ({ ...prev, defaultModel: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} - {model.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Depth
                  </label>
                  <select
                    value={searchSettings.searchDepth}
                    onChange={(e) => setSearchSettings(prev => ({ ...prev, searchDepth: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {searchDepths.map((depth) => (
                      <option key={depth.id} value={depth.id}>
                        {depth.name} - {depth.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Result Limit
                    </label>
                    <input
                      type="number"
                      value={searchSettings.resultLimit}
                      onChange={(e) => setSearchSettings(prev => ({ ...prev, resultLimit: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="10"
                      max="1000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum results per search</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relevance Threshold
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={searchSettings.relevanceThreshold}
                      onChange={(e) => setSearchSettings(prev => ({ ...prev, relevanceThreshold: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.0</span>
                      <span>{searchSettings.relevanceThreshold}</span>
                      <span>1.0</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimum relevance score for results</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={searchSettings.autoSuggestions}
                      onChange={(e) => setSearchSettings(prev => ({ ...prev, autoSuggestions: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Auto Suggestions</span>
                  </label>
                  <p className="text-xs text-gray-500 ml-6">Show search suggestions as you type</p>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={searchSettings.searchHistory}
                      onChange={(e) => setSearchSettings(prev => ({ ...prev, searchHistory: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Search History</span>
                  </label>
                  <p className="text-xs text-gray-500 ml-6">Save and display previous searches</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save All Settings
        </button>
      </div>
    </div>
  );
};

SettingsScreen.displayName = "SettingsScreen";
export default SettingsScreen; 