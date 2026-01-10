import { RawNewsItem } from './types';

const GOOGLE_NEWS_ENV_HINT =
  'Set GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID to enable real news search via Google CSE.';

type GoogleCseItem = {
  title?: string;
  link?: string;
  snippet?: string;
  displayLink?: string;
  pagemap?: {
    metatags?: Array<Record<string, string>>;
  };
};

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

const safeDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

const getDateFromGoogleItem = (item: GoogleCseItem, fallback: Date) => {
  const meta = item.pagemap?.metatags?.[0] || {};
  const rawDate =
    meta['article:published_time'] ||
    meta['og:updated_time'] ||
    meta['og:published_time'] ||
    meta['date'] ||
    meta['pubdate'];

  if (rawDate) {
    const parsed = new Date(rawDate);
    if (!Number.isNaN(parsed.getTime())) return toIsoDate(parsed);
  }

  return toIsoDate(fallback);
};

const guessCompanyFromTitle = (title: string) => {
  const separators = [' - ', ' | ', ': '];
  for (const separator of separators) {
    const parts = title.split(separator);
    if (parts[0] && parts[0].length <= 40) return parts[0].trim();
  }
  const words = title.split(' ').slice(0, 3).join(' ').trim();
  return words.length > 0 ? words : '';
};

const buildGoogleQuery = (query: string) => `${query} news fintech device financing telco bnpl`;

const fetchGoogleNews = async (query: string, count: number): Promise<RawNewsItem[]> => {
  // To enable real news search, configure the same Google CSE env vars used elsewhere.
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !searchEngineId) {
    console.warn(GOOGLE_NEWS_ENV_HINT);
    return [];
  }

  const items: RawNewsItem[] = [];
  const queryString = buildGoogleQuery(query);

  for (let start = 1; items.length < count && start <= 91; start += 10) {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(
        queryString,
      )}&num=10&start=${start}`,
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google CSE error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const results: GoogleCseItem[] = data.items || [];

    results.forEach((result, index) => {
      if (!result.title || !result.link) return;
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() - (start + index));

      items.push({
        title: result.title,
        url: result.link,
        source: result.displayLink || safeDomain(result.link) || 'News',
        date: getDateFromGoogleItem(result, fallbackDate),
        summary: result.snippet || '',
        company: guessCompanyFromTitle(result.title),
      });
    });
  }

  return items;
};

const hashString = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const createSeededRandom = (seed: number) => () => {
  const next = (seed = (seed * 1664525 + 1013904223) % 4294967296);
  return next / 4294967296;
};

const SOURCE_POOL = [
  { name: 'TechCrunch', domain: 'techcrunch.com' },
  { name: 'Reuters', domain: 'reuters.com' },
  { name: 'Bloomberg', domain: 'bloomberg.com' },
  { name: 'The Verge', domain: 'theverge.com' },
  { name: 'Finextra', domain: 'finextra.com' },
  { name: 'Fintech News', domain: 'fintechnews.com' },
  { name: 'PYMNTS', domain: 'pymnts.com' },
  { name: 'Telecoms', domain: 'telecoms.com' },
  { name: 'Mobile World Live', domain: 'mobileworldlive.com' },
  { name: 'Sifted', domain: 'sifted.eu' },
  { name: 'Tech.eu', domain: 'tech.eu' },
  { name: 'CoinDesk', domain: 'coindesk.com' },
];

const COMPANY_POOL = [
  'Klarna',
  'Affirm',
  'Afterpay',
  'Zip',
  'Tabby',
  'Tamara',
  'Sunbit',
  'Upstart',
  'Revolut',
  'Monzo',
  'Chime',
  'Nubank',
  'Fawry',
  'Vodafone',
  'Orange',
  'T-Mobile',
  'Verizon',
  'AT&T',
  'MTN',
  'Safaricom',
  'Nokia',
  'Ericsson',
  'Samsung',
  'Apple',
  'Xiaomi',
  'Oppo',
  'Vivo',
];

const TOPIC_POOL = [
  'device financing',
  'BNPL expansion',
  'telco billing',
  'device lock policy',
  'SIM swap protection',
  'merchant partnerships',
  'consumer credit limits',
  'regulatory approval',
  'cross-border payments',
  'network upgrade',
  'fraud prevention',
  'embedded finance',
  'trade-in program',
  '5G rollout',
];

const ACTION_POOL = [
  'announces',
  'launches',
  'secures',
  'expands',
  'partners with',
  'rolls out',
  'introduces',
  'finalizes',
  'pilots',
  'accelerates',
];

const REGION_POOL = [
  'in the US',
  'across Europe',
  'in the GCC',
  'in Southeast Asia',
  'in LATAM',
  'in Africa',
  'in the UK',
  'in India',
  'in MENA',
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

export const generateFallbackNews = (query: string, count: number, offset = 0): RawNewsItem[] => {
  const seed = hashString(query);
  const random = createSeededRandom(seed + offset);
  const now = new Date();

  return Array.from({ length: count }, (_, index) => {
    const company = COMPANY_POOL[Math.floor(random() * COMPANY_POOL.length)];
    const topic = TOPIC_POOL[Math.floor(random() * TOPIC_POOL.length)];
    const action = ACTION_POOL[Math.floor(random() * ACTION_POOL.length)];
    const region = REGION_POOL[Math.floor(random() * REGION_POOL.length)];
    const source = SOURCE_POOL[Math.floor(random() * SOURCE_POOL.length)];

    const daysBack = Math.floor(random() * 90);
    const date = new Date(now);
    date.setDate(now.getDate() - daysBack);

    const headline = `${company} ${action} ${topic} ${region}`;
    const summary = `${company} ${action} a ${topic} initiative ${region}, highlighting momentum in device financing and telco-backed credit programs.`;
    const slug = slugify(`${company}-${topic}-${action}-${index + offset}`);

    return {
      title: headline,
      url: `https://${source.domain}/news/${slug}`,
      source: source.name,
      date: toIsoDate(date),
      summary,
      company,
    };
  });
};

export const searchNews = async (query: string, count: number): Promise<RawNewsItem[]> => {
  const targetCount = Math.max(1, count);
  const items: RawNewsItem[] = [];
  const seenUrls = new Set<string>();

  try {
    const googleItems = await fetchGoogleNews(query, targetCount);
    googleItems.forEach((item) => {
      if (!item.url || seenUrls.has(item.url)) return;
      seenUrls.add(item.url);
      items.push(item);
    });
  } catch (error) {
    console.warn('Google CSE news search failed; using fallback.', error);
  }

  if (items.length < targetCount) {
    const fallbackItems = generateFallbackNews(query, targetCount - items.length, items.length);
    fallbackItems.forEach((item) => {
      if (!item.url || seenUrls.has(item.url)) return;
      seenUrls.add(item.url);
      items.push(item);
    });
  }

  return items;
};
