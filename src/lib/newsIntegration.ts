import {
  NewsArticle,
  NewsSource,
  NewsSourceDiagnostic,
} from '@/types';

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
  return xml.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'))?.[1] ?? '';
};

const matchAttribute = (xml: string, tagName: string, attribute: string): string => {
  const escapedTag = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tag = xml.match(new RegExp(`<${escapedTag}[^>]*>`, 'i'))?.[0] ?? '';
  return tag.match(new RegExp(`${escapedAttribute}=["']([^"']+)["']`, 'i'))?.[1] ?? '';
};

const firstImageUrl = (itemXml: string): string => {
  const enclosureUrl = matchAttribute(itemXml, 'enclosure', 'url');
  if (enclosureUrl) return enclosureUrl;
  const mediaUrl =
    matchAttribute(itemXml, 'media:content', 'url') ||
    matchAttribute(itemXml, 'media:thumbnail', 'url');
  if (mediaUrl) return mediaUrl;
  const combined = `${matchTag(itemXml, 'content:encoded')}${matchTag(itemXml, 'description')}`;
  return combined.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? '';
};

const inferCategory = (text: string): { id: string; name: string } => {
  const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (/nuclear|reactor|radiacion|energia|bateria/.test(normalized)) {
    return { id: 'nuclear-energia', name: 'Energía & Nuclear' };
  }
  if (/satellite|satelite|espacio|lunar|mars|astronaut|orbita|esa|nasa/.test(normalized)) {
    return { id: 'aeroespacial', name: 'Aeroespacial & Satélites' };
  }
  if (/inteligencia artificial|computacion|software|robot|algoritmo|datos|digital/.test(normalized)) {
    return { id: 'computacion-ia', name: 'IA & Computación' };
  }
  if (/medicina|salud|cancer|biologia|biotecnologia|vacuna/.test(normalized)) {
    return { id: 'biomedica-salud', name: 'Biomédica & Salud' };
  }
  if (/material|litio|quimica|quimico|baterias/.test(normalized)) {
    return { id: 'quimica-materiales', name: 'Materiales & Litio' };
  }
  if (/infraestructura|civil|puente|vial|obra|construccion|transporte/.test(normalized)) {
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
    .slice(0, 100);

const extractItems = (xml: string): string[] => {
  const atomItems = xml.match(/<entry(?:\s[^>]*)?>[\s\S]*?<\/entry>/gi);
  if (atomItems?.length) return atomItems;
  return xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi) ?? [];
};

const atomLink = (itemXml: string): string =>
  itemXml.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i)?.[1] ??
  itemXml.match(/<link[^>]*>([^<]+)<\/link>/i)?.[1] ??
  '';

const parseSpanishDate = (value: string): Date | null => {
  const normalized = value
    .replace(/\bde\b/gi, '-')
    .replace(/\s+/g, '')
    .replace(/\.(?=\s)/g, '');
  const months: Record<string, number> = {
    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
    julio: 6, agosto: 7, septiembre: 8, octubre: 9,
    noviembre: 10, diciembre: 11,
  };
  const match = normalized.match(/(\d{1,2})-(\w+)-(\d{4})/i);
  if (!match) return null;
  const month = months[match[2].toLowerCase()];
  if (month === undefined) return null;
  return new Date(Number(match[3]), month, Number(match[1]));
};

const themePattern =
  /ingenier|ciencia|cientific|investig|tecnolog|innovacion|innovación|industria|industrial|energ|telecom|inteligencia artificial|robot|informat|material|infraestructura|aeroespacial|fisic|fisica|biotecnolog|nuevo producto|desarrollo product|matematica|matemática|neuro|vacuna|reactor|nuclear|satellite|satelite|espacio|investigacion|investigación|ecologia|ecología|ambiente|fauna|flora|biodiversidad|biologia|biología/;

const isThemeValid = (source: NewsSource, title: string, summary: string): boolean => {
  const haystack = `${title} ${summary}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (source.id === 'fiuba') {
    const excluded =
      /inscripcion|inscripciones|convocatoria|deporte|curs|calendar|calendario|memoria|fallecimiento|muestra|museos|capilla|beca|administrativo|compras|licitacion|licencia|credencial estudiantil|junta directiva|directoras|nodocentes|social|de graduados|graduacion|graduados/;
    if (excluded.test(haystack)) return false;
  }
  if (source.id === 'nexciencia') {
    const excluded = /presupuesto|financiamiento universitario|docentes|sindical|eleccion|elecciones|administracion|deportes/;
    if (excluded.test(haystack)) return false;
    return true;
  }
  if (source.id === 'esa' || source.id === 'conicet') {
    return true;
  }
  return themePattern.test(haystack);
};

const makeArticle = (
  source: NewsSource,
  title: string,
  summary: string,
  originalUrl: string,
  publishedAt: string,
  imageUrl: string,
  index = 0
): NewsArticle | null => {
  const cleanTitle = decodeHtml(title);
  const cleanSummary = decodeHtml(summary);
  const parsedDate = new Date(publishedAt);
  if (!cleanTitle || !originalUrl || Number.isNaN(parsedDate.getTime())) return null;
  if (!isThemeValid(source, cleanTitle, cleanSummary)) return null;
  const category = inferCategory(`${cleanTitle} ${cleanSummary}`);
  return {
    id: `${source.id}-${slugify(`${originalUrl}-${parsedDate.toISOString()}`)}`,
    slug: slugify(`${source.shortName}-${cleanTitle}`),
    title: cleanTitle,
    summary: cleanSummary,
    category: category.id,
    categoryName: category.name,
    imageUrl,
    sourceName: source.shortName,
    sourceUrl: source.websiteUrl,
    originalUrl,
    publishedAt: parsedDate.toISOString(),
    ingestedAt: new Date().toISOString(),
    tags: [],
    isFeatured: index === 0,
  };
};

const fetchRssSource = async (source: NewsSource): Promise<NewsArticle[]> => {
  const response = await fetch(source.feedUrl!, {
    headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const xml = await response.text();
  const items = extractItems(xml);
  const articles: NewsArticle[] = [];
  items.forEach((item, index) => {
    const title = decodeHtml(matchTag(item, 'title'));
    const originalUrl = decodeHtml(matchTag(item, 'link')) || atomLink(item);
    const rawSummary =
      matchTag(item, 'description') ||
      matchTag(item, 'summary') ||
      matchTag(item, 'content:encoded');
    const publishedRaw =
      matchTag(item, 'pubDate') ||
      matchTag(item, 'published') ||
      matchTag(item, 'updated') ||
      matchTag(item, 'dc:date');
    const article = makeArticle(
      source,
      title,
      rawSummary,
      originalUrl,
      decodeHtml(publishedRaw),
      firstImageUrl(item),
      index
    );
    if (article) articles.push(article);
  });
  return articles;
};

const fetchNexWordPressApi = async (source: NewsSource): Promise<NewsArticle[]> => {
  const response = await fetch(
    'https://nexciencia.exactas.uba.ar/wp-json/wp/v2/posts?per_page=100&_embed=wp:featuredmedia&_fields=id,date,link,title,excerpt,featured_media,_embedded'
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const posts = await response.json() as {
    id: number;
    date: string;
    link: string;
    title: { rendered: string };
    excerpt: { rendered: string };
    featured_media: number;
    _embedded?: {
      'wp:featuredmedia'?: { source_url?: string }[];
    };
  }[];

  const articles: NewsArticle[] = [];
  for (const post of posts) {
    const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '';
    const article = makeArticle(
      source,
      post.title.rendered,
      post.excerpt.rendered,
      post.link,
      post.date,
      imageUrl
    );
    if (article) articles.push(article);
  }
  return articles;
};

const absoluteUrl = (url: string, base: string): string => {
  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
};

const fetchFiubaHtml = async (source: NewsSource): Promise<NewsArticle[]> => {
  const response = await fetch(source.listingUrl!);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  const cardPattern =
    /<a[^>]+href="(\/noticias\/[^"]+)"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[^>]*>[\s\S]*?<div[^>]+news-title-box[^>]*>([\s\S]*?)<\/div>[\s\S]*?<p[^>]+news-text-box[^>]*>([\s\S]*?)<\/p>[\s\S]*?<span[^>]*>([^<]+)<\/span>/gi;
  const articles: NewsArticle[] = [];
  let match: RegExpExecArray | null;
  while ((match = cardPattern.exec(html)) !== null) {
    const dateText = decodeHtml(match[5]);
    const dateMatch = dateText.match(/(\d{1,2})\s+de\s+([a-z]+)(?:,\s*\d{1,2}\.\d{2})?/i);
    const parsed = dateMatch
      ? parseSpanishDate(`${dateMatch[1]} de ${dateMatch[2]} de ${new Date().getFullYear()}`)
      : null;
    if (!parsed) continue;
    const article = makeArticle(
      source,
      match[3],
      match[4],
      absoluteUrl(match[1], source.websiteUrl),
      parsed.toISOString(),
      absoluteUrl(match[2], source.websiteUrl)
    );
    if (article) articles.push(article);
  }
  return articles;
};

const fetchArgentineHtml = async (source: NewsSource): Promise<NewsArticle[]> => {
  const response = await fetch(source.listingUrl!);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  const cardPattern =
    /<a[^>]+href="(\/noticias\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  const articles: NewsArticle[] = [];
  let match: RegExpExecArray | null;
  while ((match = cardPattern.exec(html)) !== null) {
    const block = match[2];
    const dateMatch =
      block.match(/<time[^>]*datetime=['"]([^'"]+)['"]/i) ??
      block.match(/(\d{1,2}\s+de\s+[a-záéíóú]+\s+de\s+\d{4})/i);
    const titleMatch = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    if (!dateMatch || !titleMatch) continue;
    const parsed = dateMatch[1].includes('-')
      ? new Date(`${dateMatch[1].slice(0, 10)}T12:00:00Z`)
      : parseSpanishDate(dateMatch[1]);
    if (!parsed) continue;
    const afterTitle = block.slice(block.indexOf(titleMatch[0]) + titleMatch[0].length);
    const summary = decodeHtml(afterTitle.split('<')[0]);
    const imageMatch = block.match(/background-image:url\(([^)]+)\)/i);
    const article = makeArticle(
      source,
      titleMatch[1],
      summary,
      absoluteUrl(match[1], 'https://www.argentina.gob.ar'),
      parsed.toISOString(),
      imageMatch?.[1] ? imageMatch[1].replace(/["']/g, '') : ''
    );
    if (article) articles.push(article);
  }
  return articles;
};

const fetchConicetHtml = async (source: NewsSource): Promise<NewsArticle[]> => {
  const response = await fetch(source.listingUrl!);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  const cardPattern =
    /<li[^>]*id="fragment-\d+"[^>]*>\s*<a href="(https:\/\/www\.conicet\.gov\.ar\/[^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/li>/gi;
  const articles: NewsArticle[] = [];
  let match: RegExpExecArray | null;
  while ((match = cardPattern.exec(html)) !== null) {
    const block = match[2];
    const imageMatch = block.match(/<img[^>]+class="wp-post-image"[^>]+src="([^"]+)"/i);
    const dateMatch = block.match(/<div[^>]+class="volanta"[^>]*>([\s\S]*?)<\/div>/i);
    const titleMatch = block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const descriptionMatch = block.match(/<div[^>]+class="slide-desc"[^>]*>\s*<p[^>]*>([\s\S]*?)<\/p>/i);
    if (!titleMatch) continue;
    const dateText = dateMatch ? decodeHtml(dateMatch[1]) : '';
    const dateParsed = dateText.match(/(\d{1,2})\/(\d{1,2})\/(\d{2})/);
    let publishedAt = '';
    if (dateParsed) {
      publishedAt = new Date(2000 + Number(dateParsed[3]), Number(dateParsed[2]) - 1, Number(dateParsed[1])).toISOString();
    } else {
      continue;
    }
    const article = makeArticle(
      source,
      titleMatch[1],
      descriptionMatch?.[1] ?? '',
      match[1],
      publishedAt,
      imageMatch?.[1] ?? ''
    );
    if (article) articles.push(article);
  }
  return articles;
};

const fetchEsaHtml = async (source: NewsSource): Promise<NewsArticle[]> => {
  const response = await fetch(source.listingUrl!);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  const cardPattern =
    /<article[^>]+data-card-link="([^"]*\/es\/articles\/[^"]*)"[^>]*>([\s\S]*?)<\/article>/gi;
  const articles: NewsArticle[] = [];
  let match: RegExpExecArray | null;
  while ((match = cardPattern.exec(html)) !== null) {
    const block = match[2];
    const titleMatch =
      block.match(/<span[^>]+class="[^"]*title__link-text[^"]*"[^>]*>([\s\S]*?)<\/span>/i) ??
      block.match(/<(?:h1|h2|h3)[^>]*>([\s\S]*?)<\/(?:h1|h2|h3)>/i);
    const dateMatch = block.match(/(\d{1,2}\s+[A-Z]{3}\.?\s+\d{4})/i);
    const imageMatch = block.match(/<img[^>]+src="([^"]+)"/i);
    if (!titleMatch) continue;
    let parsedDate: Date | null = null;
    if (dateMatch) {
      const parts = dateMatch[1].match(/(\d{1,2})\s+([A-Z]{3})\.?\s+(\d{4})/i);
      if (parts) {
        const months: Record<string, number> = {
          jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
          jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
        };
        const month = months[parts[2].slice(0, 3).toLowerCase()];
        if (month !== undefined) {
          parsedDate = new Date(Number(parts[3]), month, Number(parts[1]));
        }
      }
    }
    if (!parsedDate || Number.isNaN(parsedDate.getTime())) continue;
    const article = makeArticle(
      source,
      titleMatch[1],
      '',
      absoluteUrl(match[1], source.websiteUrl),
      parsedDate.toISOString(),
      imageMatch?.[1] ? absoluteUrl(imageMatch[1], source.websiteUrl) : ''
    );
    if (article) articles.push(article);
  }
  return articles;
};

export const fetchNewsFromSource = async (source: NewsSource): Promise<NewsArticle[]> => {
  if (!source.enabled) return [];
  if (source.adapter === 'wordpress-api' || source.id === 'nexciencia') {
    return fetchNexWordPressApi(source);
  }
  if (source.adapter === 'rss') {
    return fetchRssSource(source);
  }
  if (source.id === 'fiuba') return fetchFiubaHtml(source);
  if (source.id === 'conicet') return fetchConicetHtml(source);
  if (source.id === 'esa') return fetchEsaHtml(source);
  if (source.id === 'cnea' || source.id === 'inti') return fetchArgentineHtml(source);
  return [];
};

export const fetchAllNews = async (sources: NewsSource[]): Promise<{
  articles: NewsArticle[];
  errors: string[];
  diagnostics: NewsSourceDiagnostic[];
}> => {
  const articles: NewsArticle[] = [];
  const errors: string[] = [];
  const diagnostics: NewsSourceDiagnostic[] = [];

  await Promise.all(sources.map(async (source) => {
    const lastChecked = new Date().toISOString();
    if (!source.enabled) {
      diagnostics.push({
        sourceId: source.id,
        name: source.shortName,
        originUrl: source.listingUrl ?? source.feedUrl ?? source.websiteUrl,
        mechanism: 'pending',
        status: 'disabled',
        obtained: 0,
        valid: 0,
        discarded: 0,
        lastChecked,
      });
      return;
    }

    let obtained = 0;
    try {
      const sourceArticles = await fetchNewsFromSource(source);
      obtained = sourceArticles.length;
      articles.push(...sourceArticles);
      diagnostics.push({
        sourceId: source.id,
        name: source.shortName,
        originUrl: source.listingUrl ?? source.feedUrl ?? source.websiteUrl,
        mechanism: source.adapter ?? source.integrationType,
        status: sourceArticles.length ? 'ok' : 'empty',
        obtained,
        valid: sourceArticles.length,
        discarded: 0,
        lastChecked,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      errors.push(`${source.shortName}: ${message}`);
      diagnostics.push({
        sourceId: source.id,
        name: source.shortName,
        originUrl: source.listingUrl ?? source.feedUrl ?? source.websiteUrl,
        mechanism: source.adapter ?? source.integrationType,
        status: 'error',
        obtained,
        valid: 0,
        discarded: 0,
        lastChecked,
        error: message,
      });
    }
  }));

  const deduplicated = Array.from(
    new Map(articles.map((article) => [article.originalUrl || article.id, article])).values()
  ).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  diagnostics.forEach((diagnostic) => {
    if (diagnostic.status === 'ok') {
      const valid = deduplicated.filter((article) => article.sourceName === diagnostic.name).length;
      diagnostic.valid = valid;
    }
  });

  return { articles: deduplicated, errors, diagnostics };
};

export const balanceNewsForEditorial = (articles: NewsArticle[], limit = 6): NewsArticle[] => {
  const unique = Array.from(
    new Map(articles.map((article) => [article.originalUrl || article.id, article])).values()
  ).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const groups = new Map<string, NewsArticle[]>();
  unique.forEach((article) => {
    const sourceArticles = groups.get(article.sourceName) ?? [];
    sourceArticles.push(article);
    groups.set(article.sourceName, sourceArticles);
  });

  const sourceNames = Array.from(groups.keys()).sort((a, b) => {
    const latestA = groups.get(a)?.[0]?.publishedAt ?? '';
    const latestB = groups.get(b)?.[0]?.publishedAt ?? '';
    return latestB.localeCompare(latestA);
  });
  const sourceIndexes = new Map(sourceNames.map((sourceName) => [sourceName, 0]));
  const result: NewsArticle[] = [];

  while (result.length < limit) {
    let added = false;
    for (const sourceName of sourceNames) {
      if (result.length >= limit) break;
      const count = result.filter((item) => item.sourceName === sourceName).length;
      if (count >= 2) continue;
      const sourceIndex = sourceIndexes.get(sourceName) ?? 0;
      const article = groups.get(sourceName)?.[sourceIndex];
      if (!article) continue;
      result.push(article);
      sourceIndexes.set(sourceName, sourceIndex + 1);
      added = true;
    }
    if (!added) break;
  }

  if (result.length < limit) {
    const ids = new Set(result.map((article) => article.id));
    for (const article of unique) {
      if (result.length >= limit) break;
      if (!ids.has(article.id)) result.push(article);
    }
  }
  return result;
};
