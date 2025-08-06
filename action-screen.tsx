import React, { useState } from "react";
import {
    Download,
    Database,
    Zap,
    ArrowRight,
  Globe,
  DollarSign,
  Users,
  FileText,
  Mail,
  MessageSquare,
  Bell,
  Settings,
  BarChart3,
  AlertTriangle,
} from "lucide-react";

import { type Company } from "./lib/search-apis"

interface ActionScreenProps {
    setCurrentScreen: (screen: string) => void;
    handleExport: () => void;
    enrichedCompanies: Company[]; // Add this
}

// Action Screen Component
const ActionScreen: React.FC<ActionScreenProps> = ({
    setCurrentScreen,
    handleExport,
    enrichedCompanies
}) => {
    // State for monitoring settings
    const [activeTab, setActiveTab] = useState<'export' | 'outreach' | 'monitoring'>('export');
    const [monitoringSettings, setMonitoringSettings] = useState({
        websiteChanges: false,
        fundingRounds: true,
        leadershipChanges: false,
        pressReleases: true,
    });
    const [emailNotifications, setEmailNotifications] = useState('sarah@company.com');
    const [slackChannel, setSlackChannel] = useState('#sales-alerts');
    const [alertFormat, setAlertFormat] = useState('detailed');
    const [dailyDigest, setDailyDigest] = useState(false);

    const handleMonitoringToggle = (setting: keyof typeof monitoringSettings) => {
        setMonitoringSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    return (
        <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Take Action on Your List</h2>
                        <p className="text-gray-600 mt-1">Export, outreach, and monitor 3 relevant companies</p>
                    <p className="text-gray-600 mt-1">
                        {enrichedCompanies.length} enriched companies
                    </p>
                    </div>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
                { id: 'export', name: 'Export & Sync', icon: Download },
                { id: 'outreach', name: 'Outreach Campaigns', icon: Mail },
                { id: 'monitoring', name: 'Live Monitoring', icon: Bell }
            ].map((tab) => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg flex-1 text-sm font-medium transition-colors ${
                            activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        {tab.name}
                    </button>
                );
            })}
        </div>
            {/* Add summary stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">{enrichedCompanies.length}</div>
                    <div className="text-sm text-gray-600">Enriched Companies</div>
                </div>
                {/* Add more stats as needed */}
            </div>

            {enrichedCompanies.map(company => (
                <div key={company.id} className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium">{company.name}</h3>
                    <p className="text-sm text-gray-600">{company.industry}</p>
                    {/* Add more company details */}
                </div>
            ))}

            {/* Ways for export */}
                {/* Export & Sync Tab */}
        {activeTab === 'export' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="font-medium text-gray-900 mb-4">Export Options</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { name: "Google Sheets", description: "Real-time sync", icon: Database },
                                { name: "HubSpot CRM", description: "Create contacts", icon: Database },
                                { name: "Webhook/API", description: "Custom endpoint", icon: Zap },
                                {
                                    name: "CSV Download",
                                    description: "Instant download",
                                    icon: Download,
                                    action: handleExport
                                },
                            ].map((option) => {
                                const Icon = option.icon
                                return (
                                    <button
                                        key={option.name}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 text-left"
                                        onClick={option.action}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Icon className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{option.name}</div>
                                                <div className="text-sm text-gray-600">{option.description}</div>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
        )}

        {/* Outreach Campaigns Tab */}
        {activeTab === 'outreach' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-medium text-gray-900 mb-4">Personalised Outreach at Scale</h3>
                
                <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="font-medium text-gray-900">AI Meeting Tools Outreach</h4>
                                <p className="text-sm text-gray-600">Subject: "How Example Company can 10x meeting productivity"</p>
                            </div>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                                Create Campaign
                            </button>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-900 mb-2">Hi John,</div>
                            <div className="text-sm text-gray-700 space-y-2">
                                <p>I noticed <span className="font-medium text-blue-600">Example Company</span> is growing fast (100-200 employees and $1M in funding - congrats!).</p>
                                <p>Many fast-growing teams struggle with meeting overload...</p>
                            </div>
                            <div className="text-xs text-gray-500 mt-4">
                                Dynamic fields: company_name, first_name, employees, funding
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Live Monitoring Tab */}
        {activeTab === 'monitoring' && (
            <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-medium text-gray-900 mb-4">Set Up Monitoring Alerts</h3>
                    
                    <div className="space-y-4">
                        {/* Website content changes */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-gray-400" />
                                <div>
                                    <div className="font-medium text-gray-900">Website content changes</div>
                                    <div className="text-sm text-gray-600">Get notified when companies have website content changes</div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleMonitoringToggle('websiteChanges')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    monitoringSettings.websiteChanges ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    monitoringSettings.websiteChanges ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                            </button>
                        </div>

                        {/* New funding round */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-5 h-5 text-gray-400" />
                                <div>
                                    <div className="font-medium text-gray-900">New funding round</div>
                                    <div className="text-sm text-gray-600">Get notified when companies have new funding round</div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleMonitoringToggle('fundingRounds')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    monitoringSettings.fundingRounds ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    monitoringSettings.fundingRounds ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                            </button>
                        </div>
                        
                        {monitoringSettings.fundingRounds && (
                            <div className="ml-8 flex gap-2">
                                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                                    <option>Real-time</option>
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                </select>
                                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                                    <option>Add to dashboard only</option>
                                    <option>Send email notification</option>
                                    <option>Both</option>
                                </select>
                            </div>
                        )}

                        {/* Leadership changes */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-gray-400" />
                                <div>
                                    <div className="font-medium text-gray-900">Leadership changes</div>
                                    <div className="text-sm text-gray-600">Get notified when companies have leadership changes</div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleMonitoringToggle('leadershipChanges')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    monitoringSettings.leadershipChanges ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    monitoringSettings.leadershipChanges ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                            </button>
                        </div>

                        {/* Press releases */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <div>
                                    <div className="font-medium text-gray-900">Press releases</div>
                                    <div className="text-sm text-gray-600">Get notified when companies have press releases</div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleMonitoringToggle('pressReleases')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    monitoringSettings.pressReleases ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    monitoringSettings.pressReleases ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                            </button>
                        </div>
                        
                        {monitoringSettings.pressReleases && (
                            <div className="ml-8 flex gap-2">
                                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                                    <option>Real-time</option>
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                </select>
                                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                                    <option>Add to dashboard only</option>
                                    <option>Send email notification</option>
                                    <option>Both</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Alert Delivery Settings */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-medium text-gray-900 mb-4">Alert Delivery</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Notifications</label>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={emailNotifications}
                                    onChange={(e) => setEmailNotifications(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-md">
                                    <AlertTriangle className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Slack Channel</label>
                            <select 
                                value={slackChannel}
                                onChange={(e) => setSlackChannel(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="#sales-alerts">#sales-alerts</option>
                                <option value="#marketing">#marketing</option>
                                <option value="#general">#general</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Alert Format</label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="alertFormat"
                                        value="detailed"
                                        checked={alertFormat === 'detailed'}
                                        onChange={(e) => setAlertFormat(e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">Detailed (full context)</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="alertFormat"
                                        value="summary"
                                        checked={alertFormat === 'summary'}
                                        onChange={(e) => setAlertFormat(e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">Summary only</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={dailyDigest}
                                    onChange={(e) => setDailyDigest(e.target.checked)}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Send daily digest instead of individual alerts</span>
                            </label>
                        </div>

                        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                            <Bell className="w-5 h-5" />
                            Activate Monitoring
                        </button>
                    </div>
                </div>

                {/* Monitoring Coverage */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">Monitoring Coverage</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Active monitoring for 3 companies across {Object.values(monitoringSettings).filter(Boolean).length} alert types
                    </p>
                </div>
            </div>
        )}

            {/* Action Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={() => setCurrentScreen("enrich")}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to Enrichment
                </button>
            </div>
        </div>
    )
}

ActionScreen.displayName = "ActionScreen"
export default ActionScreen
