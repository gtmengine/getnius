export interface UseCaseContext {
  searchQuery?: string;
  selectedCategory?: string;
  customCategory?: string;
  industry?: string;
  companyType?: string;
  analysisType?: string;
}

export interface ColumnSuggestion {
  name: string;
  priority: number;
  reason: string;
  category: 'basic' | 'financial' | 'operational' | 'contact' | 'social' | 'technical' | 'market';
}

// Define column categories and their base suggestions
const COLUMN_CATEGORIES = {
  basic: ['Company Name', 'Industry', 'Location', 'Founded Year', 'Description'],
  financial: ['Funding', 'Revenue', 'Market Cap', 'Valuation', 'Funding Stage'],
  operational: ['Employee Count', 'Company Size', 'Business Model', 'Growth Rate'],
  contact: ['Website', 'Phone Number', 'Email', 'LinkedIn'],
  social: ['Social Media', 'Twitter', 'Facebook', 'Instagram'],
  technical: ['Technology Stack', 'Tech Stack', 'Platform', 'API'],
  market: ['Market Position', 'Competitors', 'Market Share', 'Target Market']
};

// Use case patterns to match against search queries
const USE_CASE_PATTERNS = {
  competitive: ['competitor', 'competition', 'rival', 'vs', 'alternative', 'compare'],
  investment: ['investment', 'funding', 'venture', 'capital', 'investor', 'valuation'],
  partnership: ['partner', 'partnership', 'collaboration', 'alliance', 'integration'],
  acquisition: ['acquisition', 'merger', 'buyout', 'takeover', 'exit'],
  recruitment: ['hiring', 'recruitment', 'talent', 'employee', 'team', 'career'],
  technology: ['tech', 'technology', 'software', 'platform', 'api', 'stack'],
  market: ['market', 'industry', 'sector', 'niche', 'segment'],
  startup: ['startup', 'start-up', 'early-stage', 'seed', 'series a'],
  enterprise: ['enterprise', 'b2b', 'corporate', 'large', 'enterprise'],
  consumer: ['consumer', 'b2c', 'retail', 'customer', 'user']
};

export function generateColumnSuggestions(context: UseCaseContext): ColumnSuggestion[] {
  const suggestions: ColumnSuggestion[] = [];
  const searchQuery = context.searchQuery?.toLowerCase() || '';
  const category = context.selectedCategory?.toLowerCase() || context.customCategory?.toLowerCase() || '';

  // Always include basic columns
  suggestions.push(
    { name: 'Company Name', priority: 1, reason: 'Essential company identifier', category: 'basic' },
    { name: 'Industry', priority: 1, reason: 'Core business classification', category: 'basic' },
    { name: 'Location', priority: 2, reason: 'Geographic information', category: 'basic' }
  );

  // Analyze search query for use case patterns
  const detectedUseCases: string[] = [];
  
  Object.entries(USE_CASE_PATTERNS).forEach(([useCase, patterns]) => {
    if (patterns.some(pattern => searchQuery.includes(pattern))) {
      detectedUseCases.push(useCase);
    }
  });

  // Add suggestions based on detected use cases
  detectedUseCases.forEach(useCase => {
    switch (useCase) {
      case 'competitive':
        suggestions.push(
          { name: 'Market Position', priority: 3, reason: 'Competitive positioning analysis', category: 'market' },
          { name: 'Competitors', priority: 3, reason: 'Direct competitor identification', category: 'market' },
          { name: 'Business Model', priority: 4, reason: 'Revenue model comparison', category: 'operational' },
          { name: 'Technology Stack', priority: 4, reason: 'Technical capability comparison', category: 'technical' }
        );
        break;
      
      case 'investment':
        suggestions.push(
          { name: 'Funding', priority: 3, reason: 'Investment history and amounts', category: 'financial' },
          { name: 'Valuation', priority: 3, reason: 'Company valuation data', category: 'financial' },
          { name: 'Funding Stage', priority: 4, reason: 'Investment round information', category: 'financial' },
          { name: 'Revenue', priority: 4, reason: 'Financial performance metrics', category: 'financial' },
          { name: 'Growth Rate', priority: 5, reason: 'Growth trajectory analysis', category: 'operational' }
        );
        break;
      
      case 'partnership':
        suggestions.push(
          { name: 'Technology Stack', priority: 3, reason: 'Integration compatibility', category: 'technical' },
          { name: 'Business Model', priority: 3, reason: 'Partnership potential assessment', category: 'operational' },
          { name: 'Market Position', priority: 4, reason: 'Market reach and influence', category: 'market' },
          { name: 'LinkedIn', priority: 4, reason: 'Professional network connections', category: 'contact' }
        );
        break;
      
      case 'acquisition':
        suggestions.push(
          { name: 'Revenue', priority: 3, reason: 'Financial performance for valuation', category: 'financial' },
          { name: 'Market Cap', priority: 3, reason: 'Market capitalization data', category: 'financial' },
          { name: 'Employee Count', priority: 4, reason: 'Organizational size assessment', category: 'operational' },
          { name: 'Technology Stack', priority: 4, reason: 'Technical asset evaluation', category: 'technical' },
          { name: 'Market Position', priority: 5, reason: 'Market share and competitive position', category: 'market' }
        );
        break;
      
      case 'recruitment':
        suggestions.push(
          { name: 'Employee Count', priority: 3, reason: 'Current team size', category: 'operational' },
          { name: 'Company Size', priority: 3, reason: 'Organization scale', category: 'operational' },
          { name: 'Location', priority: 3, reason: 'Geographic presence for hiring', category: 'basic' },
          { name: 'Technology Stack', priority: 4, reason: 'Technical skills needed', category: 'technical' },
          { name: 'LinkedIn', priority: 4, reason: 'Professional networking', category: 'contact' }
        );
        break;
      
      case 'technology':
        suggestions.push(
          { name: 'Technology Stack', priority: 3, reason: 'Technical capabilities and tools', category: 'technical' },
          { name: 'Platform', priority: 3, reason: 'Technology platform information', category: 'technical' },
          { name: 'API', priority: 4, reason: 'API availability and integration', category: 'technical' },
          { name: 'Employee Count', priority: 4, reason: 'Technical team size', category: 'operational' }
        );
        break;
      
      case 'market':
        suggestions.push(
          { name: 'Market Position', priority: 3, reason: 'Market positioning analysis', category: 'market' },
          { name: 'Target Market', priority: 3, reason: 'Target audience and market segment', category: 'market' },
          { name: 'Market Share', priority: 4, reason: 'Market dominance metrics', category: 'market' },
          { name: 'Competitors', priority: 4, reason: 'Competitive landscape', category: 'market' }
        );
        break;
      
      case 'startup':
        suggestions.push(
          { name: 'Funding', priority: 3, reason: 'Funding stage and amounts', category: 'financial' },
          { name: 'Funding Stage', priority: 3, reason: 'Investment round information', category: 'financial' },
          { name: 'Founded Year', priority: 3, reason: 'Company age and maturity', category: 'basic' },
          { name: 'Growth Rate', priority: 4, reason: 'Growth trajectory', category: 'operational' },
          { name: 'Employee Count', priority: 4, reason: 'Team size and scaling', category: 'operational' }
        );
        break;
      
      case 'enterprise':
        suggestions.push(
          { name: 'Revenue', priority: 3, reason: 'Enterprise revenue metrics', category: 'financial' },
          { name: 'Employee Count', priority: 3, reason: 'Organization size', category: 'operational' },
          { name: 'Market Cap', priority: 3, reason: 'Market capitalization', category: 'financial' },
          { name: 'Business Model', priority: 4, reason: 'Enterprise business model', category: 'operational' },
          { name: 'Technology Stack', priority: 4, reason: 'Enterprise technology infrastructure', category: 'technical' }
        );
        break;
      
      case 'consumer':
        suggestions.push(
          { name: 'Social Media', priority: 3, reason: 'Consumer engagement channels', category: 'social' },
          { name: 'Target Market', priority: 3, reason: 'Consumer audience targeting', category: 'market' },
          { name: 'Business Model', priority: 4, reason: 'Consumer business model', category: 'operational' },
          { name: 'Website', priority: 4, reason: 'Consumer-facing digital presence', category: 'contact' }
        );
        break;
    }
  });

  // Add category-based suggestions
  if (category.includes('competitive') || category.includes('analysis')) {
    suggestions.push(
      { name: 'Competitors', priority: 3, reason: 'Competitive analysis requirement', category: 'market' },
      { name: 'Market Position', priority: 4, reason: 'Market positioning data', category: 'market' }
    );
  }

  if (category.includes('investment') || category.includes('financial')) {
    suggestions.push(
      { name: 'Funding', priority: 3, reason: 'Investment analysis requirement', category: 'financial' },
      { name: 'Revenue', priority: 3, reason: 'Financial performance data', category: 'financial' }
    );
  }

  if (category.includes('recruitment') || category.includes('hiring')) {
    suggestions.push(
      { name: 'Employee Count', priority: 3, reason: 'Recruitment analysis requirement', category: 'operational' },
      { name: 'Location', priority: 3, reason: 'Geographic hiring considerations', category: 'basic' }
    );
  }

  // Remove duplicates and sort by priority
  const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
    index === self.findIndex(s => s.name === suggestion.name)
  );

  return uniqueSuggestions.sort((a, b) => a.priority - b.priority);
}

export function getSuggestedColumns(context: UseCaseContext): string[] {
  const suggestions = generateColumnSuggestions(context);
  // Return column names with priority <= 4 (higher priority suggestions)
  return suggestions
    .filter(s => s.priority <= 4)
    .map(s => s.name);
}

export function getColumnReason(columnName: string, context: UseCaseContext): string {
  const suggestions = generateColumnSuggestions(context);
  const suggestion = suggestions.find(s => s.name === columnName);
  return suggestion?.reason || 'Additional data point';
} 