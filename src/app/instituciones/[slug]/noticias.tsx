import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { PageContainer } from '@/components/PageContainer';
import { NewsCard } from '@/components/NewsCard';
import { COLORS, SPACING } from '@/constants/theme';
import { INSTITUTIONS } from '@/data/institutions';
import { NEWS_SOURCES } from '@/data/news-sources';
import { fetchAllNews } from '@/lib/newsIntegration';
import { NewsArticle } from '@/types';

export default function InstitutionNewsListPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;
  const institution = INSTITUTIONS.find((item) => item.slug === slug);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = Platform.OS === 'web'
      ? fetch('/api/news', { headers: { Accept: 'application/json' } }).then(async (response) => {
          if (!response.ok) throw new Error(`Noticias: respuesta HTTP ${response.status}`);
          return response.json() as Promise<{ articles: NewsArticle[] }>;
        }).then((result) => result.articles)
      : fetchAllNews(NEWS_SOURCES).then((result) => result.articles);

    load.then((articles) => {
      if (!active || !institution) return;
      setNews(
        articles
          .filter((article) =>
            article.sourceName === institution.acronym ||
            NEWS_SOURCES.find((source) => source.shortName === article.sourceName)?.id === institution.id
          )
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      );
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [institution]);

  if (!institution) {
    return (
      <PageContainer>
        <Text style={styles.title}>Institución no encontrada</Text>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <View style={styles.header}>
        <Text style={styles.kicker}>{institution.acronym}</Text>
        <Text style={styles.title}>Todas las noticias de {institution.acronym}</Text>
      </View>
      {loading ? (
        <View style={styles.status}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : news.length > 0 ? (
        <View style={[styles.grid, isDesktop ? styles.grid3 : isTablet ? styles.grid2 : styles.grid1]}>
          {news.map((article) => (
            <NewsCard key={article.id} article={article} variant="vertical" />
          ))}
        </View>
      ) : (
        <Text style={styles.empty}>PRÓXIMAMENTE NOTICIAS</Text>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primaryDark,
    paddingBottom: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  title: {
    color: COLORS.primaryDark,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
  },
  status: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  grid1: { flexDirection: 'column' },
  grid2: {},
  grid3: {},
  empty: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
