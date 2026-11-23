import { NewsArticle, NewsSource } from '@/types';

const decodeHtml = (value: string): string =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#8230;|&hellip;/g, '...')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const matchTag = (xml: string, tagName: string): string => {
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = xml.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'));
  return match?.[1] ?? '';
};

const matchAttribute = (xml: string, tagName: string, attribute: string): string => {
  const escapedTag = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tag = xml.match(new RegExp(`<${escapedTag}[^>]*>`, 'i'))?.[0] ?? '';
  const value = tag.match(new RegExp(`${escapedAttribute}=["']([^"']+)["']`, 'i'))?.[1];
  return value ?? '';
};

const firstImageUrl = (itemXml: string): string => {
  const enclosureUrl = matchAttribute(itemXml, 'enclosure', 'url');
  if (enclosureUrl) return enclosureUrl;

  const mediaUrl =
    matchAttribute(itemXml, 'media:content', 'url') ||
    matchAttribute(itemXml, 'media:thumbnail', 'url');
  if (mediaUrl) return mediaUrl;

  const encoded = matchTag(itemXml, 'content:encoded');
  const description = matchTag(itemXml, 'description');
  const imageTag = `${encoded}${description}`.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imageTag?.[1] ?? '';
};

const inferCategory = (text: string): { id: string; name: string } => {
  const normalized = text.toLowerCase();
  if (/nuclear|reactor|radiaci|atom|energ/.test(normalized)) {
    return { id: 'nuclear-energia', name: 'Energía & Nuclear' };
  }
  if (/satélite|satelite|espacio|lunar|mars|astronaut|orbita|órbita|esa|nasa/.test(normalized)) {
    return { id: 'aeroespacial', name: 'Aeroespacial & Satélites' };
  }
  if (/inteligencia artificial|comput|software|robot|algorit|datos/.test(normalized)) {
    return { id: 'computacion-ia', name: 'IA & Computación' };
  }
  if (/medicina|médic|biolog|salud|cáncer|cancer|biótic/.test(normalized)) {
    return { id: 'biomedica-salud', name: 'Biomédica & Salud' };
  }
  if (/material|litio|químic|quimic|bater/.test(normalized)) {
    return { id: 'quimica-materiales', name: 'Materiales & Litio' };
  }
  if (/infraestructura|civil|puente|vial|obra|constru/.test(normalized)) {
    return { id: 'infraestructura-civil', name: 'Infraestructura & Civil' };
  }
  return { id: 'innovacion-tecnologica', name: 'Innovación & Tecnología' };
};

const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

const extractItems = (xml: string): string[] => {
  const atomItems = xml.match(/<entry(?:\s[^>]*)?>[\s\S]*?<\/entry>/gi);
  if (atomItems?.length) return atomItems;
  return xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi) ?? [];
};

const atomLink = (itemXml: string): string =>
  itemXml.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i)?.[1] ??
  itemXml.match(/<link[^>]*>([^<]+)<\/link>/i)?.[1] ??
  '';

export const fetchNewsFromSource = async (source: NewsSource): Promise<NewsArticle[]> => {
  if (!source.enabled || !source.feedUrl) return [];

  const response = await fetch(source.feedUrl, {
    headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
  });
  if (!response.ok) {
    throw new Error(`${source.shortName}: respuesta HTTP ${response.status}`);
  }

  const xml = await response.text();
  const ingestedAt = new Date().toISOString();
  const items = extractItems(xml);

  return items
    .map((item, index): NewsArticle | null => {
      const title = decodeHtml(matchTag(item, 'title'));
      const rssLink = decodeHtml(matchTag(item, 'link'));
      const originalUrl = rssLink || atomLink(item);
      const rawSummary =
        matchTag(item, 'description') ||
        matchTag(item, 'summary') ||
        matchTag(item, 'content:encoded');
      const summary = decodeHtml(rawSummary).replace(/^.*?<\/p>/i, '').trim();
      const publishedRaw =
        matchTag(item, 'pubDate') ||
        matchTag(item, 'published') ||
        matchTag(item, 'updated') ||
        matchTag(item, 'dc:date');

      const parsedDate = new Date(decodeHtml(publishedRaw));
      if (!title || !originalUrl || Number.isNaN(parsedDate.getTime())) return null;

      const category = inferCategory(`${title} ${summary}`);
      const publishedAt = parsedDate.toISOString();
      const imageUrl = firstImageUrl(item);
      const idBase = matchTag(item, 'guid') || originalUrl || `${source.id}-${index}`;

      return {
        id: `${source.id}-${slugify(idBase)}`,
        slug: slugify(`${source.shortName}-${title}`),
        title,
        summary: summary || `Publicación oficial de ${source.shortName}.`,
        category: category.id,
        categoryName: category.name,
        imageUrl,
        sourceName: source.shortName,
        sourceUrl: source.websiteUrl,
        originalUrl,
        publishedAt,
        ingestedAt,
        tags: [],
        isFeatured: index === 0,
      };
    })
    .filter((article): article is NewsArticle => article !== null);
};

export const fetchAllNews = async (sources: NewsSource[]): Promise<{
  articles: NewsArticle[];
  errors: string[];
}> => {
  const enabledSources = sources.filter((source) => source.enabled);
  const results = await Promise.allSettled(enabledSources.map(fetchNewsFromSource));
  const articles: NewsArticle[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    } else {
      errors.push(`${enabledSources[index].shortName}: ${result.reason instanceof Error ? result.reason.message : 'No se pudo cargar la fuente.'}`);
    }
  });

  articles.sort((a, b) => {
    const dateDiff = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.sourceName.localeCompare(b.sourceName);
  });

  return {
    articles,
    errors,
  };
};
