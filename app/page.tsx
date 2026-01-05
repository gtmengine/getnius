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
import { DataGridLayout } from '@/components/data-grid-layout';

// Sample data for different tabs
const companiesData = [
  { name: 'Noon', desc: 'Dubai-based designer wedding platform', location: 'United Arab Emirates', founded: '5-10', year: '2021', status: '●●●', revenue: 'N/A' },
  { name: 'Souq.com', desc: 'Sustainable smart luxury and UAB', location: 'United Arab Emirates', founded: '11-50', year: '2016', status: '●●●', revenue: 'N/A' },
  { name: 'Namshi', desc: 'Online marketplace for pre-owned luxury fashion', location: 'United Arab Emirates', founded: '5-10', year: '2016', status: '●●●', revenue: 'N/A' },
  { name: 'Chipoodle', desc: 'Technology solutions and IT services provider', location: 'United States', founded: '5-10', year: '2018', status: '●●●', revenue: '$2-5M' },
  { name: 'Aliwawa', desc: 'Enterprise IT infrastructure and cloud services', location: 'United States', founded: '11-50', year: '2015', status: '●●●', revenue: '$10-25M' },
  { name: 'Ublur', desc: 'Digital transformation and IT operations consulting', location: 'United States', founded: '5-10', year: '2017', status: '●●●', revenue: '$1-2M' },
  { name: 'Tik Tack', desc: 'IT support and managed services for SMBs', location: 'United States', founded: '5-10', year: '2019', status: '●●●', revenue: '$500K-1M' },
  { name: 'Slouch', desc: 'Customer success and experience management platform', location: 'United States', founded: '11-50', year: '2016', status: '●●●', revenue: '$5-10M' },
  { name: 'TechFlow Solutions', desc: 'Enterprise software development and digital transformation', location: 'United States', founded: '51-200', year: '2012', status: '●●●', revenue: '$50-100M' },
  { name: 'DataDriven Inc', desc: 'AI and machine learning solutions for enterprises', location: 'United States', founded: '11-50', year: '2014', status: '●●●', revenue: '$15-25M' },
  { name: 'CloudSync Technologies', desc: 'Cloud infrastructure and DevOps services', location: 'United States', founded: '51-200', year: '2011', status: '●●●', revenue: '$75-150M' },
  { name: 'FinTech Innovations', desc: 'Financial technology and digital banking solutions', location: 'United States', founded: '11-50', year: '2013', status: '●●●', revenue: '$20-50M' },
  { name: 'GreenEnergy Corp', desc: 'Renewable energy and sustainable technology solutions', location: 'United States', founded: '51-200', year: '2010', status: '●●●', revenue: '$100-250M' },
  { name: 'MediCare Solutions', desc: 'Healthcare technology and digital health platforms', location: 'United States', founded: '51-200', year: '2009', status: '●●●', revenue: '$150-300M' },
  { name: 'AutoDrive Systems', desc: 'Autonomous vehicle technology and ADAS systems', location: 'United States', founded: '201-500', year: '2016', status: '●●●', revenue: '$500M-1B' },
  { name: 'EduTech Platform', desc: 'Educational technology and learning management systems', location: 'United States', founded: '11-50', year: '2015', status: '●●●', revenue: '$10-25M' },
  { name: 'FashionForward', desc: 'Luxury fashion e-commerce and digital retail', location: 'Italy', founded: '51-200', year: '2012', status: '●●●', revenue: '€50-100M' },
  { name: 'Sustainable Foods Co', desc: 'Sustainable agriculture and food technology', location: 'France', founded: '11-50', year: '2014', status: '●●●', revenue: '€20-50M' },
  { name: 'SpaceTech Labs', desc: 'Space technology and satellite communications', location: 'United States', founded: '51-200', year: '2013', status: '●●●', revenue: '$100-250M' },
  { name: 'RetailPlus Chain', desc: 'Omnichannel retail technology and POS systems', location: 'Spain', founded: '51-200', year: '2011', status: '●●●', revenue: '€75-150M' },
  { name: 'GameDev Studios', desc: 'Video game development and interactive entertainment', location: 'Russia', founded: '11-50', year: '2016', status: '●●●', revenue: '$5-15M' },
  { name: 'Doha Logistics', desc: 'Supply chain and logistics technology solutions', location: 'Qatar', founded: '51-200', year: '2010', status: '●●●', revenue: '$50-100M' },
];

const peopleData = [
  { name: 'Donald Reussens', company: 'BIO / Mapletree GMPP', role: 'CEO', location: 'Ben Arene Europe', email: 'email-reussens@GMPTN', profile: 'LinkedIn' },
  { name: 'Christophe Bosson', company: 'BIO / Mapletree GMPP', role: 'Business Development / CFO', location: 'Ben Arene Europe', email: 'chbo@linkedin.com/in/U', profile: 'LinkedIn' },
  // New contacts added
  { name: 'Frances Fisher', company: 'Chipoodle', role: 'Technology Manager', location: 'United States', email: 'frances.fisher@chipoodle.com', profile: 'chipoodle.com' },
  { name: 'William Floyd', company: 'Aliwawa', role: 'IT Services Manager', location: 'United States', email: 'william.floyd@aliwawa.com', profile: 'aliwawa.com' },
  { name: 'Lauren Chaney', company: 'Ublur', role: 'IT Operations', location: 'United States', email: 'lauren.c@ublur.com', profile: 'ublur.com' },
  { name: 'John Hall', company: 'Tik Tack', role: 'Sr. IT Support Tech', location: 'United States', email: 'john.hall@tiktack.com', profile: 'tictack.com' },
  { name: 'Amy Pierce', company: 'Slouch', role: 'Customer Success Manager', location: 'United States', email: 'amy.pierce@slouch.com', profile: 'slouch.com' },

  // Additional mock data for diverse companies
  { name: 'Sarah Chen', company: 'TechFlow Solutions', role: 'CTO', location: 'San Francisco, CA', email: 'sarah.chen@techflow.com', profile: 'linkedin.com/in/sarahchen' },
  { name: 'Marcus Johnson', company: 'TechFlow Solutions', role: 'VP Engineering', location: 'San Francisco, CA', email: 'marcus.johnson@techflow.com', profile: 'linkedin.com/in/marcusjohnson' },
  { name: 'Elena Rodriguez', company: 'DataDriven Inc', role: 'Chief Data Scientist', location: 'Austin, TX', email: 'elena.rodriguez@datadriven.com', profile: 'linkedin.com/in/elenarodriguez' },
  { name: 'James Wilson', company: 'DataDriven Inc', role: 'Product Manager', location: 'Austin, TX', email: 'james.wilson@datadriven.com', profile: 'linkedin.com/in/jameswilson' },
  { name: 'Priya Patel', company: 'CloudSync Technologies', role: 'Head of Cloud Operations', location: 'Seattle, WA', email: 'priya.patel@cloudsync.com', profile: 'linkedin.com/in/priyapatel' },
  { name: 'David Kim', company: 'CloudSync Technologies', role: 'Senior DevOps Engineer', location: 'Seattle, WA', email: 'david.kim@cloudsync.com', profile: 'linkedin.com/in/davidkim' },
  { name: 'Maria Garcia', company: 'FinTech Innovations', role: 'VP of Product', location: 'New York, NY', email: 'maria.garcia@fintechinnovations.com', profile: 'linkedin.com/in/mariagarcia' },
  { name: 'Robert Taylor', company: 'FinTech Innovations', role: 'Lead Software Architect', location: 'New York, NY', email: 'robert.taylor@fintechinnovations.com', profile: 'linkedin.com/in/roberttaylor' },
  { name: 'Lisa Wang', company: 'GreenEnergy Corp', role: 'Chief Sustainability Officer', location: 'Portland, OR', email: 'lisa.wang@greenenergy.com', profile: 'linkedin.com/in/lisawang' },
  { name: 'Michael Brown', company: 'GreenEnergy Corp', role: 'Director of R&D', location: 'Portland, OR', email: 'michael.brown@greenenergy.com', profile: 'linkedin.com/in/michaelbrown' },
  { name: 'Anna Kowalski', company: 'MediCare Solutions', role: 'Chief Medical Officer', location: 'Boston, MA', email: 'anna.kowalski@medicare.com', profile: 'linkedin.com/in/annakowalski' },
  { name: 'Thomas Anderson', company: 'MediCare Solutions', role: 'Head of Digital Health', location: 'Boston, MA', email: 'thomas.anderson@medicare.com', profile: 'linkedin.com/in/thomasanderson' },
  { name: 'Yuki Tanaka', company: 'AutoDrive Systems', role: 'VP Autonomous Vehicles', location: 'Detroit, MI', email: 'yuki.tanaka@autodrive.com', profile: 'linkedin.com/in/yukitanaka' },
  { name: 'Carlos Mendoza', company: 'AutoDrive Systems', role: 'Senior AI Engineer', location: 'Detroit, MI', email: 'carlos.mendoza@autodrive.com', profile: 'linkedin.com/in/carlosmendoza' },
  { name: 'Rachel Green', company: 'EduTech Platform', role: 'Founder & CEO', location: 'Chicago, IL', email: 'rachel.green@edutech.com', profile: 'linkedin.com/in/rachelgreen' },
  { name: 'Kevin Park', company: 'EduTech Platform', role: 'VP of Learning Science', location: 'Chicago, IL', email: 'kevin.park@edutech.com', profile: 'linkedin.com/in/kevinpark' },
  { name: 'Isabella Rossi', company: 'FashionForward', role: 'Creative Director', location: 'Milan, Italy', email: 'isabella.rossi@fashionforward.com', profile: 'linkedin.com/in/isabellarossi' },
  { name: 'Ahmed Hassan', company: 'FashionForward', role: 'E-commerce Manager', location: 'Milan, Italy', email: 'ahmed.hassan@fashionforward.com', profile: 'linkedin.com/in/ahmedhassan' },
  { name: 'Sophie Dubois', company: 'Sustainable Foods Co', role: 'Head of Innovation', location: 'Paris, France', email: 'sophie.dubois@sustainablefoods.com', profile: 'linkedin.com/in/sophiedubois' },
  { name: 'Raj Singh', company: 'Sustainable Foods Co', role: 'Chief Agronomist', location: 'Paris, France', email: 'raj.singh@sustainablefoods.com', profile: 'linkedin.com/in/rajsingh' },
  { name: 'Emma Thompson', company: 'SpaceTech Labs', role: 'Mission Director', location: 'Houston, TX', email: 'emma.thompson@spacetech.com', profile: 'linkedin.com/in/emmathompson' },
  { name: 'Dr. Hiroshi Sato', company: 'SpaceTech Labs', role: 'Lead Propulsion Engineer', location: 'Houston, TX', email: 'hiroshi.sato@spacetech.com', profile: 'linkedin.com/in/hiroshisato' },
  { name: 'Olivia Martinez', company: 'RetailPlus Chain', role: 'Chief Digital Officer', location: 'Madrid, Spain', email: 'olivia.martinez@retailplus.com', profile: 'linkedin.com/in/oliviamartinez' },
  { name: 'Luca Ferrari', company: 'RetailPlus Chain', role: 'VP Customer Experience', location: 'Madrid, Spain', email: 'luca.ferrari@retailplus.com', profile: 'linkedin.com/in/lucaferrari' },
  { name: 'Nina Petrov', company: 'GameDev Studios', role: 'Game Director', location: 'St. Petersburg, Russia', email: 'nina.petrov@gamedev.com', profile: 'linkedin.com/in/ninapetrov' },
  { name: 'Alex Chen', company: 'GameDev Studios', role: 'Lead Game Designer', location: 'St. Petersburg, Russia', email: 'alex.chen@gamedev.com', profile: 'linkedin.com/in/alexchen' },
  { name: 'Fatima Al-Zahra', company: 'Doha Logistics', role: 'Chief Operating Officer', location: 'Doha, Qatar', email: 'fatima.alzahra@dohalogistics.com', profile: 'linkedin.com/in/fatimaalzahra' },
  { name: 'Mohammed Al-Rashid', company: 'Doha Logistics', role: 'Supply Chain Director', location: 'Doha, Qatar', email: 'mohammed.alrashid@dohalogistics.com', profile: 'linkedin.com/in/mohammedalrashid' },
];

// Intents/Job Changes data
const intentsData = [
  // Job Changes
  {
    id: "jc1",
    type: "job_change",
    person: "Sarah Chen",
    company: "TechFlow Solutions",
    newRole: "VP of Engineering",
    previousRole: "Senior Engineering Manager",
    previousCompany: "DataDriven Inc",
    changeDate: "2025-12-15",
    confidence: "Confirmed",
    source: "LinkedIn",
    details: "Sarah Chen promoted to VP of Engineering at TechFlow Solutions"
  },
  {
    id: "jc2",
    type: "job_change",
    person: "Marcus Johnson",
    company: "TechFlow Solutions",
    newRole: "Chief Technology Officer",
    previousRole: "VP Engineering",
    previousCompany: "CloudSync Technologies",
    changeDate: "2025-11-20",
    confidence: "Likely",
    source: "Company Announcement",
    details: "Marcus Johnson joins TechFlow Solutions as CTO"
  },
  {
    id: "jc3",
    type: "job_change",
    person: "Elena Rodriguez",
    company: "DataDriven Inc",
    newRole: "Head of AI Research",
    previousRole: "Lead Data Scientist",
    previousCompany: "FinTech Innovations",
    changeDate: "2025-10-08",
    confidence: "Confirmed",
    source: "LinkedIn",
    details: "Elena Rodriguez moves to DataDriven Inc as Head of AI Research"
  },
  {
    id: "jc4",
    type: "job_change",
    person: "James Wilson",
    company: "DataDriven Inc",
    newRole: "VP of Product",
    previousRole: "Senior Product Manager",
    previousCompany: "MediCare Solutions",
    changeDate: "2025-09-15",
    confidence: "Confirmed",
    source: "Company Website",
    details: "James Wilson appointed VP of Product at DataDriven Inc"
  },
  {
    id: "jc5",
    type: "job_change",
    person: "Priya Patel",
    company: "CloudSync Technologies",
    newRole: "Director of DevOps",
    previousRole: "Senior DevOps Engineer",
    previousCompany: "GreenEnergy Corp",
    changeDate: "2025-08-22",
    confidence: "Likely",
    source: "Industry News",
    details: "Priya Patel promoted to Director of DevOps at CloudSync Technologies"
  },
  {
    id: "jc6",
    type: "job_change",
    person: "David Kim",
    company: "CloudSync Technologies",
    newRole: "Chief Information Security Officer",
    previousRole: "Security Architect",
    previousCompany: "AutoDrive Systems",
    changeDate: "2025-07-10",
    confidence: "Confirmed",
    source: "LinkedIn",
    details: "David Kim joins CloudSync Technologies as CISO"
  },
  {
    id: "jc7",
    type: "job_change",
    person: "Maria Garcia",
    company: "FinTech Innovations",
    newRole: "Chief Operating Officer",
    previousRole: "VP of Operations",
    previousCompany: "RetailPlus Chain",
    changeDate: "2025-06-05",
    confidence: "Confirmed",
    source: "Press Release",
    details: "Maria Garcia appointed COO at FinTech Innovations"
  },
  {
    id: "jc8",
    type: "job_change",
    person: "Robert Taylor",
    company: "FinTech Innovations",
    newRole: "VP of Engineering",
    previousRole: "Senior Software Architect",
    previousCompany: "SpaceTech Labs",
    changeDate: "2025-05-18",
    confidence: "Likely",
    source: "LinkedIn",
    details: "Robert Taylor moves to FinTech Innovations as VP of Engineering"
  },

  // Instagram Intent Posts
  {
    id: "ig1",
    type: "instagram_post",
    person: "Lisa Wang",
    company: "GreenEnergy Corp",
    intent: "I need a marketing automation platform",
    platform: "Instagram",
    postDate: "2025-12-20",
    confidence: "High",
    source: "Social Media",
    details: "Lisa Wang posted about needing marketing automation tools on Instagram"
  },
  {
    id: "ig2",
    type: "instagram_post",
    person: "Michael Brown",
    company: "GreenEnergy Corp",
    intent: "Looking for renewable energy consultants",
    platform: "Instagram",
    postDate: "2025-11-28",
    confidence: "Medium",
    source: "Social Media",
    details: "Michael Brown seeking renewable energy consulting services"
  },
  {
    id: "ig3",
    type: "instagram_post",
    person: "Anna Kowalski",
    company: "MediCare Solutions",
    intent: "Need healthcare analytics platform",
    platform: "Instagram",
    postDate: "2025-10-15",
    confidence: "High",
    source: "Social Media",
    details: "Anna Kowalski looking for healthcare data analytics solutions"
  },

  // Website Form Submissions
  {
    id: "wf1",
    type: "website_form",
    person: "Thomas Anderson",
    company: "MediCare Solutions",
    intent: "I filled out a form to get new insurance.",
    platform: "Company Website",
    formDate: "2025-09-30",
    confidence: "High",
    source: "Website Analytics",
    details: "Thomas Anderson submitted insurance inquiry form on MediCare Solutions website"
  },
  {
    id: "wf2",
    type: "website_form",
    person: "Yuki Tanaka",
    company: "AutoDrive Systems",
    intent: "Requesting autonomous vehicle demo",
    platform: "Company Website",
    formDate: "2025-08-12",
    confidence: "High",
    source: "Website Analytics",
    details: "Yuki Tanaka requested autonomous vehicle technology demo"
  },
  {
    id: "wf3",
    type: "website_form",
    person: "Carlos Mendoza",
    company: "AutoDrive Systems",
    intent: "Interested in AI partnership opportunities",
    platform: "Company Website",
    formDate: "2025-07-25",
    confidence: "Medium",
    source: "Website Analytics",
    details: "Carlos Mendoza inquired about AI technology partnerships"
  },
  {
    id: "wf4",
    type: "website_form",
    person: "Rachel Green",
    company: "EduTech Platform",
    intent: "Need learning management system quote",
    platform: "Company Website",
    formDate: "2025-06-18",
    confidence: "High",
    source: "Website Analytics",
    details: "Rachel Green requested LMS pricing and demo"
  },
  {
    id: "wf5",
    type: "website_form",
    person: "Kevin Park",
    company: "EduTech Platform",
    intent: "Looking for educational content partners",
    platform: "Company Website",
    formDate: "2025-05-30",
    confidence: "Medium",
    source: "Website Analytics",
    details: "Kevin Park interested in content partnership opportunities"
  },

  // Additional Intent Types
  {
    id: "em1",
    type: "email_inquiry",
    person: "Isabella Rossi",
    company: "FashionForward",
    intent: "Requesting fashion tech partnership discussion",
    platform: "Email",
    inquiryDate: "2025-11-10",
    confidence: "High",
    source: "Email System",
    details: "Isabella Rossi emailed about fashion technology partnerships"
  },
  {
    id: "em2",
    type: "email_inquiry",
    person: "Ahmed Hassan",
    company: "FashionForward",
    intent: "Need e-commerce platform recommendations",
    platform: "Email",
    inquiryDate: "2025-10-22",
    confidence: "Medium",
    source: "Email System",
    details: "Ahmed Hassan seeking e-commerce platform recommendations"
  },

  // Additional Job Changes
  {
    id: "jc9",
    type: "job_change",
    person: "Emma Thompson",
    company: "SpaceTech Labs",
    newRole: "Chief Technology Officer",
    previousRole: "VP Engineering",
    previousCompany: "MediCare Solutions",
    changeDate: "2025-04-12",
    confidence: "Likely",
    source: "Industry Newsletter",
    details: "Emma Thompson transitioning to CTO role at SpaceTech Labs"
  },
  {
    id: "jc10",
    type: "job_change",
    person: "Carlos Mendoza",
    company: "AutoDrive Systems",
    newRole: "Director of AI Ethics",
    previousRole: "Senior AI Engineer",
    previousCompany: "EduTech Platform",
    changeDate: "2025-03-28",
    confidence: "Confirmed",
    source: "LinkedIn",
    details: "Carlos Mendoza moves to AI Ethics role at AutoDrive Systems"
  },
  {
    id: "jc11",
    type: "job_change",
    person: "Rachel Green",
    company: "EduTech Platform",
    newRole: "Chief Learning Officer",
    previousRole: "Founder & CEO",
    previousCompany: "Sustainable Foods Co",
    changeDate: "2025-02-15",
    confidence: "Confirmed",
    source: "Company Press Release",
    details: "Rachel Green appointed CLO at EduTech Platform"
  },

  // More Social Media Intents
  {
    id: "li1",
    type: "linkedin_post",
    person: "Donald Reussens",
    company: "BIO / Mapletree GMPP",
    intent: "Looking for strategic partnerships in biotech",
    platform: "LinkedIn",
    postDate: "2025-12-18",
    confidence: "High",
    source: "Social Media",
    details: "Donald Reussens posted about seeking biotech partnerships on LinkedIn"
  },
  {
    id: "li2",
    type: "linkedin_post",
    person: "Christophe Bosson",
    company: "BIO / Mapletree GMPP",
    intent: "Interested in CFO networking opportunities",
    platform: "LinkedIn",
    postDate: "2025-11-25",
    confidence: "Medium",
    source: "Social Media",
    details: "Christophe Bosson looking for CFO networking events"
  },
  {
    id: "tw1",
    type: "twitter_post",
    person: "Frances Fisher",
    company: "Chipoodle",
    intent: "Technology modernization project starting soon",
    platform: "Twitter",
    postDate: "2025-12-10",
    confidence: "Medium",
    source: "Social Media",
    details: "Frances Fisher hints at upcoming tech modernization at Chipoodle"
  },
  {
    id: "tw2",
    type: "twitter_post",
    person: "William Floyd",
    company: "Aliwawa",
    intent: "Seeking cloud migration consultants",
    platform: "Twitter",
    postDate: "2025-11-30",
    confidence: "High",
    source: "Social Media",
    details: "William Floyd looking for cloud migration expertise"
  },
  {
    id: "ig3",
    type: "instagram_post",
    person: "Lauren Chaney",
    company: "Ublur",
    intent: "Digital transformation initiative underway",
    platform: "Instagram",
    postDate: "2025-10-08",
    confidence: "Medium",
    source: "Social Media",
    details: "Lauren Chaney mentions digital transformation project at Ublur"
  },

  // More Website Form Submissions
  {
    id: "wf5",
    type: "website_form",
    person: "John Hall",
    company: "Tik Tack",
    intent: "Requesting cybersecurity assessment",
    platform: "Company Website",
    formDate: "2025-09-20",
    confidence: "High",
    source: "Website Analytics",
    details: "John Hall submitted cybersecurity assessment request form"
  },
  {
    id: "wf6",
    type: "website_form",
    person: "Amy Pierce",
    company: "Slouch",
    intent: "Customer success workshop registration",
    platform: "Company Website",
    formDate: "2025-08-15",
    confidence: "High",
    source: "Website Analytics",
    details: "Amy Pierce registered for customer success workshop"
  },
  {
    id: "wf7",
    type: "website_form",
    person: "Sarah Chen",
    company: "TechFlow Solutions",
    intent: "Enterprise software consultation needed",
    platform: "Company Website",
    formDate: "2025-07-22",
    confidence: "High",
    source: "Website Analytics",
    details: "Sarah Chen requested enterprise software consultation"
  },
  {
    id: "wf8",
    type: "website_form",
    person: "Marcus Johnson",
    company: "TechFlow Solutions",
    intent: "Engineering team expansion planning",
    platform: "Company Website",
    formDate: "2025-06-30",
    confidence: "Medium",
    source: "Website Analytics",
    details: "Marcus Johnson inquired about team expansion services"
  },

  // More Email Inquiries
  {
    id: "em3",
    type: "email_inquiry",
    person: "Elena Rodriguez",
    company: "DataDriven Inc",
    intent: "Machine learning model optimization services",
    platform: "Email",
    inquiryDate: "2025-11-15",
    confidence: "High",
    source: "Email System",
    details: "Elena Rodriguez requested ML model optimization consultation"
  },
  {
    id: "em4",
    type: "email_inquiry",
    person: "James Wilson",
    company: "DataDriven Inc",
    intent: "Product roadmap planning assistance",
    platform: "Email",
    inquiryDate: "2025-10-28",
    confidence: "Medium",
    source: "Email System",
    details: "James Wilson seeking product roadmap planning help"
  },
  {
    id: "em5",
    type: "email_inquiry",
    person: "Priya Patel",
    company: "CloudSync Technologies",
    intent: "DevOps transformation workshop inquiry",
    platform: "Email",
    inquiryDate: "2025-09-12",
    confidence: "High",
    source: "Email System",
    details: "Priya Patel interested in DevOps transformation workshop"
  },
  {
    id: "em6",
    type: "email_inquiry",
    person: "David Kim",
    company: "CloudSync Technologies",
    intent: "CISO networking opportunities",
    platform: "Email",
    inquiryDate: "2025-08-25",
    confidence: "Medium",
    source: "Email System",
    details: "David Kim looking for CISO networking events"
  },

  // Event Registrations
  {
    id: "ev1",
    type: "event_registration",
    person: "Maria Garcia",
    company: "FinTech Innovations",
    intent: "Registered for FinTech Summit 2026",
    platform: "Event Website",
    registrationDate: "2025-12-01",
    confidence: "High",
    source: "Event Management System",
    details: "Maria Garcia registered for upcoming FinTech Summit"
  },
  {
    id: "ev2",
    type: "event_registration",
    person: "Robert Taylor",
    company: "FinTech Innovations",
    intent: "Signed up for Tech Leadership Conference",
    platform: "Event Website",
    registrationDate: "2025-11-18",
    confidence: "High",
    source: "Event Management System",
    details: "Robert Taylor registered for tech leadership conference"
  },

  // Product Demo Requests
  {
    id: "pd1",
    type: "product_demo",
    person: "Lisa Wang",
    company: "GreenEnergy Corp",
    intent: "Requested renewable energy platform demo",
    platform: "Company Website",
    demoDate: "2025-10-05",
    confidence: "High",
    source: "CRM System",
    details: "Lisa Wang scheduled renewable energy platform demonstration"
  },
  {
    id: "pd2",
    type: "product_demo",
    person: "Michael Brown",
    company: "GreenEnergy Corp",
    intent: "Booked sustainability analytics demo",
    platform: "Company Website",
    demoDate: "2025-09-18",
    confidence: "High",
    source: "CRM System",
    details: "Michael Brown requested sustainability analytics demo"
  },

  // Partnership Inquiries
  {
    id: "pi1",
    type: "partnership_inquiry",
    person: "Anna Kowalski",
    company: "MediCare Solutions",
    intent: "Exploring healthcare AI partnerships",
    platform: "Email",
    inquiryDate: "2025-08-10",
    confidence: "High",
    source: "Email System",
    details: "Anna Kowalski inquiring about healthcare AI partnerships"
  },
  {
    id: "pi2",
    type: "partnership_inquiry",
    person: "Thomas Anderson",
    company: "MediCare Solutions",
    intent: "Interested in digital health collaborations",
    platform: "LinkedIn",
    inquiryDate: "2025-07-25",
    confidence: "Medium",
    source: "Social Media",
    details: "Thomas Anderson exploring digital health partnership opportunities"
  },

  // Newsletter Subscriptions
  {
    id: "ns1",
    type: "newsletter_subscription",
    person: "Yuki Tanaka",
    company: "AutoDrive Systems",
    intent: "Subscribed to autonomous vehicle newsletter",
    platform: "Company Website",
    subscriptionDate: "2025-06-20",
    confidence: "Medium",
    source: "Email Marketing Platform",
    details: "Yuki Tanaka subscribed to receive autonomous vehicle updates"
  },
  {
    id: "ns2",
    type: "newsletter_subscription",
    person: "Carlos Mendoza",
    company: "AutoDrive Systems",
    intent: "Joined AI research newsletter",
    platform: "Company Website",
    subscriptionDate: "2025-05-15",
    confidence: "Medium",
    source: "Email Marketing Platform",
    details: "Carlos Mendoza subscribed to AI research newsletter"
  },

  // Webinar Registrations
  {
    id: "wb1",
    type: "webinar_registration",
    person: "Rachel Green",
    company: "EduTech Platform",
    intent: "Registered for EdTech Innovation Webinar",
    platform: "Webinar Platform",
    registrationDate: "2025-04-10",
    confidence: "High",
    source: "Webinar System",
    details: "Rachel Green registered for educational technology webinar"
  },
  {
    id: "wb2",
    type: "webinar_registration",
    person: "Kevin Park",
    company: "EduTech Platform",
    intent: "Signed up for Learning Analytics Session",
    platform: "Webinar Platform",
    registrationDate: "2025-03-22",
    confidence: "High",
    source: "Webinar System",
    details: "Kevin Park registered for learning analytics webinar"
  },

  // Content Downloads
  {
    id: "cd1",
    type: "content_download",
    person: "Isabella Rossi",
    company: "FashionForward",
    intent: "Downloaded fashion retail trends report",
    platform: "Company Website",
    downloadDate: "2025-02-15",
    confidence: "Medium",
    source: "Content Management System",
    details: "Isabella Rossi downloaded fashion retail trends report"
  },
  {
    id: "cd2",
    type: "content_download",
    person: "Ahmed Hassan",
    company: "FashionForward",
    intent: "Accessed e-commerce strategy guide",
    platform: "Company Website",
    downloadDate: "2025-01-28",
    confidence: "Medium",
    source: "Content Management System",
    details: "Ahmed Hassan downloaded e-commerce strategy guide"
  }
];

// Evidence Cards - Social Media Posts & Community Discussions
const evidenceCards = [
  {
    id: "ev1",
    source: "LinkedIn",
    post: "Any recs for an outreach tool that finds verified B2B emails in EU?",
    mappedContact: "Nina Walsh (Head of Growth)",
    company: "BlueCedar",
    intentTag: "vendor search",
    platform: "linkedin",
    timestamp: "2025-12-18T14:30:00Z"
  },
  {
    id: "ev2",
    source: "X",
    post: "We're replacing Intercom this quarter. What's best for B2B onboarding?",
    mappedContact: "Alex Moreno (PM)",
    company: "OrbitDesk",
    intentTag: "switching vendor",
    platform: "twitter",
    timestamp: "2025-12-17T09:15:00Z"
  },
  {
    id: "ev3",
    source: "Reddit",
    post: "Need a reliable intent data provider for mid-market SaaS. Who's actually good?",
    mappedContact: "Samir Khan (RevOps)",
    company: "PylonPay",
    intentTag: "category research",
    platform: "reddit",
    timestamp: "2025-12-16T16:45:00Z"
  },
  {
    id: "ev4",
    source: "LinkedIn",
    post: "Looking for a market research platform with sources and citations, not vibes.",
    mappedContact: "Chloe Bennett (Product Marketing)",
    company: "NovaCRM",
    intentTag: "shortlist building",
    platform: "linkedin",
    timestamp: "2025-12-15T11:20:00Z"
  },
  {
    id: "ev5",
    source: "X",
    post: "Does anyone have a strong ATS that doesn't feel like 2012?",
    mappedContact: "Hannah Schmidt (CFO)",
    company: "RetailPulse",
    intentTag: "vendor search",
    platform: "twitter",
    timestamp: "2025-12-14T13:10:00Z"
  },
  {
    id: "ev6",
    source: "LinkedIn",
    post: "We need SOC2-ready analytics tooling - any recommendations?",
    mappedContact: "Aaron Patel (IT Security)",
    company: "VantaWorks",
    intentTag: "compliance evaluation",
    platform: "linkedin",
    timestamp: "2025-12-13T10:35:00Z"
  },
  {
    id: "ev7",
    source: "Community post",
    post: "Anyone using tools to detect when key stakeholders change jobs?",
    mappedContact: "Priya Nair (CS Lead)",
    company: "HelioCore",
    intentTag: "job-change monitoring",
    platform: "community",
    timestamp: "2025-12-12T15:50:00Z"
  },
  {
    id: "ev8",
    source: "LinkedIn",
    post: "We're hiring RevOps but also need something to unify attribution + pipeline.",
    mappedContact: "Diego Alvarez (Head of RevOps)",
    company: "StackRiver",
    intentTag: "stack upgrade",
    platform: "linkedin",
    timestamp: "2025-12-11T08:25:00Z"
  },
  {
    id: "ev9",
    source: "X",
    post: "Looking for a provider to enrich company lists with domains + headcount + contacts.",
    mappedContact: "Laila Hassan (Partnerships)",
    company: "CartSpring",
    intentTag: "enrichment tooling",
    platform: "twitter",
    timestamp: "2025-12-10T12:40:00Z"
  },
  {
    id: "ev10",
    source: "LinkedIn",
    post: "Need enterprise SSO + SCIM for our sales tools stack. Suggestions?",
    mappedContact: "Kenji Tanaka (IT Director)",
    company: "BrightOps",
    intentTag: "enterprise readiness",
    platform: "linkedin",
    timestamp: "2025-12-09T14:15:00Z"
  },
  {
    id: "ev11",
    source: "Reddit",
    post: "We're evaluating new BI - Looker vs PowerBI vs something else?",
    mappedContact: "Omar Farouk (Head of Data)",
    company: "FinRail",
    intentTag: "vendor comparison",
    platform: "reddit",
    timestamp: "2025-12-08T16:30:00Z"
  },
  {
    id: "ev12",
    source: "LinkedIn",
    post: "Who has a good competitive intel workflow? Tools, not spreadsheets.",
    mappedContact: "Maya Chen (VP Growth)",
    company: "Northbeam Labs",
    intentTag: "category research",
    platform: "linkedin",
    timestamp: "2025-12-07T09:45:00Z"
  },
  {
    id: "ev13",
    source: "X",
    post: "Any tools that auto-build lead lists from a prompt, then validates sources?",
    mappedContact: "Tomas Novak (Eng Manager)",
    company: "SignalForge",
    intentTag: "tool discovery",
    platform: "twitter",
    timestamp: "2025-12-06T11:55:00Z"
  },
  {
    id: "ev14",
    source: "LinkedIn",
    post: "Need a CRM that doesn't require 3 admins to breathe.",
    mappedContact: "Marco Rossi (COO)",
    company: "ShipIQ",
    intentTag: "switching vendor",
    platform: "linkedin",
    timestamp: "2025-12-05T13:20:00Z"
  },
  {
    id: "ev15",
    source: "Community post",
    post: "Looking for an email verification API with decent deliverability.",
    mappedContact: "Ethan Brooks (VP Eng)",
    company: "DeployMate",
    intentTag: "vendor search",
    platform: "community",
    timestamp: "2025-12-04T10:10:00Z"
  },
  {
    id: "ev16",
    source: "LinkedIn",
    post: "Anyone worked with vendors for HR analytics and workforce movement?",
    mappedContact: "Sara Ibrahim (HR)",
    company: "TalentNest",
    intentTag: "procurement discovery",
    platform: "linkedin",
    timestamp: "2025-12-03T15:35:00Z"
  },
  {
    id: "ev17",
    source: "X",
    post: "We're building a partner program - need tooling for managing dev partners.",
    mappedContact: "Sophie Laurent (Procurement)",
    company: "AdLoom",
    intentTag: "tooling search",
    platform: "twitter",
    timestamp: "2025-12-02T08:50:00Z"
  },
  {
    id: "ev18",
    source: "Reddit",
    post: "Need help finding 100 target accounts in fintech Canada, any tools?",
    mappedContact: "Lucas Meyer (Head of Marketing)",
    company: "Grapple",
    intentTag: "list building",
    platform: "reddit",
    timestamp: "2025-12-01T14:25:00Z"
  },
  {
    id: "ev19",
    source: "LinkedIn",
    post: "We're done guessing - need research with evidence snippets and sources.",
    mappedContact: "Natalia Petrova (Procurement)",
    company: "MedixOne",
    intentTag: "evidence-based research",
    platform: "linkedin",
    timestamp: "2025-11-30T12:05:00Z"
  },
  {
    id: "ev20",
    source: "X",
    post: "Anyone have a good vendor for call transcript summaries + CRM sync?",
    mappedContact: "Jordan Kim (Demand Gen)",
    company: "CloudMint",
    intentTag: "evaluation",
    platform: "twitter",
    timestamp: "2025-11-29T16:40:00Z"
  }
];

const signalsData = [
  { signal: 'Job Change', person: 'Sarah Johnson', company: 'Tech Corp → Innovation Labs', date: '12/28/2025', details: 'Promoted to VP of Engineering' },
  { signal: 'New Hire', person: 'Michael Chen', company: 'Startup Inc', date: '12/27/2025', details: 'Joined as CTO' },
  // ... more signals
];

const marketReportsData = [
  { name: 'Q4 2025 Market Analysis', type: 'Market Report', topic: 'UAE E-commerce Market', date: '12/15/2025', size: '2.4 MB', format: 'PDF' },
  { name: 'Competitive Landscape Assessment', type: 'Industry Report', topic: 'FinTech Sector', date: '12/10/2025', size: '3.1 MB', format: 'PDF' },
  // ... more reports
];

const patentsData = [
  { title: 'Machine Learning Algorithm for Predictive Analytics', type: 'Patent', inventor: 'Dr. Sarah Mitchell', company: 'Tech Innovations Inc', date: '11/30/2025', number: 'US-2025-1234567', status: 'Granted' },
  { title: 'Blockchain-Based Supply Chain Management System', type: 'Patent', inventor: 'James Chen', company: 'LogiChain Solutions', date: '11/15/2025', number: 'US-2025-1234568', status: 'Pending' },
  // ... more patents
];

const newsData = [
  {
    id: "a1",
    title: "RBI weighs rules to allow remote smartphone locking after serious default",
    summary: "Draft framework would let lenders lock financed smartphones post-default with consumer safeguards. Could mainstream device-lock collateral in regulated credit.",
    industry: "Fintech",
    language: "English",
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    significance: 6.7,
    relevance: 8.9,
    clusterSize: 9,
    sources: [
      { name: "The Economic Times", url: "https://m.economictimes.com/industry/banking/finance/banking/rbi-may-allow-lenders-to-lock-your-smartphone-if-/articleshow/124041615.cms" }
    ],
    tags: ["India", "policy", "smartphone-credit"]
  },
  {
    id: "a2",
    title: "M-KOPA hits 3m active customers across five markets",
    summary: "Financed handsets remain dominant product as M-KOPA passes 3m active and 7m cumulative customers with over $2b disbursed. Targets 10m by 2030.",
    industry: "Fintech",
    language: "English",
    date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    significance: 5.9,
    relevance: 7.8,
    clusterSize: 5,
    sources: [
      { name: "M-KOPA newsroom", url: "https://www.m-kopa.com/newsroom/m-kopa-hits-3-million-active-customers-milestone-as-9-10-report-improved-quality-of-life" }
    ],
    tags: ["Africa", "scale", "lending"]
  },
  {
    id: "a3",
    title: "PayJoy marks 15m customers and expands with Smart in the Philippines",
    summary: "Company cites profitable growth in Mexico and Colombia with newer revolving credit lines. Adds fresh asset funding and new telco partner in PH.",
    industry: "Fintech",
    language: "English",
    date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    significance: 6.2,
    relevance: 8.4,
    clusterSize: 7,
    sources: [
      { name: "PayJoy press", url: "https://www.payjoy.com/press/payjoy-marks-10-years-and-15-million-customers-focused-on-expanding-responsible-financing-in-emerging-markets" }
    ],
    tags: ["LATAM", "Philippines", "asset-funding"]
  },
  {
    id: "b1",
    title: "CBK issues draft rules for non-deposit-taking credit providers",
    summary: "Proposed regulations tighten disclosure and conduct standards for lenders. Relevant to device-led credit and collections workflows in Kenya.",
    industry: "Fintech",
    language: "English",
    date: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
    significance: 5.6,
    relevance: 7.1,
    clusterSize: 3,
    sources: [
      { name: "Central Bank of Kenya", url: "https://www.centralbank.go.ke/wp-content/uploads/2025/08/Draft-Central-Bank-of-Kenya-Non-Deposit-Taking-Credit-Providers-Regulations-2025.pdf" }
    ],
    tags: ["Kenya", "regulation"]
  },
  {
    id: "c1",
    title: "Антимонопольный иск против Apple и Google в Австралии - решение суда",
    summary: "Федеральный суд Австралии признал злоупотребление рыночной властью в операциях с магазинами приложений. Открывается путь к коллективным искам.",
    industry: "Tech Policy",
    language: "Russian",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    significance: 6.0,
    relevance: 6.5,
    clusterSize: 12,
    sources: [
      { name: "ABC Australia", url: "https://www.abc.net.au/news/" }
    ],
    tags: ["Australia", "antitrust", "Apple", "Google"]
  },
  {
    id: "d1",
    title: "KRAS off-the-shelf vaccine shows promise in reducing relapse",
    summary: "Early results suggest patients with strong immune response had lower risk of relapse in pancreatic and colorectal cancers. Larger trials needed.",
    industry: "Life Sciences",
    language: "English",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    significance: 6.3,
    relevance: 3.2,
    clusterSize: 10,
    sources: [
      { name: "The Guardian", url: "https://www.theguardian.com/" }
    ],
    tags: ["oncology", "vaccine", "KRAS"]
  },
  {
    id: "e1",
    title: "Tesla announces new Full Self-Driving V12 software update",
    summary: "Latest FSD update introduces significant improvements in pedestrian detection and urban driving scenarios, reducing interventions by 30%.",
    industry: "Fintech",
    language: "English",
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    significance: 7.2,
    relevance: 8.8,
    clusterSize: 45,
    sources: [
      { name: "Tesla", url: "https://www.tesla.com/" }
    ],
    tags: ["Tesla", "autonomous", "FSD", "AI"]
  },
  {
    id: "f1",
    title: "OpenAI launches GPT-4.5 with enhanced reasoning capabilities",
    summary: "New model shows significant improvements in mathematical reasoning and code generation, while maintaining safety alignment.",
    industry: "Tech Policy",
    language: "English",
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    significance: 8.1,
    relevance: 9.2,
    clusterSize: 78,
    sources: [
      { name: "OpenAI", url: "https://openai.com/" }
    ],
    tags: ["OpenAI", "GPT-4.5", "AI", "reasoning"]
  },
  {
    id: "g1",
    title: "Google announces major investment in quantum computing infrastructure",
    summary: "Multi-billion dollar commitment to build quantum data centers and develop error-corrected quantum processors for commercial applications.",
    industry: "Tech Policy",
    language: "English",
    date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    significance: 7.8,
    relevance: 8.5,
    clusterSize: 32,
    sources: [
      { name: "Google Quantum AI", url: "https://quantumai.google/" }
    ],
    tags: ["Google", "quantum", "computing", "infrastructure"]
  },
  {
    id: "h1",
    title: "Meta introduces new privacy-focused advertising tools",
    summary: "Enhanced privacy controls and new attribution methods that maintain advertising effectiveness while respecting user data rights.",
    industry: "Tech Policy",
    language: "English",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    significance: 6.5,
    relevance: 7.1,
    clusterSize: 28,
    sources: [
      { name: "Meta", url: "https://about.meta.com/" }
    ],
    tags: ["Meta", "privacy", "advertising", "data"]
  },
  {
    id: "i1",
    title: "Amazon expands drone delivery to major US cities",
    summary: "Prime Air service now available in 10 additional metropolitan areas, with plans for nationwide expansion by 2026.",
    industry: "Logistics",
    language: "English",
    date: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 30 hours ago
    significance: 7.0,
    relevance: 8.2,
    clusterSize: 41,
    sources: [
      { name: "Amazon", url: "https://www.amazon.com/" }
    ],
    tags: ["Amazon", "drones", "delivery", "logistics"]
  },
  {
    id: "j1",
    title: "SpaceX achieves reusable rocket milestone",
    summary: "Starship completes 50th successful landing and relaunch cycle, marking major breakthrough in commercial space transportation.",
    industry: "Tech Policy",
    language: "English",
    date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
    significance: 8.5,
    relevance: 9.0,
    clusterSize: 67,
    sources: [
      { name: "SpaceX", url: "https://www.spacex.com/" }
    ],
    tags: ["SpaceX", "rockets", "reusable", "space"]
  },
  {
    id: "k1",
    title: "Microsoft announces breakthrough in AI chip technology",
    summary: "New photonic computing chips achieve 100x improvement in energy efficiency for AI workloads, revolutionizing data center economics.",
    industry: "Tech Policy",
    language: "English",
    date: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString(), // 42 hours ago
    significance: 8.3,
    relevance: 8.9,
    clusterSize: 53,
    sources: [
      { name: "Microsoft Research", url: "https://www.microsoft.com/en-us/research/" }
    ],
    tags: ["Microsoft", "AI", "chips", "photonic"]
  },
  {
    id: "l1",
    title: "Apple introduces new health monitoring features",
    summary: "iOS 18 brings advanced sleep tracking, mental health insights, and predictive health alerts powered by machine learning.",
    industry: "Tech Policy",
    language: "English",
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    significance: 7.5,
    relevance: 8.1,
    clusterSize: 39,
    sources: [
      { name: "Apple", url: "https://www.apple.com/" }
    ],
    tags: ["Apple", "health", "iOS", "monitoring"]
  },
  {
    id: "m1",
    title: "Stripe announces new cross-border payment features",
    summary: "Enhanced fraud detection and instant settlement capabilities for international transactions, reducing processing time by 80%.",
    industry: "Fintech",
    language: "English",
    date: new Date(Date.now() - 54 * 60 * 60 * 1000).toISOString(), // 54 hours ago
    significance: 6.8,
    relevance: 8.4,
    clusterSize: 25,
    sources: [
      { name: "Stripe", url: "https://stripe.com/" }
    ],
    tags: ["Stripe", "payments", "cross-border", "fraud"]
  },
  {
    id: "n1",
    title: "NVIDIA unveils next-generation GPU architecture",
    summary: "Ada Lovelace successor delivers 2x performance improvement with advanced ray tracing and AI acceleration capabilities.",
    industry: "Tech Policy",
    language: "English",
    date: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(), // 60 hours ago
    significance: 8.0,
    relevance: 9.1,
    clusterSize: 71,
    sources: [
      { name: "NVIDIA", url: "https://www.nvidia.com/" }
    ],
    tags: ["NVIDIA", "GPU", "architecture", "AI"]
  },
  {
    id: "o1",
    title: "Netflix introduces AI-powered content recommendations",
    summary: "New algorithm provides 40% more accurate predictions and discovers niche content that users wouldn't find otherwise.",
    industry: "Tech Policy",
    language: "English",
    date: new Date(Date.now() - 66 * 60 * 60 * 1000).toISOString(), // 66 hours ago
    significance: 6.2,
    relevance: 7.5,
    clusterSize: 33,
    sources: [
      { name: "Netflix", url: "https://www.netflix.com/" }
    ],
    tags: ["Netflix", "AI", "recommendations", "content"]
  },
  {
    id: "p1",
    title: "PayPal launches enhanced security features",
    summary: "Biometric authentication and behavioral analysis reduce fraud by 60% while improving user experience.",
    industry: "Fintech",
    language: "English",
    date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
    significance: 6.7,
    relevance: 8.0,
    clusterSize: 29,
    sources: [
      { name: "PayPal", url: "https://www.paypal.com/" }
    ],
    tags: ["PayPal", "security", "biometric", "fraud"]
  },
  {
    id: "q1",
    title: "Small fintech startup raises $5M seed funding",
    summary: "New payment processing company secures funding to expand operations in Southeast Asia markets.",
    industry: "Fintech",
    language: "English",
    date: new Date(Date.now() - 80 * 60 * 60 * 1000).toISOString(), // 80 hours ago
    significance: 3.2,
    relevance: 4.5,
    clusterSize: 8,
    sources: [
      { name: "TechCrunch", url: "https://techcrunch.com/" }
    ],
    tags: ["fintech", "funding", "startup", "payments"]
  },
  {
    id: "r1",
    title: "Blockchain conference announces speakers",
    summary: "Annual blockchain summit reveals keynote speakers and panel discussions on DeFi and Web3 technologies.",
    industry: "Fintech",
    language: "English",
    date: new Date(Date.now() - 85 * 60 * 60 * 1000).toISOString(), // 85 hours ago
    significance: 2.8,
    relevance: 3.9,
    clusterSize: 12,
    sources: [
      { name: "CoinDesk", url: "https://www.coindesk.com/" }
    ],
    tags: ["blockchain", "conference", "DeFi", "Web3"]
  },
  {
    id: "s1",
    title: "Local bank launches mobile app update",
    summary: "Regional bank improves user interface and adds new features to its mobile banking application.",
    industry: "Fintech",
    language: "English",
    date: new Date(Date.now() - 90 * 60 * 60 * 1000).toISOString(), // 90 hours ago
    significance: 2.1,
    relevance: 2.8,
    clusterSize: 3,
    sources: [
      { name: "Local Bank News", url: "https://example.com/" }
    ],
    tags: ["banking", "mobile", "app", "update"]
  },
  {
    id: "t1",
    title: "Tech company announces office expansion",
    summary: "Growing software firm plans to open new office location to accommodate expanding workforce.",
    industry: "Tech Policy",
    language: "English",
    date: new Date(Date.now() - 95 * 60 * 60 * 1000).toISOString(), // 95 hours ago
    significance: 1.8,
    relevance: 2.2,
    clusterSize: 4,
    sources: [
      { name: "Business Wire", url: "https://www.businesswire.com/" }
    ],
    tags: ["expansion", "office", "workforce", "growth"]
  },
  {
    id: "u1",
    title: "Startup launches beta testing program",
    summary: "Early-stage company opens beta access to select users for feedback on new product features.",
    industry: "Tech Policy",
    language: "English",
    date: new Date(Date.now() - 100 * 60 * 60 * 1000).toISOString(), // 100 hours ago
    significance: 1.5,
    relevance: 1.9,
    clusterSize: 6,
    sources: [
      { name: "Product Hunt", url: "https://www.producthunt.com/" }
    ],
    tags: ["startup", "beta", "testing", "feedback"]
  },
  {
    id: "v1",
    title: "Industry report shows market trends",
    summary: "Quarterly analysis reveals shifting patterns in consumer behavior and technology adoption.",
    industry: "Tech Policy",
    language: "English",
    date: new Date(Date.now() - 110 * 60 * 60 * 1000).toISOString(), // 110 hours ago
    significance: 3.5,
    relevance: 4.2,
    clusterSize: 15,
    sources: [
      { name: "Industry Report", url: "https://example.com/" }
    ],
    tags: ["market", "trends", "analysis", "consumer"]
  },
  {
    id: "w1",
    title: "New regulatory guidelines proposed",
    summary: "Government agency suggests updates to existing regulations affecting digital services providers.",
    industry: "Tech Policy",
    language: "English",
    date: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(), // 120 hours ago
    significance: 4.2,
    relevance: 5.1,
    clusterSize: 18,
    sources: [
      { name: "Regulatory News", url: "https://example.com/" }
    ],
    tags: ["regulation", "guidelines", "digital", "services"]
  }
];

export default function GetniusRedesign() {
  const [activeTab, setActiveTab] = useState('companies');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [showNewsInfo, setShowNewsInfo] = useState(false);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [selectedCompanyForPeople, setSelectedCompanyForPeople] = useState<any>(null);
  const [selectedCompanyForNews, setSelectedCompanyForNews] = useState<any>(null);
  const [showPeopleFilter, setShowPeopleFilter] = useState(false);
  const [showPeopleHelp, setShowPeopleHelp] = useState(false);
  const [showNewsHelp, setShowNewsHelp] = useState(false);
  const [peopleSearchTerm, setPeopleSearchTerm] = useState('');
  const [peopleCompanyFilter, setPeopleCompanyFilter] = useState('All Companies');
  const [selectedPersonForIntents, setSelectedPersonForIntents] = useState<any>(null);

  // Match/Not Match state for companies
  const [matchedCompanies, setMatchedCompanies] = useState<Set<string>>(new Set());
  const [notMatchedCompanies, setNotMatchedCompanies] = useState<Set<string>>(new Set());
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());

  // News sorting state
  const [newsSortBy, setNewsSortBy] = useState('Relevance');

  // Sort options
  const sortOptions = ['Relevance', 'Freshness', 'Significance'];

  // News filtering state
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [minSignificance, setMinSignificance] = useState(1.0);
  const [minRelevance, setMinRelevance] = useState(1.0);
  const [maxAgeHours, setMaxAgeHours] = useState(168); // 7 days in hours

  // Available languages
  const languages = ['All Languages', 'English', 'Arabic', 'Chinese', 'French', 'German', 'Greek', 'Hindi', 'Italian', 'Russian', 'Spanish', 'Swedish', 'Ukrainian'];

  // Watchlist state
  const [watchlist, setWatchlist] = useState<any[]>([]);

  // Watchlist functions
  const addToWatchlist = (item: any, type: string) => {
    const watchlistItem = {
      id: `${type}-${item.id || Date.now()}`,
      type,
      data: item,
      savedAt: new Date().toISOString()
    };

    // Check if item already exists
    const exists = watchlist.some(existing => existing.id === watchlistItem.id);
    if (!exists) {
      setWatchlist(prev => [...prev, watchlistItem]);
    }
  };

  const removeFromWatchlist = (itemId: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== itemId));
  };

  const setShowCompanyPeople = (company: any) => {
    // Close other sidebars when opening company people sidebar
    setSelectedPersonForIntents(null);
    setSelectedCompanyForNews(null);
    setSelectedCompanyForPeople(company);
  };

  const setShowCompanyNews = (company: any) => {
    // Close other sidebars when opening company news sidebar
    setSelectedPersonForIntents(null);
    setSelectedCompanyForPeople(null);
    setSelectedCompanyForNews(company);
  };

  // Company matching functions
  const handleMatchCompanies = () => {
    setMatchedCompanies(prev => new Set([...prev, ...selectedCompanies]));
    setNotMatchedCompanies(prev => {
      const newSet = new Set(prev);
      selectedCompanies.forEach(company => newSet.delete(company));
      return newSet;
    });
    setSelectedCompanies(new Set()); // Clear selection after matching
  };

  const handleNotMatchCompanies = () => {
    setNotMatchedCompanies(prev => new Set([...prev, ...selectedCompanies]));
    setMatchedCompanies(prev => {
      const newSet = new Set(prev);
      selectedCompanies.forEach(company => newSet.delete(company));
      return newSet;
    });
    setSelectedCompanies(new Set()); // Clear selection after not matching
  };

  // Checkbox handlers for company selection
  const handleCompanyCheckboxChange = (companyName: string, checked: boolean) => {
    setSelectedCompanies(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(companyName);
      } else {
        newSet.delete(companyName);
      }
      return newSet;
    });
  };

  const handleSelectAllCompanies = (checked: boolean) => {
    if (checked) {
      setSelectedCompanies(new Set(companiesData.map(company => company.name)));
    } else {
      setSelectedCompanies(new Set());
    }
  };

  const setShowPeopleIntents = (person: any) => {
    console.log('=== setShowPeopleIntents called ===');
    console.log('Received person:', person);
    console.log('Person type:', typeof person);
    console.log('Person keys:', person ? Object.keys(person) : 'null/undefined');

    // Close other sidebars when opening intents sidebar
    setSelectedCompanyForPeople(null);
    setSelectedCompanyForNews(null);
    setSelectedPersonForIntents(person);

    console.log('=== setShowPeopleIntents done ===');
  };

  // Filter news
  const filteredNews = useMemo(() => {
    const now = Date.now();
    return newsData.filter(news => {
      // Language filter
      if (selectedLanguage !== 'All Languages' && news.language !== selectedLanguage) return false;

      // Freshness filter (age in hours)
      const ageHours = (now - new Date(news.date).getTime()) / (1000 * 60 * 60);
      if (ageHours > maxAgeHours) return false;

      // Significance and relevance filters
      return news.significance >= minSignificance && news.relevance >= minRelevance;
    });
  }, [selectedLanguage, minSignificance, minRelevance, maxAgeHours]);

  // Filter people
  const filteredPeople = useMemo(() => {
    return peopleData.filter(person => {
      // Search filter (name, role, company, location, email)
      const searchLower = peopleSearchTerm.toLowerCase();
      const matchesSearch = !peopleSearchTerm ||
        person.name.toLowerCase().includes(searchLower) ||
        person.role.toLowerCase().includes(searchLower) ||
        person.company.toLowerCase().includes(searchLower) ||
        person.location.toLowerCase().includes(searchLower) ||
        person.email.toLowerCase().includes(searchLower);

      // Company filter
      const matchesCompany = peopleCompanyFilter === 'All Companies' ||
        person.company === peopleCompanyFilter;

      return matchesSearch && matchesCompany;
    });
  }, [peopleSearchTerm, peopleCompanyFilter]);

  // Get unique companies for filter dropdown
  const uniqueCompanies = useMemo(() => {
    const companies = [...new Set(peopleData.map(person => person.company))].sort();
    return ['All Companies', ...companies];
  }, []);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('getnius-watchlist');
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
    } catch (error) {
        console.error('Error loading watchlist from localStorage:', error);
      }
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('getnius-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Monitor selectedPersonForIntents state changes
  useEffect(() => {
    console.log('=== useEffect: selectedPersonForIntents changed ===');
    console.log('New value:', selectedPersonForIntents);
    console.log('Has name property:', selectedPersonForIntents?.name);
    console.log('Will sidebar render?', !!selectedPersonForIntents);
  }, [selectedPersonForIntents]);

  // Close help tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showPeopleHelp && !target.closest('.help-tooltip-container')) {
        setShowPeopleHelp(false);
      }
      if (showNewsHelp && !target.closest('.news-help-tooltip-container')) {
        setShowNewsHelp(false);
      }
    };

    if (showPeopleHelp || showNewsHelp) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showPeopleHelp, showNewsHelp]);

  const tabs = [
    { id: 'companies', label: 'COMPANIES / PRODUCTS' },
    { id: 'people', label: 'PEOPLE / CONTACTS' },
    { id: 'news', label: 'NEWS / DIGESTS' },
    { id: 'signals', label: 'SIGNALS / INTENTS / CHANGES' },
    { id: 'market', label: 'MARKET REPORTS' },
    { id: 'patents', label: 'PATENTS / RESEARCH PAPERS' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
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
              <button
                onClick={() => setShowWatchlistModal(true)}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Navigation Bar */}
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

        {/* Search Bar */}
        <div className="mb-8">
          <div className="bg-white shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 p-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="e.g. SaaS startups in San Francisco with ~50 employees"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-700 placeholder-slate-400"
                />
          </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-500 text-white hover:bg-slate-600 transition-colors font-medium">
                <Search className="w-4 h-4" />
                Search...
              </button>
              <div className="flex flex-col items-center">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  UPLOADS DOCS
        </div>
                <div className="text-xs text-slate-500 mb-2">(CSVs images etc)</div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium">
                  <Upload className="w-3 h-3" />
                  Import CSV
                </button>
              </div>
              </div>
            </div>
          </div>

        {/* Horizontal Tab Navigation */}
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

        {/* Content Area */}
        <div className="w-full">
          <DataGridLayout activeTab={activeTab} />
        </div>

      </main>

      {/* Old sidebar content removed - now handled by DataGridLayout */}
                      <div className="flex gap-2">
                        <div className="relative group">
                          <button
                            disabled={selectedCompanies.size === 0}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              selectedCompanies.size === 0
                                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                            }`}
                          >
                            ✓ Match
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Select the most interesting to search lookalikes
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                      <div className="relative group">
                          <button
                            disabled={selectedCompanies.size === 0}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              selectedCompanies.size === 0
                                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            }`}
                          >
                            × Not Match
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Mark as not relevant to improve future results
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                    </div>
                    <div className="relative group">
                        <button
                          onClick={() => {
                            if (matchedCompanies.size === 0) {
                              alert('Please select and match some companies first by using the ✓ Match button.');
                            } else {
                              alert(`Finding lookalikes for ${matchedCompanies.size} matched companies...`);
                            }
                          }}
                          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-slate-200 text-slate-700 hover:bg-slate-300 hover:shadow-sm"
                        >
                          <Search className="w-4 h-4" />
                          Find Lookalikes
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          Find similar companies/people based on your matches
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                      <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                        Enrich
                      </button>
                      <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                        Delete rows
                      </button>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setActiveTab('intents')}
                          className="px-4 py-2 text-sm font-medium whitespace-nowrap transition-all rounded-full bg-white text-slate-900 shadow-sm border border-slate-200 hover:bg-slate-50"
                        >
                          JOB CHANGES
                        </button>
                        <button
                          onClick={() => {
                            console.log('Global intents button clicked');
                            setShowPeopleIntents({} as any);
                          }}
                          className="px-3 py-2 text-xs bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                        >
                          {intentsData.length} Intents
                        </button>
                        <div className="relative help-tooltip-container">
                      <button
                            onClick={() => setShowPeopleHelp(!showPeopleHelp)}
                            className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-full flex items-center justify-center text-sm font-medium transition-colors border border-blue-200"
                      >
                            ?
                      </button>
                          {showPeopleHelp && (
                            <div className="absolute top-full right-0 mt-2 px-4 py-3 bg-slate-900 text-white text-sm rounded-lg shadow-lg z-20 w-80">
                              <h4 className="font-semibold text-blue-300 mb-2">How to Use</h4>
                              <div className="space-y-1 text-xs">
                                <p>1. Select companies using checkboxes</p>
                                <p>2. Click ✓ Match for interesting companies</p>
                                <p>3. Click × Not Match for irrelevant companies</p>
                                <p>4. Use "Find Lookalikes" to discover similar companies</p>
                    </div>
                              <div className="absolute top-0 right-4 transform -translate-y-1/2 -mt-1 border-4 border-transparent border-b-slate-900"></div>
                  </div>
                          )}
                        </div>
                      </div>
                    </div>
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <Filter className="w-5 h-5" />
                  </button>
          </div>
                  {/* People Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left p-3 w-10">
                          <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Company</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Role</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Location</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-32">Profile URL</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Intents</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {filteredPeople.map((person, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-semibold">
                                {person.name.charAt(0)}
                              </div>
                              <span className="font-semibold text-slate-800 text-sm">{person.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-600 text-sm">{person.company}</td>
                          <td className="p-3 text-slate-600 text-sm">{person.role}</td>
                          <td className="p-3 text-slate-600 text-sm">{person.location}</td>
                          <td className="p-3 text-indigo-600 text-sm">{person.email}</td>
                          <td className="p-3 text-slate-600 text-sm">{person.profile}</td>
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                alert('Button clicked for: ' + person.name);
                                console.log('=== INDIVIDUAL BUTTON CLICK ===');
                                console.log('Person:', person);
                                console.log('Person.name:', person.name);
                                
                                // Directly set state instead of going through function
                                console.log('Directly setting selectedPersonForIntents');
                                setSelectedCompanyForPeople(null);
                                setSelectedCompanyForNews(null);
                                setSelectedPersonForIntents(person);
                                
                                console.log('State set, checking in 100ms...');
                                setTimeout(() => {
                                  console.log('selectedPersonForIntents after timeout:', selectedPersonForIntents);
                                }, 100);
                              }}
                              className="px-2 py-1 text-xs bg-purple-600 text-white border border-purple-700 rounded hover:bg-purple-700 transition-colors cursor-pointer min-w-[60px] text-center font-semibold"
                              style={{ pointerEvents: 'auto', zIndex: 10 }}
                            >
                              {intentsData.filter(intent => intent.person === person.name).length} intents
                            </button>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => addToWatchlist(person, 'people')}
                              className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors"
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </div>
              ) : activeTab === 'intents' ? (
                /* Job Changes Table */
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left p-3 w-10">
                          <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">New Role at New Company</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Previous Role at Previous Company</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Change Date</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Confidence</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {intentsData.filter(intent => intent.type === 'job_change').map((intent) => (
                        <tr key={intent.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setShowPeopleIntents(intent)}>
                          <td className="p-3">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                          </td>
                          <td className="p-3">
                  <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-semibold">
                                {intent.person.charAt(0)}
                    </div>
                              <span className="font-semibold text-slate-800 text-sm">{intent.person}</span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-600 text-sm">
                            <span className="font-medium">{intent.newRole}</span> at <span className="font-medium text-indigo-600">{intent.company}</span>
                          </td>
                          <td className="p-3 text-slate-600 text-sm">
                            <span className="font-medium">{intent.previousRole}</span> at <span className="font-medium text-slate-500">{intent.previousCompany}</span>
                          </td>
                          <td className="p-3 text-slate-600 text-sm">{intent.changeDate}</td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              intent.confidence === 'Confirmed' ? 'bg-green-100 text-green-700' :
                              intent.confidence === 'Likely' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {intent.confidence}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                            <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToWatchlist(intent, 'intents');
                                }}
                              className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors"
                            >
                              Save
                            </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const existingPerson = peopleData.find(p => p.name === intent.person && p.company === intent.company);
                                  if (!existingPerson) {
                                    alert(`${intent.person} added to People tab!`);
                                  } else {
                                    alert(`${intent.person} is already in the People tab.`);
                                  }
                                }}
                                className="px-2 py-1 text-xs bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 transition-colors"
                              >
                                Add to People
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : activeTab === 'market' ? (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm" style={{ width: '1142.25px' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <div className="relative group">
                          <button
                            disabled={selectedCompanies.size === 0}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              selectedCompanies.size === 0
                                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                            }`}
                          >
                            ✓ Match
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Select the most interesting to search lookalikes
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                        <div className="relative group">
                          <button
                            disabled={selectedCompanies.size === 0}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              selectedCompanies.size === 0
                                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            }`}
                          >
                            × Not Match
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Mark as not relevant to improve future results
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                      </div>
                      <div className="relative group">
                        <button
                          onClick={() => {
                            if (matchedCompanies.size === 0) {
                              alert('Please select and match some companies first by using the ✓ Match button.');
                            } else {
                              alert(`Finding lookalikes for ${matchedCompanies.size} matched companies...`);
                            }
                          }}
                          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-slate-200 text-slate-700 hover:bg-slate-300 hover:shadow-sm"
                        >
                          <Search className="w-4 h-4" />
                          Find Lookalikes
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          Find similar companies/people based on your matches
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                        Enrich
                      </button>
                      <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                        Delete rows
                      </button>
                    </div>
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Market Reports/All Docs Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left p-3 w-10">
                          <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Report Name</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Type</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Company/Topic</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-32">Date</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-24">Size</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-32">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {marketReportsData.map((report, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span className="font-semibold text-slate-800 text-sm">{report.name}</span>
                        </div>
                          </td>
                          <td className="p-3">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                              {report.type}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 text-sm">{report.topic}</td>
                          <td className="p-3 text-slate-600 text-sm">{report.date}</td>
                          <td className="p-3 text-slate-500 text-sm">{report.size}</td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button className="px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded text-xs font-medium transition-colors">
                                View
                              </button>
                              <button className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded text-xs font-medium transition-colors">
                                Download
                              </button>
                              <button
                                onClick={() => addToWatchlist(report, 'market-reports')}
                                className="px-3 py-1 text-green-600 hover:bg-green-50 rounded text-xs font-medium transition-colors"
                              >
                                Save
                              </button>
                  </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </div>
              ) : activeTab === 'patents' ? (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm" style={{ width: '1142.25px' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <div className="relative group">
                          <button
                            disabled={selectedCompanies.size === 0}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              selectedCompanies.size === 0
                                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                            }`}
                          >
                            ✓ Match
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Select the most interesting to search lookalikes
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                        <div className="relative group">
                          <button
                            disabled={selectedCompanies.size === 0}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              selectedCompanies.size === 0
                                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            }`}
                          >
                            × Not Match
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Mark as not relevant to improve future results
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                      </div>
                      <div className="relative group">
                        <button
                          onClick={() => {
                            if (matchedCompanies.size === 0) {
                              alert('Please select and match some companies first by using the ✓ Match button.');
                            } else {
                              alert(`Finding lookalikes for ${matchedCompanies.size} matched companies...`);
                            }
                          }}
                          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-slate-200 text-slate-700 hover:bg-slate-300 hover:shadow-sm"
                        >
                          <Search className="w-4 h-4" />
                          Find Lookalikes
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          Find similar companies/people based on your matches
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                        Enrich
                      </button>
                      <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                        Delete rows
                      </button>
                    </div>
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Patents/Research Papers Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left p-3 w-10">
                          <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Title</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Type</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Inventor/Author</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Company/Institution</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-32">Date Filed/Published</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-32">Patent/ID Number</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-24">Status</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {patentsData.map((patent, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-800 text-sm">{patent.title}</span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${
                              patent.type === 'Patent'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-teal-100 text-teal-700'
                            }`}>
                              {patent.type}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 text-sm">{patent.inventor}</td>
                          <td className="p-3 text-slate-600 text-sm">{patent.company}</td>
                          <td className="p-3 text-slate-600 text-sm">{patent.date}</td>
                          <td className="p-3 text-slate-600 text-sm font-mono text-xs">{patent.number}</td>
                          <td className="p-3">
                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${
                              patent.status === 'Granted'
                                ? 'bg-green-100 text-green-700'
                                : patent.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {patent.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => addToWatchlist(patent, 'patents')}
                              className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors"
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                        </div>
                        </div>
              ) : activeTab === 'news' ? (
                /* News Digest */
                <div className="space-y-6">
                  {/* Filters */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="grid grid-cols-3 gap-4 flex-1">
                      <div>
                        <div className="text-sm font-semibold mb-2">Significance min {minSignificance.toFixed(1)}</div>
                        <input
                          type="range"
                          min={0}
                          max={10}
                          step={0.1}
                          value={minSignificance}
                          onChange={(e) => setMinSignificance(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold mb-2">Relevance min {minRelevance.toFixed(1)}</div>
                        <input
                          type="range"
                          min={0}
                          max={10}
                          step={0.1}
                          value={minRelevance}
                          onChange={(e) => setMinRelevance(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold mb-2">Freshness max {maxAgeHours}h</div>
                        <input
                          type="range"
                          min={1}
                          max={168}
                          step={12}
                          value={maxAgeHours}
                          onChange={(e) => setMaxAgeHours(parseFloat(e.target.value))}
                          className="w-full"
                  />
                        </div>
                      </div>
                      <div className="relative ml-4 news-help-tooltip-container">
                        <button
                          onClick={() => setShowNewsHelp(!showNewsHelp)}
                          className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-full flex items-center justify-center text-sm font-medium transition-colors border border-blue-200"
                        >
                          ?
                        </button>
                        {showNewsHelp && (
                          <div className="absolute top-full right-0 mt-2 px-4 py-3 bg-slate-900 text-white text-sm rounded-lg shadow-lg z-20 w-80">
                            <h4 className="font-semibold text-blue-300 mb-2">How to Use</h4>
                            <div className="space-y-1 text-xs">
                              <p>1. Select companies using checkboxes</p>
                              <p>2. Click ✓ Match for interesting companies</p>
                              <p>3. Click × Not Match for irrelevant companies</p>
                              <p>4. Use "Find Lookalikes" to discover similar companies</p>
                            </div>
                            <div className="absolute top-0 right-4 transform -translate-y-1/2 -mt-1 border-4 border-transparent border-b-slate-900"></div>
                          </div>
                        )}
                </div>
              </div>

                    <div className="text-xs text-slate-500 text-center mt-4">
                      Showing {filteredNews.length} of {newsData.length} articles
                    </div>
                  </div>

                  {/* News Relevance */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-4">News Relevance</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">Relevance</span>
                          <span className="text-slate-800 font-medium">High</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-4/5"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">Significance</span>
                          <span className="text-slate-800 font-medium">Medium</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-3/5"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">Trust Score</span>
                          <span className="text-slate-800 font-medium">High</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* News Feed */}
                  {filteredNews.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-slate-500">No news items match the current filters.</div>
                      <div className="text-sm text-slate-400 mt-2">Try adjusting the significance, relevance, or language filters.</div>
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-200 border-t border-b border-slate-200 bg-white rounded-xl">
                      {filteredNews.map((item) => (
                        <li key={item.id} className="py-4 px-4">
                          <article>
                            <div className="flex items-start gap-3">
                              <div className="min-w-[56px] text-right">
                                <div className="font-mono text-slate-800">[{item.significance.toFixed(1)}]</div>
                                <div className="text-[11px] font-mono text-slate-500">rel {item.relevance.toFixed(1)}</div>
                              </div>
                              <div className="flex-1">
                                <h3 className="leading-snug">
                                  <a
                                    href={item.sources[0]?.url || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline"
                                  >
                                    {item.title}
                                  </a>
                                </h3>
                                <div className="mt-1 text-sm text-slate-600">
                                  <span className="mr-2">{new Date(item.date).toLocaleString()}</span>
                                  <span className="mr-2">•</span>
                                  <span className="mr-2">{item.language}</span>
                                  <span className="mr-2">•</span>
                                  <span className="mr-2">{item.clusterSize} sources</span>
                                  <span className="mr-2">•</span>
                                  <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">{item.industry}</span>
                                </div>
                                <p className="mt-2 text-sm text-slate-700">{item.summary}</p>
                                <div className="mt-3 flex items-center gap-3">
                                  <button
                                    onClick={() => addToWatchlist(item, 'news')}
                                    className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-100 transition-colors"
                                  >
                                    Save
                                  </button>
                                  <a
                                    href={item.sources[0]?.url || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-100 transition-colors"
                                  >
                                    Open primary source
                                  </a>
                                </div>
                              </div>
                            </div>
                          </article>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : activeTab === 'signals' ? (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm" style={{ width: '1142.25px' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <div className="relative group">
                          <button
                            disabled={selectedCompanies.size === 0}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              selectedCompanies.size === 0
                                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                            }`}
                          >
                            ✓ Match
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Select the most interesting to search lookalikes
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                        <div className="relative group">
                          <button
                            disabled={selectedCompanies.size === 0}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              selectedCompanies.size === 0
                                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            }`}
                          >
                            × Not Match
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Mark as not relevant to improve future results
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                      </div>
                      <div className="relative group">
                        <button
                          onClick={() => {
                            if (matchedCompanies.size === 0) {
                              alert('Please select and match some companies first by using the ✓ Match button.');
                            } else {
                              alert(`Finding lookalikes for ${matchedCompanies.size} matched companies...`);
                            }
                          }}
                          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-slate-200 text-slate-700 hover:bg-slate-300 hover:shadow-sm"
                        >
                          <Search className="w-4 h-4" />
                          Find Lookalikes
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          Find similar companies/people based on your matches
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                        Enrich
                      </button>
                      <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                        Delete rows
                      </button>
                    </div>
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Signals Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left p-3 w-10">
                          <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Signal</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Person</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Company</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-24">Date</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Details</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {signalsData.map((signal, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                          </td>
                          <td className="p-3">
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                              {signal.signal}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 text-sm">{signal.person}</td>
                          <td className="p-3 text-slate-600 text-sm">{signal.company}</td>
                          <td className="p-3 text-slate-600 text-sm">{signal.date}</td>
                          <td className="p-3 text-slate-600 text-sm">{signal.details}</td>
                          <td className="p-3">
                            <button
                              onClick={() => addToWatchlist(signal, 'signals')}
                              className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors"
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm" style={{ width: '1142.25px' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <div className="relative group">
                          <button
                            disabled={selectedCompanies.size === 0}
                            onClick={() => {
                              selectedCompanies.forEach(company => matchedCompanies.add(company));
                              setSelectedCompanies(new Set());
                              setNotMatchedCompanies(new Set());
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              selectedCompanies.size === 0
                                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                            }`}
                          >
                            ✓ Match
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Select the most interesting to search lookalikes
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                        <div className="relative group">
                          <button
                            disabled={selectedCompanies.size === 0}
                            onClick={() => {
                              selectedCompanies.forEach(company => notMatchedCompanies.add(company));
                              setSelectedCompanies(new Set());
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              selectedCompanies.size === 0
                                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            }`}
                          >
                            × Not Match
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Mark as not relevant to improve future results
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                      </div>
                      <div className="relative group">
                        <button
                          onClick={() => {
                            if (matchedCompanies.size === 0) {
                              alert('Please select and match some companies first by using the ✓ Match button.');
                            } else {
                              alert(`Finding lookalikes for ${matchedCompanies.size} matched companies...`);
                            }
                          }}
                          disabled={matchedCompanies.size === 0}
                          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            matchedCompanies.size === 0
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300 hover:shadow-sm'
                          }`}
                        >
                          <Search className="w-4 h-4" />
                          Find Lookalikes
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          Find similar companies/people based on your matches
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                        Enrich
                      </button>
                      <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                        Delete rows
                      </button>
                    </div>
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Companies Table */}
                  <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left p-3 w-10">
                          <input
                            type="checkbox"
                            checked={selectedCompanies.size === companiesData.length && companiesData.length > 0}
                            onChange={(e) => handleSelectAllCompanies(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-32">Company</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-64">Description</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-32">Location</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-24">Founded</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-16">Year</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">Status</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-24">Revenue</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">People</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">News</th>
                        <th className="text-left p-3 text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {companiesData.map((company, i) => {
                        const isMatched = matchedCompanies.has(company.name);
                        const isNotMatched = notMatchedCompanies.has(company.name);
                        const isSelected = selectedCompanies.has(company.name);

                        return (
                        <tr
                          key={i}
                          className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                            isMatched ? 'bg-green-50 border-green-200' :
                            isNotMatched ? 'bg-red-50 border-red-200' :
                            isSelected ? 'bg-blue-50' : ''
                          }`}
                        >
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedCompanies.has(company.name)}
                              onChange={(e) => handleCompanyCheckboxChange(company.name, e.target.checked)}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-800 text-sm">{company.name}</span>
                          </td>
                          <td className="p-3 text-slate-600 text-sm">{company.desc}</td>
                          <td className="p-3 text-slate-600 text-sm">{company.location}</td>
                          <td className="p-3 text-slate-600 text-sm">{company.founded}</td>
                          <td className="p-3 text-slate-600 text-sm">{company.year}</td>
                          <td className="p-3 text-indigo-600 text-sm">{company.status}</td>
                          <td className="p-3 text-slate-600 text-sm">{company.revenue}</td>
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('People button clicked for:', company.name);
                                setShowCompanyPeople(company);
                              }}
                              className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 active:bg-blue-200 transition-colors cursor-pointer relative z-10 whitespace-nowrap"
                              style={{ pointerEvents: 'auto' }}
                            >
                              {peopleData.filter(person => person.company === company.name).length} people
                            </button>
                          </td>
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('News button clicked for:', company.name);
                                setShowCompanyNews(company);
                              }}
                              className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 active:bg-green-200 transition-colors cursor-pointer relative z-10 whitespace-nowrap"
                              style={{ pointerEvents: 'auto' }}
                            >
                              {Math.floor(Math.random() * 5) + 1} news
                            </button>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => addToWatchlist(company, 'companies')}
                              className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors"
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                </div>
              )}
                    </div>

          {/* Sidebar */}
          {activeTab === 'companies' || activeTab === 'intents' || activeTab === 'people' ? (
            <div className="space-y-4">
              {/* Selection Status for Companies Tab */}
              {(matchedCompanies.size > 0 || notMatchedCompanies.size > 0) && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    Selection Status
                  </h3>
                  <div className="space-y-3">
                    {matchedCompanies.size > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-green-700">Matched for Lookalikes</span>
                        </div>
                        <span className="text-sm font-semibold text-green-700">{matchedCompanies.size}</span>
                      </div>
                    )}
                    {notMatchedCompanies.size > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium text-red-700">Not Relevant</span>
                        </div>
                        <span className="text-sm font-semibold text-red-700">{notMatchedCompanies.size}</span>
                      </div>
                    )}
                    {selectedCompanies.size > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-blue-700">Currently Selected</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-700">{selectedCompanies.size}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (activeTab !== 'companies' && activeTab !== 'people' && activeTab !== 'news' && activeTab !== 'market' && activeTab !== 'signals' && activeTab !== 'patents') && (
            <div className="space-y-4">
                /* Default Sidebar - Show for all tabs except companies */
                <>
                  {/* Monitor Card */}
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Bell className="w-5 h-5" />
                      <h3 className="font-semibold text-lg">Monitors</h3>
                      </div>
                    <p className="text-indigo-100 text-sm mb-4">
                      With Monitors, you can create alerts for news, social posts, hiring, job changes, or any custom event you want to treat as a signal. Websets will email you when it finds new events on your schedule.
                    </p>
                    <button className="w-full px-4 py-2 bg-white text-indigo-600 rounded-xl hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Create Monitor
                    </button>
            </div>

                  {/* Company News or Recent Updates */}
                  {selectedCompanyForNews ? (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-800">{selectedCompanyForNews.name} News</h3>
                        <button
                          onClick={() => setSelectedCompanyForNews(null)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div className="pb-3 border-b border-slate-100">
                          <p className="text-sm text-slate-600">News 1</p>
                          <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                        </div>
                        <div className="pb-3 border-b border-slate-100">
                          <p className="text-sm text-slate-600">News 2</p>
                          <p className="text-xs text-slate-400 mt-1">5 hours ago</p>
                        </div>
                      </div>
                      <button className="w-full mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                        View all updates →
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <h3 className="font-semibold text-slate-800 mb-4">Recent Updates</h3>
                      <div className="space-y-3">
                        <div className="pb-3 border-b border-slate-100">
                          <p className="text-sm text-slate-600">News 1</p>
                          <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                        </div>
                        <div className="pb-3 border-b border-slate-100">
                          <p className="text-sm text-slate-600">News 2</p>
                          <p className="text-xs text-slate-400 mt-1">5 hours ago</p>
                        </div>
                        <button className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2">
                          View all updates →
                        </button>
                      </div>
                    </div>
                  )}
                </>
          )
        </div>
      )}
        </div>
      </main>

      {/* News Aggregator Info Modal */}
      {showNewsInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">About News Aggregator</h2>
              <button
                onClick={() => setShowNewsInfo(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
        </div>

            <div className="p-6 space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">What is Significance?</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Significance is <strong>objective</strong> and measures how much an event affects humanity as a whole. This differs from importance or relevance, which are subjective. For example, news about the health of your family members is important to you, but not significant to the world.
                </p>
      </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">How is Significance Determined?</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Significance is calculated using a two-step process:
                </p>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5 mb-4">
                  <h4 className="font-semibold text-indigo-900 mb-3">Step 1: Analysis by Advanced Model</h4>
                  <p className="text-slate-700 mb-3">
                    A larger, smarter model analyzes thousands of historical news stories and estimates seven key factors:
                  </p>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start">
                      <span className="font-semibold text-indigo-700 mr-2">1. Scale:</span>
                      <span>How broadly the event affects humanity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-indigo-700 mr-2">2. Impact:</span>
                      <span>How strong the immediate effect is</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-indigo-700 mr-2">3. Novelty:</span>
                      <span>How unique and unexpected the event is</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-indigo-700 mr-2">4. Potential:</span>
                      <span>How likely it is to shape the future</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-indigo-700 mr-2">5. Legacy:</span>
                      <span>How likely it is to be considered a turning point in history or a major milestone</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-indigo-700 mr-2">6. Positivity:</span>
                      <span>How positive the event is</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-indigo-700 mr-2">7. Credibility:</span>
                      <span>How trustworthy and reliable the source is</span>
                    </li>
                  </ul>
                  <p className="text-slate-700 mt-3">
                    These factors are combined into a single significance score and normalized to a 0-10 scale.
          </p>
        </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                  <h4 className="font-semibold text-slate-900 mb-2">Step 2: Scaled Implementation</h4>
                  <p className="text-slate-700">
                    A smaller, more efficient model is trained to replicate the results of the advanced model, enabling significance scoring at scale across thousands of news articles.
                  </p>
        </div>
      </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Why Include Positivity?</h3>
                <p className="text-slate-700 leading-relaxed mb-3">
                  News sources have a <strong>negativity bias</strong>: they overreport negative news and underreport positive news.
                </p>
                <p className="text-slate-700 leading-relaxed mb-3">
                  The Positivity factor has a very low weight (1/20 of the total score) and is used to bring the negative/positive ratio back to 50:50. It doesn't change the overall distribution much, but makes a huge difference in the 5+ significance range.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Without it:</strong> The 5+ range mostly consists of news about wars and natural disasters.<br />
                  <strong>With it:</strong> The 5+ range includes more scientific discoveries and technological advancements.
                </p>
              </section>
            </div>
              </div>
              </div>
      )}

      {/* Watchlist Modal */}
      {showWatchlistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Bookmark className="w-6 h-6 text-indigo-600" />
                My Watchlist ({watchlist.length})
              </h2>
              <button
                onClick={() => setShowWatchlistModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              </div>

            <div className="p-6">
              {watchlist.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">Your watchlist is empty</h3>
                  <p className="text-slate-500 mb-6">Start saving interesting items from any tab to build your research collection.</p>
                  <button
                    onClick={() => setShowWatchlistModal(false)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Browse Content
                  </button>
            </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {/* Group items by type */}
                  {['news', 'companies', 'people', 'signals', 'market-reports', 'patents'].map(type => {
                    const typeItems = watchlist.filter(item => item.type === type);
                    if (typeItems.length === 0) return null;

                    return (
                      <div key={type} className="border border-slate-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-slate-800 mb-3 capitalize flex items-center gap-2">
                          {type === 'market-reports' ? 'Market Reports' : type}
                          <span className="text-sm font-normal text-slate-500">({typeItems.length})</span>
                        </h3>
                        <div className="space-y-3">
                          {typeItems.map((item) => (
                            <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                                    item.type === 'news' ? 'bg-blue-100 text-blue-700' :
                                    item.type === 'companies' ? 'bg-green-100 text-green-700' :
                                    item.type === 'people' ? 'bg-purple-100 text-purple-700' :
                                    item.type === 'signals' ? 'bg-orange-100 text-orange-700' :
                                    item.type === 'market-reports' ? 'bg-teal-100 text-teal-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {item.type === 'market-reports' ? 'Reports' : item.type}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    Saved {new Date(item.savedAt).toLocaleDateString()} at {new Date(item.savedAt).toLocaleTimeString()}
                                  </span>
              </div>
                                <h4 className="font-medium text-slate-800 mb-1">
                                  {item.type === 'news' ? item.data.title :
                                   item.type === 'companies' ? item.data.name :
                                   item.type === 'people' ? `${item.data.name} - ${item.data.role}` :
                                   item.type === 'signals' ? `${item.data.person} → ${item.data.company}` :
                                   item.type === 'market-reports' ? item.data.name :
                                   item.data.title || 'Item'}
                                </h4>
                                <p className="text-sm text-slate-600 line-clamp-2">
                                  {item.type === 'news' ? item.data.desc :
                                   item.type === 'companies' ? item.data.desc :
                                   item.type === 'people' ? `${item.data.company} • ${item.data.location}` :
                                   item.type === 'signals' ? item.data.details :
                                   item.type === 'market-reports' ? `${item.data.type} • ${item.data.topic}` :
                                   item.data.inventor ? `${item.data.inventor} • ${item.data.company}` :
                                   'No description available'}
              </p>
            </div>
                              <button
                                onClick={() => removeFromWatchlist(item.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
                                title="Remove from watchlist"
                              >
                                <X className="w-5 h-5" />
                              </button>
            </div>
                          ))}
            </div>
            </div>
                    );
                  })}
          </div>
              )}
          </div>
        </div>
        </div>
      )}

      {/* People Filter Modal */}
      {showPeopleFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                Filter People
              </h2>
              <button
                onClick={() => setShowPeopleFilter(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
    </div>

            <div className="p-6 space-y-4">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Search People
                </label>
                <input
                  type="text"
                  placeholder="Search by name, role, company, location, or email..."
                  value={peopleSearchTerm}
                  onChange={(e) => setPeopleSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm rounded-lg"
                />
              </div>

              {/* Company Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Filter by Company
                </label>
                <select
                  value={peopleCompanyFilter}
                  onChange={(e) => setPeopleCompanyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm rounded-lg"
                >
                  {uniqueCompanies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="pt-4 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  Showing {filteredPeople.length} of {peopleData.length} people
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setPeopleSearchTerm('');
                    setPeopleCompanyFilter('All Companies');
                  }}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowPeopleFilter(false)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* People Intents Hover/Sidebar */}
      {selectedPersonForIntents && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-30 z-[998]" onClick={() => setSelectedPersonForIntents(null)}></div>
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-96 bg-white border-l-4 border-purple-500 shadow-2xl z-[999] translate-x-0">
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs font-bold">I</span>
              </div>
              {selectedPersonForIntents?.name ? `${selectedPersonForIntents.name}'s Intents` : 'All Intents'}
            </h2>
            <button
              onClick={() => setSelectedPersonForIntents(null)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 bg-yellow-100 border-2 border-yellow-400 m-4 rounded-lg">
            <h3 className="text-lg font-bold text-yellow-800 mb-2">SIDEBAR IS WORKING!</h3>
            <p className="text-yellow-700">If you can see this yellow box, the sidebar opened successfully.</p>
            <p className="text-yellow-700 mt-2">Person: {selectedPersonForIntents?.name || 'All People'}</p>
          </div>

          <div className="p-6">
            {(() => {
              const personIntents = selectedPersonForIntents?.name
                ? intentsData.filter(intent => intent.person === selectedPersonForIntents.name)
                : intentsData; // Show all intents if no specific person
              const jobChanges = personIntents.filter(intent => intent.type === 'job_change');
              const otherIntents = personIntents.filter(intent => intent.type !== 'job_change');

              return (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-800 mb-2">Intent Summary</h3>
                    <p className="text-sm text-purple-700">
                      {personIntents.length} total signals across all categories
                    </p>
                  </div>

                  {/* 1) Job Changes (Changes) */}
                  {jobChanges.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        Job Changes
                        <span className="text-xs font-normal text-slate-500">({jobChanges.length})</span>
                        <div className="relative group">
                          <button className="w-4 h-4 bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-800 rounded-full flex items-center justify-center text-xs font-medium transition-colors">
                            ?
                          </button>
                          <div className="absolute left-0 top-full mt-2 w-80 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                            The Job Changes search filter allows you to track and engage with contacts who recently transitioned roles or changed companies. Integrated directly into the Contacts Search filter panel, it enables smarter prospecting and helps you prioritize outreach based on real-time career movement signals.
                          </div>
                        </div>
                      </h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {jobChanges.map((intent) => (
                    <div key={intent.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold">
                          {intent.person.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 text-sm">{intent.person}</h4>
                          <p className="text-slate-600 text-sm mb-1">
                            <span className="font-medium">{intent.newRole}</span> at <span className="font-medium">{intent.company}</span>
                          </p>
                          <p className="text-slate-500 text-xs mb-2">
                            Previously: {intent.previousRole} at {intent.previousCompany}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              intent.confidence === 'Confirmed' ? 'bg-green-100 text-green-700' :
                              intent.confidence === 'Likely' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {intent.confidence}
                            </span>
                            <span className="text-xs text-slate-500">{intent.changeDate}</span>
                          </div>
                          <p className="text-slate-600 text-xs">{intent.details}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => {
                            // Check if person already exists in peopleData
                            const existingPerson = peopleData.find(p => p.name === intent.person && p.company === intent.company);
                            if (!existingPerson) {
                              // Add to peopleData
                              const newPerson = {
                                name: intent.person,
                                company: intent.company,
                                role: intent.newRole,
                                location: 'United States', // Default location
                                email: `${intent.person.toLowerCase().replace(' ', '.')}@${intent.company.toLowerCase().replace(' ', '')}.com`,
                                profile: 'LinkedIn'
                              };
                              // Note: In a real app, this would update the state properly
                              alert(`${intent.person} added to People tab!`);
                            } else {
                              alert(`${intent.person} is already in the People tab.`);
                            }
                          }}
                          className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors"
                        >
                          Add to People's Tab
                        </button>
                        <button
                          onClick={() => addToWatchlist(intent, 'intents')}
                          className="px-3 py-1 text-xs bg-slate-50 text-slate-600 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2) Buyer Intent - Posts (Intent) */}
                  {personIntents.filter(i => i.type === 'instagram_post' || i.type === 'linkedin_post' || i.type === 'twitter_post' || i.type === 'reddit_post').length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                        Buyer Intent - Posts
                        <span className="text-xs font-normal text-slate-500">({personIntents.filter(i => i.type === 'instagram_post' || i.type === 'linkedin_post' || i.type === 'twitter_post' || i.type === 'reddit_post').length})</span>
                      </h3>
                      <div className="space-y-3">
                        {personIntents.filter(i => i.type === 'instagram_post' || i.type === 'linkedin_post' || i.type === 'twitter_post' || i.type === 'reddit_post').map((intent) => (
                    <div key={intent.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                          intent.type === 'instagram_post' ? 'bg-pink-100 text-pink-600' :
                          intent.type === 'linkedin_post' ? 'bg-blue-100 text-blue-600' :
                          intent.type === 'twitter_post' ? 'bg-sky-100 text-sky-600' :
                          intent.type === 'reddit_post' ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {intent.type === 'instagram_post' ? '📷' :
                           intent.type === 'linkedin_post' ? '💼' :
                           intent.type === 'twitter_post' ? '🐦' :
                           intent.type === 'reddit_post' ? '🟠' : '?'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-slate-600">{intent.source}</span>
                            <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                              Buyer Intent
                            </span>
                          </div>
                          <h4 className="font-semibold text-slate-800 text-sm mb-1">{intent.person}</h4>
                          <p className="text-slate-600 text-sm mb-1">{intent.company}</p>
                          <p className="text-slate-700 text-sm font-medium mb-2 italic">"{intent.intent || intent.post}"</p>
                          <div className="flex items-center gap-2">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              intent.confidence === 'High' ? 'bg-green-100 text-green-700' :
                              intent.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {intent.confidence || 'Unknown'}
                            </span>
                            <span className="text-xs text-slate-500">
                              {intent.postDate || intent.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => {
                            const existingPerson = peopleData.find(p => p.name === intent.person && p.company === intent.company);
                            if (!existingPerson) {
                              alert(`${intent.person} added to People tab!`);
                            } else {
                              alert(`${intent.person} is already in the People tab.`);
                            }
                          }}
                          className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors"
                        >
                          Add to People's Tab
                        </button>
                        <button
                          onClick={() => addToWatchlist(intent, 'intents')}
                          className="px-3 py-1 text-xs bg-slate-50 text-slate-600 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3) Website Forms (Intent) */}
                  {personIntents.filter(i => i.type === 'website_form').length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        Website Forms
                        <span className="text-xs font-normal text-slate-500">({personIntents.filter(i => i.type === 'website_form').length})</span>
                      </h3>
                      <div className="space-y-3">
                        {personIntents.filter(i => i.type === 'website_form').map((intent) => (
                          <div key={intent.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-green-100 text-green-600">
                                📝
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-slate-600">{intent.source}</span>
                                  <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                    Lead Action
                                  </span>
                                </div>
                                <h4 className="font-semibold text-slate-800 text-sm mb-1">{intent.person}</h4>
                                <p className="text-slate-600 text-sm mb-1">{intent.company}</p>
                                <p className="text-slate-700 text-sm font-medium mb-2">{intent.intent || intent.details}</p>
                                <div className="flex items-center gap-2">
                                  <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                    High
                                  </span>
                                  <span className="text-xs text-slate-500">{intent.formDate}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => addToWatchlist(intent, 'intents')}
                                className="px-3 py-1 text-xs bg-slate-50 text-slate-600 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4) Email Inquiries (Intent) */}
                  {personIntents.filter(i => i.type === 'email_inquiry').length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                        Email Inquiries
                        <span className="text-xs font-normal text-slate-500">({personIntents.filter(i => i.type === 'email_inquiry').length})</span>
                      </h3>
                      <div className="space-y-3">
                        {personIntents.filter(i => i.type === 'email_inquiry').map((intent) => (
                          <div key={intent.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-purple-100 text-purple-600">
                                ✉️
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-slate-600">{intent.source}</span>
                                  <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                    Inquiry
                                  </span>
                                </div>
                                <h4 className="font-semibold text-slate-800 text-sm mb-1">{intent.person}</h4>
                                <p className="text-slate-600 text-sm mb-1">{intent.company}</p>
                                <p className="text-slate-700 text-sm font-medium mb-2">{intent.intent || intent.details}</p>
                                <div className="flex items-center gap-2">
                                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                    intent.confidence === 'High' ? 'bg-green-100 text-green-700' :
                                    intent.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {intent.confidence || 'Medium'}
                                  </span>
                                  <span className="text-xs text-slate-500">{intent.inquiryDate}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => addToWatchlist(intent, 'intents')}
                                className="px-3 py-1 text-xs bg-slate-50 text-slate-600 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5) Events & Webinars */}
                  {personIntents.filter(i => i.type === 'event_registration' || i.type === 'webinar_registration').length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
                        Events & Webinars
                        <span className="text-xs font-normal text-slate-500">({personIntents.filter(i => i.type === 'event_registration' || i.type === 'webinar_registration').length})</span>
                      </h3>
                      <div className="space-y-3">
                        {personIntents.filter(i => i.type === 'event_registration' || i.type === 'webinar_registration').map((intent) => (
                          <div key={intent.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-teal-100 text-teal-600">
                                📅
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-slate-600">{intent.platform}</span>
                                  <span className="inline-block px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs font-medium">
                                    {intent.type === 'event_registration' ? 'Event' : 'Webinar'}
                                  </span>
                                </div>
                                <h4 className="font-semibold text-slate-800 text-sm mb-1">{intent.person}</h4>
                                <p className="text-slate-600 text-sm mb-1">{intent.company}</p>
                                <p className="text-slate-700 text-sm font-medium mb-2">{intent.intent || intent.details}</p>
                                <div className="flex items-center gap-2">
                                  <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                    High
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {intent.registrationDate || intent.formDate}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => addToWatchlist(intent, 'intents')}
                                className="px-3 py-1 text-xs bg-slate-50 text-slate-600 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6) Content Engagement */}
                  {personIntents.filter(i => i.type === 'content_download' || i.type === 'newsletter_subscription').length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                        Content Engagement
                        <span className="text-xs font-normal text-slate-500">({personIntents.filter(i => i.type === 'content_download' || i.type === 'newsletter_subscription').length})</span>
                      </h3>
                      <div className="space-y-3">
                        {personIntents.filter(i => i.type === 'content_download' || i.type === 'newsletter_subscription').map((intent) => (
                          <div key={intent.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-indigo-100 text-indigo-600">
                                {intent.type === 'content_download' ? '📄' : '📰'}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-slate-600">{intent.platform}</span>
                                  <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                    {intent.type === 'content_download' ? 'Download' : 'Subscription'}
                                  </span>
                                </div>
                                <h4 className="font-semibold text-slate-800 text-sm mb-1">{intent.person}</h4>
                                <p className="text-slate-600 text-sm mb-1">{intent.company}</p>
                                <p className="text-slate-700 text-sm font-medium mb-2">{intent.intent || intent.details}</p>
                                <div className="flex items-center gap-2">
                                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                    Medium
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {intent.downloadDate || intent.subscriptionDate}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => addToWatchlist(intent, 'intents')}
                                className="px-3 py-1 text-xs bg-slate-50 text-slate-600 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {personIntents.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-purple-600 text-2xl">📋</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-600 mb-2">No intents found</h3>
                      <p className="text-slate-500">There are no intents associated with {selectedPersonForIntents.name}.</p>
        </div>
      )}
    </div>
  );
            })()}
          </div>
        </div>
        </>
      )}

      {/* Company People Hover/Sidebar */}
      {selectedCompanyForPeople && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white border-l border-slate-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              {selectedCompanyForPeople.name} People
            </h2>
            <button
              onClick={() => setSelectedCompanyForPeople(null)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {(() => {
              const companyPeople = peopleData.filter(person => person.company === selectedCompanyForPeople.name);
              return companyPeople.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-600">
                      {companyPeople.length} {companyPeople.length === 1 ? 'person' : 'people'} found
                    </p>
                    <button
                      onClick={() => {
                        // Add all people from this company to the people tab
                        companyPeople.forEach(person => {
                          const existingIndex = peopleData.findIndex(p =>
                            p.name === person.name && p.company === person.company
                          );
                          if (existingIndex === -1) {
                            // Person is not already in the array, but since we're filtering from the same array, they should be there
                            // This is just to be safe
                          }
                        });
                        // Since they're already in peopleData, we could add them to watchlist or show a message
                        alert(`${companyPeople.length} people from ${selectedCompanyForPeople.name} are already in the People tab!`);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      Add to People's Tab
                    </button>
                  </div>

                  {companyPeople.map((person, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm font-semibold">
                          {person.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 text-sm">{person.name}</h3>
                          <p className="text-slate-600 text-sm mb-1">{person.role}</p>
                          <p className="text-slate-500 text-xs">{person.location}</p>
                          <p className="text-indigo-600 text-xs mt-1">{person.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => addToWatchlist(person, 'people')}
                          className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors"
                        >
                          Save to Watchlist
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No people found</h3>
                  <p className="text-slate-500 mb-6">There are no people associated with {selectedCompanyForPeople.name} in our database.</p>
                  <button
                    onClick={() => setSelectedCompanyForPeople(null)}
                    className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

    </div>
  );
}
