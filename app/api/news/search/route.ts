import { type NextRequest, NextResponse } from 'next/server';
import { searchNews } from '@/lib/news/providers';
import { normalizeNewsRows } from '@/lib/news/normalize';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = typeof body?.query === 'string' ? body.query.trim() : '';
    const count = typeof body?.count === 'number' && Number.isFinite(body.count) ? Math.floor(body.count) : undefined;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const targetCount = count && count > 0 ? count : 25;
    const items = await searchNews(query, targetCount);
    const rows = normalizeNewsRows(items, query);

    return NextResponse.json({ rows });
  } catch (error) {
    console.error('News search error:', error);
    return NextResponse.json({ error: 'Failed to search news' }, { status: 500 });
  }
}
