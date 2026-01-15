import { useCallback, useState } from 'react';
import type { NewsRow } from '@/lib/news/types';

type NewsSearchState = {
  rows: NewsRow[];
  loading: boolean;
  error: string | null;
  runSearch: (query: string, count?: number) => Promise<void>;
};

export function useNewsSearch(): NewsSearchState {
  const [rows, setRows] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(async (query: string, count: number = 25) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Please enter a search query.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/news/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmedQuery, count }),
      });

      if (!response.ok) {
        const message = `News search failed (${response.status}).`;
        throw new Error(message);
      }

      const data = await response.json();
      const nextRows = Array.isArray(data?.rows) ? data.rows : [];
      setRows(nextRows);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'News search failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { rows, loading, error, runSearch };
}
