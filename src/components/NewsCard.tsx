import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '@/constants/theme';
import { NewsArticle } from '@/types';
import { formatDate } from '@/lib/utils';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'vertical' | 'horizontal' | 'compact';
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, variant = 'vertical' }) => {
  if (variant === 'compact') {
    return (
      <Link href={`/actualidad/${article.slug}` as any} asChild>
        <Pressable style={styles.compactCard}>
          <Image source={{ uri: article.imageUrl }} style={styles.compactImage} contentFit="cover" />
          <View style={styles.compactContent}>
            <View style={styles.tagRow}>
              <Text style={styles.categoryBadgeText}>{article.categoryName}</Text>
            </View>
            <Text style={styles.compactTitle} numberOfLines={2}>
              {article.title}
            </Text>
            <Text style={styles.metaText}>{formatDate(article.date)}</Text>
          </View>
        </Pressable>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/actualidad/${article.slug}` as any} asChild>
        <Pressable style={styles.horizontalCard}>
          <Image source={{ uri: article.imageUrl }} style={styles.horizontalImage} contentFit="cover" />
          <View style={styles.horizontalContent}>
            <View style={styles.metaHeader}>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>{article.categoryName}</Text>
              </View>
              <View style={styles.locationBadge}>
                <Ionicons name="location-outline" size={12} color={COLORS.textMuted} />
                <Text style={styles.locationText}>{article.location}</Text>
              </View>
            </View>
            <Text style={styles.horizontalTitle} numberOfLines={2}>
              {article.title}
            </Text>
            <Text style={styles.horizontalSubtitle} numberOfLines={2}>
              {article.subtitle}
            </Text>
            <View style={styles.metaFooter}>
              <Text style={styles.authorText}>Por {article.author}</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.dateText}>{formatDate(article.date)}</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.readTimeText}>{article.readTime}</Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );
  }

  // Default: Vertical Card
  return (
    <Link href={`/actualidad/${article.slug}` as any} asChild>
      <Pressable style={styles.verticalCard}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: article.imageUrl }} style={styles.verticalImage} contentFit="cover" />
          <View style={styles.categoryOverlay}>
            <Text style={styles.categoryOverlayText}>{article.categoryName}</Text>
          </View>
        </View>

        <View style={styles.verticalContent}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={COLORS.primary} />
            <Text style={styles.locationHighlight}>{article.location}</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.readTimeText}>{article.readTime}</Text>
          </View>

          <Text style={styles.verticalTitle} numberOfLines={3}>
            {article.title}
          </Text>

          <Text style={styles.verticalSubtitle} numberOfLines={3}>
            {article.subtitle}
          </Text>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.authorName}>{article.author}</Text>
              <Text style={styles.dateText}>{formatDate(article.date)}</Text>
            </View>
            <View style={styles.readMoreArrow}>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  // Vertical card
  verticalCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  imageWrapper: {
    width: '100%',
    height: 190,
    position: 'relative',
    backgroundColor: COLORS.surfaceAlt,
  },
  verticalImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(56, 32, 94, 0.9)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
  },
  categoryOverlayText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  verticalContent: {
    padding: SPACING.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationHighlight: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  verticalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
    lineHeight: 22,
    marginBottom: 8,
  },
  verticalSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  readMoreArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Horizontal card
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  horizontalImage: {
    width: 220,
    height: '100%',
    minHeight: 160,
  },
  horizontalContent: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  metaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  categoryPill: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  categoryPillText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  horizontalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primaryDark,
    lineHeight: 22,
    marginBottom: 6,
  },
  horizontalSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 10,
  },
  metaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  dotSeparator: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  readTimeText: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  // Compact card
  compactCard: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  compactImage: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.md,
  },
  compactContent: {
    flex: 1,
  },
  tagRow: {
    marginBottom: 4,
  },
  categoryBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  compactTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 17,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
});
