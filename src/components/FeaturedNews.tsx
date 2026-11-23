import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { formatDate, openExternalLink } from '@/lib/utils';
import { NewsArticle } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

interface FeaturedNewsProps {
  article: NewsArticle;
}

export const FeaturedNews: React.FC<FeaturedNewsProps> = ({ article }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;

  return (
    <Pressable onPress={() => openExternalLink(article.originalUrl)}>
      <View style={[styles.heroCard, isDesktop ? styles.heroCardRow : styles.heroCardCol]}>
        <View style={isDesktop ? styles.imageColumn : styles.imageFull}>
          {article.imageUrl ? (
            <Image source={{ uri: article.imageUrl }} style={styles.image} contentFit="cover" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="newspaper-outline" size={38} color={COLORS.primary} />
            </View>
          )}
          <View style={styles.badgeOverlay}>
            <View style={styles.liveDot} />
            <Text style={styles.badgeOverlayText}>NOTICIA DE PORTADA</Text>
          </View>
        </View>

        <View style={isDesktop ? styles.contentColumn : styles.contentFull}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{article.categoryName}</Text>
            </View>
            <View style={styles.locationPill}>
              <Ionicons name="globe-outline" size={12} color={COLORS.primary} />
              <Text style={styles.locationText}>{article.sourceName}</Text>
            </View>
          </View>

          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.subtitle}>{article.summary}</Text>

          <View style={styles.authorMeta}>
            <View>
              <Text style={styles.authorName}>{article.sourceName}</Text>
              <Text style={styles.dateText}>
                {formatDate(article.publishedAt)}
              </Text>
            </View>
            <View style={styles.readCta}>
              <Text style={styles.readCtaText}>Leer artículo completo</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primarySoft,
  },
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    ...SHADOWS.cardHover,
  },
  heroCardRow: {
    flexDirection: 'row',
  },
  heroCardCol: {
    flexDirection: 'column',
  },
  imageColumn: {
    flex: 1.2,
    minHeight: 400,
    position: 'relative',
    backgroundColor: COLORS.surfaceAlt,
  },
  imageFull: {
    width: '100%',
    height: 260,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(25, 21, 34, 0.88)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  badgeOverlayText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  contentColumn: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  contentFull: {
    padding: SPACING.lg,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
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
  readTimeText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primaryDark,
    lineHeight: 32,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    lineHeight: 22,
    marginBottom: 16,
  },
  takeawaysBox: {
    backgroundColor: COLORS.surfaceAlt,
    padding: 12,
    borderRadius: RADIUS.md,
    marginBottom: 18,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  takeawaysTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  takeawayText: {
    fontSize: 12,
    color: COLORS.text,
    flex: 1,
  },
  authorMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    flexWrap: 'wrap',
    gap: 10,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  readCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
  },
  readCtaText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
