import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import { PageContainer } from '@/components/PageContainer';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { INSTITUTIONS } from '@/data/institutions';
import { openExternalLink } from '@/lib/utils';
import { Image } from 'expo-image';
import { NewsCard } from '@/components/NewsCard';
import { NEWS_SOURCES } from '@/data/news-sources';
import { fetchAllNews } from '@/lib/newsIntegration';
import { NewsArticle } from '@/types';

export default function InstitutionDetailPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;
  const institution = INSTITUTIONS.find((item) => item.slug === slug);
  const [institutionNews, setInstitutionNews] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    let active = true;

    const load = Platform.OS === 'web'
      ? fetch('/api/news', { headers: { Accept: 'application/json' } }).then(async (response) => {
          if (!response.ok) throw new Error(`Noticias: respuesta HTTP ${response.status}`);
          return response.json() as Promise<{ articles: NewsArticle[] }>;
        }).then((result) => result.articles)
      : fetchAllNews(NEWS_SOURCES).then((result) => result.articles);

    load
      .then((articles) => {
        if (!active || !institution) return;
        setInstitutionNews(
          articles
            .filter((article) => {
              const source = NEWS_SOURCES.find((item) => item.shortName === article.sourceName);
              return source?.id === institution.id || article.sourceName === institution.acronym;
            })
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        );
      })
      .finally(() => {
        if (active) setLoadingNews(false);
      });

    return () => {
      active = false;
    };
  }, [institution]);

  if (!institution) {
    return (
      <PageContainer>
        <View style={styles.notFound}>
          <Text style={styles.title}>Institución no encontrada</Text>
          <Link href="/instituciones" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Volver al directorio</Text>
            </Pressable>
          </Link>
        </View>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <View style={styles.header}>
        {institution.logoUrl ? (
          <Image source={{ uri: institution.logoUrl }} style={styles.logo} contentFit="contain" />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoPlaceholderText}>{institution.acronym}</Text>
          </View>
        )}
        <Text style={styles.kicker}>{institution.acronym}</Text>
        <Text style={styles.title}>{institution.name}</Text>
        <Text style={styles.location}>{institution.country} · {institution.city}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.descriptionBlock}>
          <Text style={styles.sectionTitle}>Información general</Text>
          <Text style={styles.description}>{institution.description}</Text>
        </View>

        <View style={styles.sideBlock}>
          <Text style={styles.sectionTitle}>Ficha institucional</Text>
          <Text style={styles.fieldLabel}>Categoría</Text>
          <Text style={styles.fieldValue}>{institution.typeName}</Text>
          {institution.establishedYear ? (
            <>
              <Text style={styles.fieldLabel}>Fundación</Text>
              <Text style={styles.fieldValue}>{institution.establishedYear}</Text>
            </>
          ) : null}
          <Pressable
            style={styles.primaryButton}
            onPress={() => openExternalLink(institution.websiteUrl)}
          >
            <Text style={styles.primaryButtonText}>Sitio oficial</Text>
            <Ionicons name="open-outline" size={14} color={COLORS.white} />
          </Pressable>
        </View>
      </View>

      <View style={styles.related}>
        <Text style={styles.sectionTitle}>Últimas 6 noticias</Text>
        {loadingNews ? (
          <View style={styles.newsStatus}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : institutionNews.length > 0 ? (
          <>
            <View style={[styles.newsGrid, isDesktop ? styles.grid3 : isTablet ? styles.grid2 : styles.grid1]}>
              {institutionNews.slice(0, 6).map((article) => (
                <NewsCard key={article.id} article={article} variant="vertical" />
              ))}
            </View>
            {institutionNews.length > 6 && (
              <Link href={`/instituciones/${institution.slug}/noticias` as any} asChild>
                <Pressable style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>VER TODAS LAS NOTICIAS DE ESTA INSTITUCIÓN</Text>
                  <Ionicons name="arrow-forward" size={14} color={COLORS.white} />
                </Pressable>
              </Link>
            )}
          </>
        ) : (
          <Text style={styles.relatedEmpty}>PRÓXIMAMENTE NOTICIAS</Text>
        )}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 180,
    height: 72,
    marginBottom: 12,
  },
  logoPlaceholder: {
    width: 180,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
    marginBottom: 12,
  },
  logoPlaceholderText: {
    color: COLORS.primaryDark,
    fontSize: 16,
    fontWeight: '900',
  },
  header: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primaryDark,
    paddingBottom: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    color: COLORS.primaryDark,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
  },
  location: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 6,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
  },
  descriptionBlock: {
    flexGrow: 2,
    flexBasis: 460,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  sideBlock: {
    flexGrow: 1,
    flexBasis: 260,
    backgroundColor: COLORS.white,
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.primaryDark,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  description: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 24,
  },
  fieldLabel: {
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 8,
  },
  fieldValue: {
    color: COLORS.text,
    fontSize: 14,
    marginTop: 2,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  related: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  relatedEmpty: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  newsStatus: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  grid1: {
    flexDirection: 'column',
  },
  grid2: {},
  grid3: {},
  notFound: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
  },
});
