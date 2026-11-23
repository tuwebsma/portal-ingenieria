import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { PageContainer } from '@/components/PageContainer';
import { CategoryCard } from '@/components/CategoryCard';
import { NewsCard } from '@/components/NewsCard';
import { InstitutionLogoStrip } from '@/components/InstitutionLogoStrip';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { ENGINEERING_BRANCHES } from '@/data/engineering';
import { INSTITUTIONS } from '@/data/institutions';
import { NEWS_SOURCES } from '@/data/news-sources';
import { fetchAllNews, balanceNewsForEditorial } from '@/lib/newsIntegration';
import { NewsArticle } from '@/types';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    let active = true;

    const load = Platform.OS === 'web'
      ? fetch('/api/news', { headers: { Accept: 'application/json' } }).then(async (response) => {
          if (!response.ok) throw new Error(`Actualidad: respuesta HTTP ${response.status}`);
          return response.json() as Promise<{ articles: NewsArticle[] }>;
        }).then((result) => result.articles)
      : fetchAllNews(NEWS_SOURCES).then((result) => result.articles);

    load
      .then((articles) => {
        if (active) setNews(balanceNewsForEditorial(articles, 6));
      })
      .finally(() => {
        if (active) setLoadingNews(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const featuredCareers = ENGINEERING_BRANCHES.filter((branch) =>
    [
      'ingenieria-civil',
      'ingenieria-electronica',
      'ingenieria-mecanica',
      'ingenieria-informatica',
    ].includes(branch.slug)
  );

  const featuredInstitutions = INSTITUTIONS.filter(
    (institution) =>
      institution.country === 'Argentina' ||
      institution.country === 'Argentina / Global'
  ).filter((institution) =>
    ['conicet', 'nasa', 'esa', 'invap', 'inti', 'cnea', 'arsat', 'nexciencia', 'fiuba', 'conae', 'y-tec', 'satellogic'].includes(institution.slug)
  );

  return (
    <PageContainer>
      <View style={styles.masthead}>
        <View>
          <Text style={styles.edition}>Edición digital · Argentina</Text>
          <Text style={styles.title}>Ingeniería, ciencia y tecnología</Text>
        </View>
        <Link href="/actualidad" asChild>
          <Pressable style={styles.actualidadButton}>
            <Text style={styles.actualidadButtonText}>Ir a Actualidad</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.white} />
          </Pressable>
        </Link>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionLabel}>Noticias recientes</Text>
          <Text style={styles.sectionTitle}>Últimas novedades oficiales</Text>
        </View>
      </View>

      {loadingNews ? (
        <View style={styles.newsLoading}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Actualizando noticias oficiales</Text>
        </View>
      ) : news.length > 0 ? (
        <>
          <View style={[styles.newsGrid, isDesktop ? styles.grid3 : isTablet ? styles.grid2 : styles.grid1]}>
            {news.map((article) => (
              <NewsCard key={article.id} article={article} variant="vertical" />
            ))}
          </View>
          <Link href="/actualidad" asChild>
            <Pressable style={styles.viewAllButton}>
              <Text style={styles.viewAllButtonText}>VER TODAS LAS NOTICIAS</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.white} />
            </Pressable>
          </Link>
        </>
      ) : (
        <View style={styles.newsEmpty}>
          <Text style={styles.emptyTitle}>PRÓXIMAMENTE NOTICIAS</Text>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionLabel}>Ingenierías</Text>
          <Text style={styles.sectionTitle}>Carreras de grado de la UBA</Text>
        </View>
      </View>

      <View style={[styles.careersGrid, isDesktop ? styles.careers3 : isTablet ? styles.careers2 : styles.grid1]}>
        {featuredCareers.slice(0, 4).map((branch) => (
          <CategoryCard key={branch.slug} branch={branch} />
        ))}
      </View>
      <Link href="/ingenierias" asChild>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>VER TODAS LAS CARRERAS</Text>
          <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
        </Pressable>
      </Link>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionLabel}>Organismos e instituciones</Text>
          <Text style={styles.sectionTitle}>Fuentes oficiales</Text>
        </View>
      </View>
      <InstitutionLogoStrip institutions={featuredInstitutions} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  masthead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 12,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primaryDark,
    paddingBottom: SPACING.md,
    marginBottom: SPACING.lg,
  },
  edition: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    color: COLORS.primaryDark,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '900',
    letterSpacing: -1,
  },
  actualidadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actualidadButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    borderTopWidth: 2,
    borderTopColor: COLORS.primaryDark,
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  sectionTitle: {
    color: COLORS.primaryDark,
    fontSize: 24,
    fontWeight: '900',
  },
  newsLoading: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 8,
  },
  newsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  careersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  grid1: {
    flexDirection: 'column',
  },
  grid2: {},
  grid3: {},
  careers2: {
    flexDirection: 'row',
  },
  careers3: {
    flexDirection: 'row',
  },
  viewAllButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  viewAllButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  secondaryButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginBottom: SPACING.xl,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  newsEmpty: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    color: COLORS.primaryDark,
    fontSize: 18,
    fontWeight: '800',
  },
});
