import React from "react";
import {
  Download,
  Database,
  Zap,
  ArrowRight,
} from "lucide-react";

interface ActionScreenProps {
    setCurrentScreen: (screen: string) => void;
    handleExport: () => void;
}

// Action Screen Component
const ActionScreen: React.FC<ActionScreenProps> = ({
    setCurrentScreen,
    handleExport
}) => {
    
    return (
    <div className="space-y-6">
    <div className="flex items-center justify-between">
        <div>
        <h2 className="text-2xl font-bold text-gray-900">Take Action on Your List</h2>
        <p className="text-gray-600 mt-1">Export, outreach, and monitor your companies</p>
        </div>
    </div>

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
                onClick={option.action} // Attach the action here
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
