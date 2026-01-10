import { NEWS_CSV_HEADERS } from './schema';
import { NewsCsvHeader, NewsRow, RawNewsItem } from './types';
import { scoreNewsItem } from './scoring';

const isTitleHeader = (key: string) => key === 'title';
const isUrlHeader = (key: string) => key === 'url' || key.includes('link');
const isSourceHeader = (key: string) => key === 'source';
const isDateHeader = (key: string) => key.includes('date');
const isCompanyHeader = (key: string) => key.includes('company');
const isSummaryHeader = (key: string) => key.includes('summary') || key.includes('description');
const isMatchHeader = (key: string) => key.includes('match');
const isRelevanceHeader = (key: string) => key.includes('relevance');
const isImpactHeader = (key: string) => key.includes('impact');
const isUrgencyHeader = (key: string) => key.includes('urgency');
const isSignificanceHeader = (key: string) => key.includes('significance');
const isConfidenceHeader = (key: string) => key.includes('confidence');
const isPriorityHeader = (key: string) => key.includes('priority');
const isStatusHeader = (key: string) => key.includes('status');

export const normalizeNewsRows = (
  items: RawNewsItem[],
  query: string,
  headers: NewsCsvHeader[] = NEWS_CSV_HEADERS,
): NewsRow[] => {
  return items.map((item) => {
    const scores = scoreNewsItem({ query, title: item.title, summary: item.summary });
    const row: NewsRow = {};

    headers.forEach((header) => {
      const key = header.trim().toLowerCase();

      if (isTitleHeader(key)) {
        row[header] = item.title;
        return;
      }

      if (isUrlHeader(key)) {
        row[header] = item.url;
        return;
      }

      if (isSourceHeader(key)) {
        row[header] = item.source;
        return;
      }

      if (isDateHeader(key)) {
        row[header] = item.date;
        return;
      }

      if (isCompanyHeader(key)) {
        row[header] = item.company ?? '';
        return;
      }

      if (isSummaryHeader(key)) {
        row[header] = item.summary;
        return;
      }

      if (isMatchHeader(key)) {
        row[header] = '';
        return;
      }

      if (isRelevanceHeader(key)) {
        row[header] = scores.relevance;
        return;
      }

      if (isImpactHeader(key)) {
        row[header] = scores.impact;
        return;
      }

      if (isUrgencyHeader(key)) {
        row[header] = scores.urgency;
        return;
      }

      if (isSignificanceHeader(key)) {
        row[header] = scores.significance;
        return;
      }

      if (isConfidenceHeader(key)) {
        row[header] = scores.confidence;
        return;
      }

      if (isPriorityHeader(key)) {
        row[header] = scores.priority;
        return;
      }

      if (isStatusHeader(key)) {
        row[header] = 'New';
        return;
      }

      row[header] = '';
    });

    return row;
  });
};
