import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { PageContainer } from '@/components/PageContainer';
import { NewsCard } from '@/components/NewsCard';
import { SectionTitle } from '@/components/SectionTitle';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { NEWS_ARTICLES } from '@/data/news';
import { formatDate } from '@/lib/utils';

export default function ArticleDetailPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;

  const article = NEWS_ARTICLES.find((a) => a.slug === slug) || NEWS_ARTICLES[0];

  // Related news
  const relatedNews = NEWS_ARTICLES.filter(
    (a) => a.id !== article.id && (a.category === article.category || a.engineeringBranch === article.engineeringBranch)
  ).slice(0, 3);

  return (
    <PageContainer>
      {/* Navigation Breadcrumb */}
      <View style={styles.breadcrumbRow}>
        <Link href="/" asChild>
          <Pressable style={styles.breadcrumbLink}>
            <Text style={styles.breadcrumbText}>Inicio</Text>
          </Pressable>
        </Link>
        <Ionicons name="chevron-forward" size={12} color={COLORS.textLight} />
        <Link href="/actualidad" asChild>
          <Pressable style={styles.breadcrumbLink}>
            <Text style={styles.breadcrumbText}>Actualidad</Text>
          </Pressable>
        </Link>
        <Ionicons name="chevron-forward" size={12} color={COLORS.textLight} />
        <Text style={styles.breadcrumbCurrent} numberOfLines={1}>{article.categoryName}</Text>
      </View>

      {/* Main Article Container */}
      <View style={styles.articleCard}>
        {/* Header Metadata */}
        <View style={styles.metaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{article.categoryName}</Text>
          </View>
          <View style={styles.locationPill}>
            <Ionicons name="location-outline" size={12} color={COLORS.primary} />
            <Text style={styles.locationText}>{article.location}</Text>
          </View>
          <Text style={styles.metaDivider}>•</Text>
          <Text style={styles.readTimeText}>{article.readTime}</Text>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.headline}>{article.title}</Text>
        <Text style={styles.leadSubtitle}>{article.subtitle}</Text>

        {/* Author & Publication Details */}
        <View style={styles.authorBar}>
          <View style={styles.authorInfo}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorInitials}>
                {article.author
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </Text>
            </View>
            <View>
              <Text style={styles.authorName}>{article.author}</Text>
              <Text style={styles.dateInfo}>
                {formatDate(article.date)} • Fuente: {article.source}
              </Text>
            </View>
          </View>

          <View style={styles.branchTag}>
            <Ionicons name="hardware-chip-outline" size={14} color={COLORS.primary} />
            <Text style={styles.branchTagText}>{article.engineeringBranch}</Text>
          </View>
        </View>

        {/* Main Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: article.imageUrl }} style={styles.articleImage} contentFit="cover" />
          <View style={styles.captionBar}>
            <Text style={styles.captionText}>
              Fotografía e informe técnico: {article.source} — {article.categoryName}
            </Text>
          </View>
        </View>

        {/* Key Takeaways Box */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <View style={styles.takeawaysCard}>
            <View style={styles.takeawaysHeader}>
              <Ionicons name="bookmark" size={18} color={COLORS.primary} />
              <Text style={styles.takeawaysTitle}>Puntos Clave del Informe</Text>
            </View>
            <View style={styles.takeawaysList}>
              {article.keyTakeaways.map((item, idx) => (
                <View key={idx} style={styles.takeawayRow}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                  <Text style={styles.takeawayText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Article Body Content */}
        <View style={styles.bodyContent}>
          {article.content.map((paragraph, index) => (
            <Text key={index} style={styles.bodyParagraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        {/* Blockquote if available */}
        {article.quote && (
          <View style={styles.quoteBox}>
            <Ionicons name="chatbubble-ellipses-outline" size={28} color={COLORS.primaryLight} style={styles.quoteIcon} />
            <Text style={styles.quoteText}>"{article.quote.text}"</Text>
            <Text style={styles.quoteAuthor}>
              — {article.quote.author}, <Text style={styles.quoteRole}>{article.quote.role}</Text>
            </Text>
          </View>
        )}

        {/* Tag List */}
        <View style={styles.tagsContainer}>
          <Text style={styles.tagsLabel}>Etiquetas:</Text>
          <View style={styles.tagsList}>
            {article.tags.map((tag, idx) => (
              <View key={idx} style={styles.tagPill}>
                <Text style={styles.tagPillText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <View style={styles.relatedSection}>
          <SectionTitle
            title="Investigaciones y Noticias Relacionadas"
            subtitle="Otros desarrollos técnicos vinculados a este campo"
            viewAllLink="/actualidad"
          />
          <View style={[styles.grid, isDesktop ? styles.grid3Cols : isTablet ? styles.grid2Cols : styles.grid1Col]}>
            {relatedNews.map((rel) => (
              <NewsCard key={rel.id} article={rel} variant="vertical" />
            ))}
          </View>
        </View>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
  },
  breadcrumbLink: {
    paddingVertical: 2,
  },
  breadcrumbText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  breadcrumbCurrent: {
    fontSize: 13,
    color: COLORS.textMuted,
    maxWidth: 240,
  },
  articleCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  categoryBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  metaDivider: {
    color: COLORS.textLight,
  },
  readTimeText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  headline: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primaryDark,
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  leadSubtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  authorBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.lg,
    flexWrap: 'wrap',
    gap: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorInitials: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  dateInfo: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  branchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
  },
  branchTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  imageContainer: {
    width: '100%',
    height: 380,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.surfaceAlt,
  },
  articleImage: {
    width: '100%',
    height: '100%',
  },
  captionBar: {
    backgroundColor: 'rgba(25, 21, 34, 0.75)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  captionText: {
    color: COLORS.white,
    fontSize: 11,
  },
  takeawaysCard: {
    backgroundColor: COLORS.primarySoft,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xl,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  takeawaysHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  takeawaysTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  takeawaysList: {
    gap: 8,
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  takeawayText: {
    fontSize: 14,
    color: COLORS.primaryDark,
    lineHeight: 20,
    flex: 1,
  },
  bodyContent: {
    marginBottom: SPACING.xl,
  },
  bodyParagraph: {
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.text,
    marginBottom: 18,
  },
  quoteBox: {
    backgroundColor: COLORS.surfaceAlt,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    marginBottom: SPACING.xl,
  },
  quoteIcon: {
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.primaryDark,
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  quoteRole: {
    fontWeight: '400',
    color: COLORS.textMuted,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    flexWrap: 'wrap',
  },
  tagsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    backgroundColor: COLORS.surfaceAlt,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
  },
  tagPillText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  relatedSection: {
    marginTop: SPACING.lg,
  },
  grid: {
    display: 'flex',
    gap: SPACING.md,
  },
  grid1Col: {
    flexDirection: 'column',
  },
  grid2Cols: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  grid3Cols: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
