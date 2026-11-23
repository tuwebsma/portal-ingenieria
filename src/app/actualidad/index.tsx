import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PageContainer } from '@/components/PageContainer';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { NEWS_SOURCES } from '@/data/news-sources';
import { CATEGORIES } from '@/data/categories';
import { FeaturedNews } from '@/components/FeaturedNews';
import { NewsCard } from '@/components/NewsCard';
import { balanceNewsForEditorial, fetchAllNews } from '@/lib/newsIntegration';
import { NewsArticle } from '@/types';

export default function ActualidadScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadNews = Platform.OS === 'web'
      ? fetch('/api/news', { headers: { Accept: 'application/json' } }).then(async (response) => {
          if (!response.ok) throw new Error(`Actualidad: respuesta HTTP ${response.status}`);
          return response.json() as Promise<{ articles: NewsArticle[]; errors: string[] }>;
        })
      : fetchAllNews(NEWS_SOURCES);

    loadNews
      .then((result) => {
        if (!active) return;
        const balanced = balanceNewsForEditorial(result.articles, 6);
        const balancedIds = new Set(balanced.map((article) => article.id));
        setArticles([
          ...balanced,
          ...result.articles.filter((article) => !balancedIds.has(article.id)),
        ]);
        setErrors(result.errors);
      })
      .catch((error) => {
        if (!active) return;
        setErrors([error instanceof Error ? error.message : 'No se pudo actualizar Actualidad.']);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const featuredArticle = articles[0];
  const secondaryArticles = articles.slice(1);

  return (
    <PageContainer>
      <View style={styles.issueHeader}>
        <Text style={styles.kicker}>Actualidad</Text>
        <Text style={styles.title}>Ciencia, tecnología e ingeniería</Text>
        <Text style={styles.deck}>
          Cobertura editorial preparada para publicar avances oficiales de organismos,
          universidades y centros de investigación de Argentina y el mundo.
        </Text>
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.emptyTitle}>Actualizando las fuentes oficiales</Text>
        </View>
      ) : featuredArticle ? (
        <View>
          <FeaturedNews article={featuredArticle} />
          {secondaryArticles.length > 0 && (
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Últimas publicaciones</Text>
              <Text style={styles.resultsMeta}>
                {articles.length} novedades · ordenadas de más reciente a más antigua
              </Text>
            </View>
          )}
          <View
            style={[
              styles.newsGrid,
              isDesktop ? styles.grid3 : isTablet ? styles.grid2 : styles.grid1,
            ]}
          >
            {secondaryArticles.map((article) => (
              <NewsCard key={article.id} article={article} variant="vertical" />
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="newspaper-outline" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>Todavía no hay publicaciones disponibles</Text>
          <Text style={styles.emptyText}>
            Las fuentes oficiales no devolvieron novedades en este momento.
          </Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => setRefreshKey((current) => current + 1)}
          >
            <Ionicons name="refresh-outline" size={15} color={COLORS.white} />
            <Text style={styles.retryButtonText}>Actualizar</Text>
          </Pressable>
        </View>
      )}

      {errors.length > 0 && !loading && (
        <View style={styles.sourceWarning}>
          <Ionicons name="information-circle-outline" size={17} color={COLORS.primary} />
          <Text style={styles.sourceWarningText}>
            Algunas fuentes no pudieron actualizarse: {errors.join(' · ')}
          </Text>
        </View>
      )}

      <View style={styles.editorialGrid}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Secciones previstas</Text>
          {CATEGORIES.map((category) => (
            <View key={category.slug} style={styles.categoryRow}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>Próximamente</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Fuentes oficiales preparadas</Text>
          {NEWS_SOURCES.map((source) => (
            <View key={source.id} style={styles.sourceRow}>
              <View>
                <Text style={styles.sourceName}>{source.shortName}</Text>
                <Text style={styles.sourceMeta}>{source.country}</Text>
              </View>
              <Ionicons name="link-outline" size={16} color={COLORS.textLight} />
            </View>
          ))}
          <Link href="/instituciones" asChild>
            <Pressable style={styles.directoryLink}>
              <Text style={styles.directoryLinkText}>Ver instituciones</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
            </Pressable>
          </Link>
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  issueHeader: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primaryDark,
    paddingBottom: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    color: COLORS.primaryDark,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '900',
    letterSpacing: -1,
  },
  deck: {
    color: COLORS.textMuted,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 760,
    marginTop: 8,
  },
  emptyState: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primarySoft,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryDark,
    textAlign: 'center',
  },
  emptyText: {
    maxWidth: 620,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  resultsHeader: {
    borderTopWidth: 2,
    borderTopColor: COLORS.primaryDark,
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  resultsTitle: {
    color: COLORS.primaryDark,
    fontSize: 22,
    fontWeight: '900',
  },
  resultsMeta: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 2,
  },
  newsGrid: {
    display: 'flex',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  grid1: {
    flexDirection: 'column',
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  grid3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sourceWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sourceWarningText: {
    flex: 1,
    color: COLORS.primaryDark,
    fontSize: 12,
    lineHeight: 18,
  },
  editorialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
  },
  panel: {
    flexGrow: 1,
    flexBasis: 300,
    backgroundColor: COLORS.white,
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  categoryName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryCount: {
    color: COLORS.textLight,
    fontSize: 11,
  },
  sourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  sourceName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  sourceMeta: {
    color: COLORS.textLight,
    fontSize: 11,
  },
  directoryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  directoryLinkText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
