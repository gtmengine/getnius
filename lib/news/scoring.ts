export type NewsScoreInput = {
  query: string;
  title?: string;
  summary?: string;
};

export type NewsScores = {
  relevance: number;
  impact: number;
  urgency: number;
  significance: number;
  confidence: number;
  priority: 'High' | 'Medium' | 'Low';
};

const IMPACT_KEYWORDS = [
  'funding',
  'raises',
  'raised',
  'series',
  'acquisition',
  'acquires',
  'merger',
  'earnings',
  'revenue',
  'profit',
  'ipo',
  'layoffs',
  'regulation',
  'regulator',
  'lawsuit',
  'partnership',
  'expansion',
  'launch',
  'bankruptcy',
  'default',
  'breach',
  'outage',
];

const URGENCY_KEYWORDS = [
  'today',
  'breaking',
  'immediate',
  'urgent',
  'deadline',
  'recall',
  'halt',
  'ban',
  'warning',
  'investigation',
  'charge',
  'fine',
  'shutdown',
];

const SIGNIFICANCE_KEYWORDS = [
  'major',
  'record',
  'first',
  'largest',
  'global',
  'nationwide',
  'landmark',
  'exclusive',
  'strategic',
  'billion',
  'million',
  'multi-year',
  'flagship',
];

const clampScore = (value: number) => Math.max(0, Math.min(5, value));

const tokenize = (text: string) =>
  Array.from(new Set(text.toLowerCase().split(/\W+/).filter((token) => token.length >= 3)));

const scoreByKeywords = (text: string, keywords: string[]) => {
  let hits = 0;
  for (const keyword of keywords) {
    const pattern = new RegExp(`\\b${keyword}\\b`, 'i');
    if (pattern.test(text)) hits += 1;
  }
  if (hits === 0) return 0;
  return clampScore(hits + 1);
};

export const scoreNewsItem = ({ query, title, summary }: NewsScoreInput): NewsScores => {
  const combined = `${title ?? ''} ${summary ?? ''}`.toLowerCase();
  const queryTokens = tokenize(query || '');

  const tokenMatches = queryTokens.filter((token) => combined.includes(token)).length;
  let relevance = queryTokens.length === 0 ? 0 : Math.round((tokenMatches / queryTokens.length) * 5);
  if (tokenMatches > 0 && relevance === 0) relevance = 1;
  relevance = clampScore(relevance);

  const impact = scoreByKeywords(combined, IMPACT_KEYWORDS);
  const urgency = scoreByKeywords(combined, URGENCY_KEYWORDS);
  const significance = clampScore(Math.round((impact + scoreByKeywords(combined, SIGNIFICANCE_KEYWORDS)) / 2));

  const priorityScore = relevance + impact + urgency;
  const priority = priorityScore >= 11 ? 'High' : priorityScore >= 7 ? 'Medium' : 'Low';

  return {
    relevance,
    impact,
    urgency,
    significance,
    confidence: 3,
    priority,
  };
};
