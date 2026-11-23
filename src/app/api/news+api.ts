import { fetchAllNews } from '@/lib/newsIntegration';
import { NEWS_SOURCES } from '@/data/news-sources';

export async function GET() {
  const result = await fetchAllNews(NEWS_SOURCES);

  return Response.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900',
    },
  });
}
