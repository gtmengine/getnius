import { TabId } from './grid-columns';

// Sample Companies Data
export const sampleCompanies = [
  {
    id: '1',
    name: 'Noon',
    description: 'Dubai-based e-commerce and marketplace platform',
    location: 'United Arab Emirates',
    founded: 2017,
    employees: '1000+',
    status: 'Active',
    revenue: '$500M+',
    people: 12,
    news: 8,
    logo: '/placeholder.svg',
    matchStatus: 'match' as const
  },
  {
    id: '2',
    name: 'Careem',
    description: 'Ride-hailing and delivery super app',
    location: 'United Arab Emirates',
    founded: 2012,
    employees: '5000+',
    status: 'Active',
    revenue: '$1B+',
    people: 25,
    news: 15,
    logo: '/placeholder.svg',
    matchStatus: 'not-match' as const
  },
  {
    id: '3',
    name: 'Kitopi',
    description: 'Cloud kitchen and food-tech platform',
    location: 'United Arab Emirates',
    founded: 2018,
    employees: '500-1000',
    status: 'Active',
    revenue: '$100M+',
    people: 8,
    news: 6,
    logo: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Anghami',
    description: 'Music streaming platform for MENA region',
    location: 'Lebanon',
    founded: 2012,
    employees: '200-500',
    status: 'Active',
    revenue: '$50M+',
    people: 5,
    news: 4,
    logo: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Swvl',
    description: 'Mass transit and shared mobility solutions',
    location: 'Egypt',
    founded: 2017,
    employees: '500-1000',
    status: 'Active',
    revenue: '$75M+',
    people: 10,
    news: 7,
    logo: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Fawry',
    description: 'Electronic payments and digital finance',
    location: 'Egypt',
    founded: 2008,
    employees: '2000+',
    status: 'Active',
    revenue: '$200M+',
    people: 15,
    news: 9,
    logo: '/placeholder.svg'
  },
  {
    id: '7',
    name: 'Fetchr',
    description: 'Last-mile delivery and logistics platform',
    location: 'United Arab Emirates',
    founded: 2012,
    employees: '200-500',
    status: 'Active',
    revenue: '$30M+',
    people: 6,
    news: 3,
    logo: '/placeholder.svg'
  },
  {
    id: '8',
    name: 'PropertyFinder',
    description: 'Real estate marketplace for MENA',
    location: 'United Arab Emirates',
    founded: 2007,
    employees: '500-1000',
    status: 'Active',
    revenue: '$80M+',
    people: 12,
    news: 5,
    logo: '/placeholder.svg'
  },
];

// Sample People Data
export const samplePeople = [
  { id: '1', name: 'Sarah Chen', company: 'TechFlow Solutions', role: 'CTO', location: 'San Francisco, CA', email: 'sarah.chen@techflow.com', intents: 4, matchStatus: 'match' as const },
  { id: '2', name: 'Marcus Johnson', company: 'TechFlow Solutions', role: 'VP Engineering', location: 'San Francisco, CA', email: 'marcus.johnson@techflow.com', intents: 2, matchStatus: 'not-match' as const },
  { id: '3', name: 'Elena Rodriguez', company: 'DataDriven Inc', role: 'Chief Data Scientist', location: 'Austin, TX', email: 'elena.rodriguez@datadriven.com', intents: 5 },
  { id: '4', name: 'Ahmed Hassan', company: 'Noon', role: 'VP Product', location: 'Dubai, UAE', email: 'ahmed.hassan@noon.com', intents: 3 },
  { id: '5', name: 'Priya Sharma', company: 'Careem', role: 'Head of Engineering', location: 'Dubai, UAE', email: 'priya.sharma@careem.com', intents: 6 },
  { id: '6', name: 'Mohammed Al-Rashid', company: 'Kitopi', role: 'CEO', location: 'Dubai, UAE', email: 'm.rashid@kitopi.com', intents: 8 },
  { id: '7', name: 'Lisa Wang', company: 'Anghami', role: 'CPO', location: 'Beirut, Lebanon', email: 'lisa.wang@anghami.com', intents: 2 },
  { id: '8', name: 'Omar Khaled', company: 'Swvl', role: 'COO', location: 'Cairo, Egypt', email: 'omar.khaled@swvl.com', intents: 4 },
];

// Sample News Data
export const sampleNews = [
  { id: '1', title: 'Noon Raises $500M in Series D Funding Round', source: 'TechCrunch', date: '2026-01-05', company: 'Noon', summary: 'E-commerce giant Noon secures massive funding to expand across MENA region with new fulfillment centers.', significance_score: 8.5, relevance_score: 9.2, matchStatus: 'match' as const },
  { id: '2', title: 'Careem Launches Super App in Saudi Arabia', source: 'Bloomberg', date: '2026-01-04', company: 'Careem', summary: 'Uber-owned Careem expands its super app services to include food delivery and payments in KSA.', significance_score: 7.8, relevance_score: 8.7 },
  { id: '3', title: 'Kitopi Opens 50 New Cloud Kitchens in UAE', source: 'Arabian Business', date: '2026-01-03', company: 'Kitopi', summary: 'Food-tech unicorn accelerates expansion with new cloud kitchen locations across Dubai and Abu Dhabi.', significance_score: 6.2, relevance_score: 7.1 },
  { id: '4', title: 'Anghami Goes Public on NASDAQ', source: 'Reuters', date: '2026-01-02', company: 'Anghami', summary: 'Arab world\'s leading music streaming platform becomes first Arab tech company to list on NASDAQ.', significance_score: 9.1, relevance_score: 9.8 },
  { id: '5', title: 'Swvl Expands Mass Transit to Latin America', source: 'The Verge', date: '2026-01-01', company: 'Swvl', summary: 'Egyptian mobility startup enters Latin American market with bus booking services in Mexico and Colombia.', significance_score: 7.3, relevance_score: 8.0 },
  { id: '6', title: 'Fawry Partners with Major Banks for Digital Payments', source: 'Fintech News', date: '2025-12-30', company: 'Fawry', summary: 'Egypt\'s leading fintech company announces strategic partnerships with five major banks.', significance_score: 6.8, relevance_score: 7.5 },
];

// Sample Signals Data
export const sampleSignals = [
  { id: '1', signalType: 'Funding', company: 'Noon', date: '2026-01-05', confidence: 'High', source: 'https://techcrunch.com/noon-funding', description: 'Series D funding round of $500M led by SoftBank' },
  { id: '2', signalType: 'Acquisition', company: 'Careem', date: '2026-01-04', confidence: 'High', source: 'https://bloomberg.com/careem-acquisition', description: 'Acquired local delivery startup for $50M' },
  { id: '3', signalType: 'Leadership', company: 'Kitopi', date: '2026-01-03', confidence: 'Medium', source: 'https://linkedin.com/kitopi-cto', description: 'New CTO appointed from Amazon' },
  { id: '4', signalType: 'Expansion', company: 'Anghami', date: '2026-01-02', confidence: 'High', source: 'https://reuters.com/anghami-expansion', description: 'Expanding to 5 new MENA countries' },
  { id: '5', signalType: 'Product', company: 'Swvl', date: '2026-01-01', confidence: 'Medium', source: 'https://theverge.com/swvl-product', description: 'Launching corporate shuttle service' },
  { id: '6', signalType: 'Partnership', company: 'Fawry', date: '2025-12-30', confidence: 'High', source: 'https://fintechnews.com/fawry', description: 'Strategic partnership with Visa for card issuance' },
  { id: '7', signalType: 'Layoff', company: 'TechStartup XYZ', date: '2025-12-28', confidence: 'High', source: 'https://layoffs.fyi/xyz', description: '20% workforce reduction announced' },
];

// Sample Market Reports Data
export const sampleMarketReports = [
  { id: '1', title: 'MENA E-commerce Market Report 2026', publisher: 'McKinsey & Company', date: '2026-01-01', region: 'Middle East', category: 'E-commerce', pages: 85 },
  { id: '2', title: 'GCC FinTech Landscape Analysis', publisher: 'Deloitte', date: '2025-12-15', region: 'GCC', category: 'FinTech', pages: 120 },
  { id: '3', title: 'Food Tech & Cloud Kitchen Trends', publisher: 'BCG', date: '2025-12-01', region: 'Global', category: 'Food Tech', pages: 95 },
  { id: '4', title: 'Mobility Solutions in Emerging Markets', publisher: 'Bain & Company', date: '2025-11-20', region: 'MENA & LATAM', category: 'Mobility', pages: 78 },
  { id: '5', title: 'Digital Payments Revolution in Africa', publisher: 'PwC', date: '2025-11-15', region: 'Africa', category: 'Payments', pages: 110 },
  { id: '6', title: 'SaaS Market in MENA Region', publisher: 'Gartner', date: '2025-11-01', region: 'MENA', category: 'SaaS', pages: 65 },
];

// Sample Patents Data
export const samplePatents = [
  { id: '1', title: 'Machine Learning Algorithm for Predictive Delivery Routing', type: 'Patent', inventor: 'Dr. Sarah Mitchell', company: 'Fetchr', dateFiled: '2025-11-30', status: 'Granted' },
  { id: '2', title: 'Blockchain-Based Payment Verification System', type: 'Patent', inventor: 'James Chen', company: 'Fawry', dateFiled: '2025-11-15', status: 'Pending' },
  { id: '3', title: 'AI-Powered Kitchen Capacity Optimization', type: 'Patent', inventor: 'Maria Gonzalez', company: 'Kitopi', dateFiled: '2025-10-28', status: 'Filed' },
  { id: '4', title: 'Real-time Traffic Prediction for Mass Transit', type: 'Patent', inventor: 'Omar Youssef', company: 'Swvl', dateFiled: '2025-10-15', status: 'Granted' },
  { id: '5', title: 'Personalized Music Recommendation Engine', type: 'Research Paper', inventor: 'Dr. Ali Hassan', company: 'Anghami', dateFiled: '2025-10-01', status: 'Published' },
  { id: '6', title: 'Dynamic Pricing Model for Ride-Sharing', type: 'Patent', inventor: 'Fatima Al-Saud', company: 'Careem', dateFiled: '2025-09-20', status: 'Pending' },
];

// Sample Research Papers Data
export const sampleResearchPapers = [
  { id: '1', title: 'Deep Learning Approaches for Arabic Text Processing in E-commerce', authors: 'Ahmed Hassan, Fatima Al-Zahra', journal: 'IEEE Transactions on Computational Intelligence', publicationDate: '2025-12-15', citations: 45, field: 'NLP' },
  { id: '2', title: 'Blockchain Applications in Supply Chain Management: A MENA Perspective', authors: 'Omar Khaled, Sarah Mitchell', journal: 'International Journal of Information Management', publicationDate: '2025-11-28', citations: 78, field: 'Blockchain' },
  { id: '3', title: 'AI-Driven Personalization in Music Streaming Platforms', authors: 'Dr. Ali Hassan, Maria Gonzalez', journal: 'ACM Transactions on Intelligent Systems', publicationDate: '2025-11-10', citations: 123, field: 'AI/ML' },
  { id: '4', title: 'Machine Learning for Predictive Maintenance in Manufacturing', authors: 'James Chen, Priya Sharma', journal: 'Journal of Manufacturing Science and Engineering', publicationDate: '2025-10-22', citations: 67, field: 'IoT' },
  { id: '5', title: 'User Behavior Analysis in Ride-Sharing Applications', authors: 'Elena Rodriguez, Marcus Johnson', journal: 'Transportation Research Part C', publicationDate: '2025-10-05', citations: 89, field: 'Data Science' },
  { id: '6', title: 'Computer Vision Applications in Retail Analytics', authors: 'Lisa Wang, Mohammed Al-Rashid', journal: 'Computer Vision and Image Understanding', publicationDate: '2025-09-18', citations: 156, field: 'Computer Vision' },
];

// Map of sample data by tab
export const sampleDataMap: Record<TabId, any[]> = {
  companies: sampleCompanies,
  people: samplePeople,
  news: sampleNews,
  signals: sampleSignals,
  market: sampleMarketReports,
  patents: samplePatents,
  'research-papers': sampleResearchPapers,
};

// Helper to get empty data for a tab
export const getEmptyData = (): Record<TabId, any[]> => ({
  companies: [],
  people: [],
  news: [],
  signals: [],
  market: [],
  patents: [],
  'research-papers': [],
});

