"use client"

import React, { useState, useCallback } from "react";
import { ExternalLink, Loader2, CheckCircle, AlertCircle, X, Building, MapPin, Tag, Globe } from "lucide-react";

interface ProcessedLink {
  id: string;
  url: string;
  companyName: string;
  segment: string;
  tags: string[];
  location: string;
  technologies: string[];
  status: "processing" | "success" | "error";
  error?: string;
}

interface LinkProcessorProps {
  onLinksProcessed?: (processedLinks: ProcessedLink[]) => void;
  className?: string;
}

const LinkProcessor: React.FC<LinkProcessorProps> = ({ 
  onLinksProcessed, 
  className = "" 
}) => {
  const [inputText, setInputText] = useState("");
  const [processedLinks, setProcessedLinks] = useState<ProcessedLink[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract URLs from text input
  const extractUrls = useCallback((text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s,]+)/g;
    const matches = text.match(urlRegex);
    return matches ? [...new Set(matches)] : [];
  }, []);

  // Simulate API call to extract company information
  const processUrl = useCallback(async (url: string): Promise<ProcessedLink> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simulate different outcomes based on URL
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('error') || urlLower.includes('invalid')) {
      throw new Error("Unable to process this URL");
    }

    // Simulate company data extraction
    const mockData = {
      "openai.com": {
        companyName: "OpenAI",
        segment: "Artificial Intelligence",
        tags: ["AI", "Machine Learning", "GPT", "Research"],
        location: "San Francisco, CA, USA",
        technologies: ["Python", "TensorFlow", "PyTorch", "React"]
      },
      "anthropic.com": {
        companyName: "Anthropic",
        segment: "AI Safety & Research",
        tags: ["AI Safety", "Claude", "Research", "Ethics"],
        location: "San Francisco, CA, USA",
        technologies: ["Python", "Rust", "AWS", "TypeScript"]
      },
      "notion.so": {
        companyName: "Notion",
        segment: "Productivity Software",
        tags: ["Productivity", "Collaboration", "Workspace", "Documentation"],
        location: "San Francisco, CA, USA",
        technologies: ["React", "Node.js", "PostgreSQL", "AWS"]
      },
      "figma.com": {
        companyName: "Figma",
        segment: "Design Tools",
        tags: ["Design", "UI/UX", "Collaboration", "Prototyping"],
        location: "San Francisco, CA, USA",
        technologies: ["TypeScript", "WebGL", "WebAssembly", "Rust"]
      }
    };

    // Try to find matching data or generate generic data
    const domain = new URL(url).hostname.replace('www.', '');
    const data = mockData[domain as keyof typeof mockData];

    if (data) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        url,
        ...data,
        status: "success"
      };
    }

    // Generate generic data for unknown URLs
    const genericData = {
      companyName: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1),
      segment: "Technology",
      tags: ["Tech", "Digital", "Innovation"],
      location: "Unknown",
      technologies: ["Web Technologies"]
    };

    return {
      id: Math.random().toString(36).substr(2, 9),
      url,
      ...genericData,
      status: "success"
    };
  }, []);

  const handleProcessLinks = useCallback(async () => {
    const urls = extractUrls(inputText);
    if (urls.length === 0) return;

    setIsProcessing(true);
    const newProcessedLinks: ProcessedLink[] = [];

    // Initialize processing state for all URLs
    const initialLinks = urls.map(url => ({
      id: Math.random().toString(36).substr(2, 9),
      url,
      companyName: "",
      segment: "",
      tags: [],
      location: "",
      technologies: [],
      status: "processing" as const
    }));

    setProcessedLinks(prev => [...prev, ...initialLinks]);

    // Process each URL
    for (const url of urls) {
      try {
        const processed = await processUrl(url);
        setProcessedLinks(prev => 
          prev.map(link => 
            link.url === url ? { ...processed, id: link.id } : link
          )
        );
        newProcessedLinks.push(processed);
      } catch (error) {
        const errorLink: ProcessedLink = {
          id: Math.random().toString(36).substr(2, 9),
          url,
          companyName: "",
          segment: "",
          tags: [],
          location: "",
          technologies: [],
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error"
        };
        setProcessedLinks(prev => 
          prev.map(link => 
            link.url === url ? errorLink : link
          )
        );
      }
    }

    setIsProcessing(false);
    setInputText("");
    onLinksProcessed?.(newProcessedLinks.filter(link => link.status === "success"));
  }, [inputText, extractUrls, processUrl, onLinksProcessed]);

  const handleRemoveLink = useCallback((id: string) => {
    setProcessedLinks(prev => prev.filter(link => link.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setProcessedLinks([]);
    setInputText("");
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleProcessLinks();
    }
  }, [handleProcessLinks]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input Section */}
      <div className="space-y-3">
        <div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Paste URLs here (separated by spaces, commas, or new lines)...&#10;Example:&#10;https://notion.so"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
            disabled={isProcessing}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleProcessLinks}
            disabled={!extractUrls(inputText).length || isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                Process Links ({extractUrls(inputText).length} found)
              </>
            )}
          </button>

          {processedLinks.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500">
          💡 Tip: Press Ctrl+Enter (or Cmd+Enter) to process links quickly
        </div>
      </div>

      {/* Results Section */}
      {processedLinks.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">
            Processed Links ({processedLinks.filter(l => l.status === "success").length}/{processedLinks.length})
          </h4>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {processedLinks.map((link) => (
              <div
                key={link.id}
                className={`p-4 border rounded-lg ${
                  link.status === "success" 
                    ? "border-green-200 bg-green-50" 
                    : link.status === "error"
                    ? "border-red-200 bg-red-50"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {link.status === "processing" && (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      )}
                      {link.status === "success" && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {link.status === "error" && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 truncate"
                      >
                        {link.url}
                      </a>
                    </div>

                    {link.status === "processing" && (
                      <div className="text-sm text-blue-600">
                        Extracting company information...
                      </div>
                    )}

                    {link.status === "error" && (
                      <div className="text-sm text-red-600">
                        {link.error || "Failed to process this URL"}
                      </div>
                    )}

                    {link.status === "success" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{link.companyName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <span>{link.segment}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{link.location}</span>
                          </div>
                        </div>

                        {link.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {link.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {link.technologies.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Tech: {link.technologies.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemoveLink(link.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkProcessor; 
