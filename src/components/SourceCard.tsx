import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '@/constants/theme';
import { Publication } from '@/types';
import { openExternalLink } from '@/lib/utils';

interface SourceCardProps {
  publication: Publication;
}

export const SourceCard: React.FC<SourceCardProps> = ({ publication }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {publication.coverImage ? (
          <Image source={{ uri: publication.coverImage }} style={styles.coverImage} contentFit="cover" />
        ) : (
          <View style={styles.placeholderCover}>
            <Ionicons name="book-outline" size={24} color={COLORS.primary} />
          </View>
        )}
        <View style={styles.headerInfo}>
          <View style={styles.badgesRow}>
            {publication.openAccess && (
              <View style={styles.openAccessBadge}>
                <Ionicons name="lock-open" size={10} color="#059669" />
                <Text style={styles.openAccessText}>OPEN ACCESS</Text>
              </View>
            )}
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{publication.type.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {publication.title}
          </Text>
          <Text style={styles.publisher} numberOfLines={1}>
            {publication.publisher}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {publication.description}
      </Text>

      <View style={styles.tagsRow}>
        {publication.tags.map((tag, idx) => (
          <View key={idx} style={styles.tagChip}>
            <Text style={styles.tagChipText}>#{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {publication.frequency} • {publication.language}
          </Text>
          {publication.issnOrDoi && (
            <Text style={styles.doiText}>{publication.issnOrDoi}</Text>
          )}
        </View>
        <Pressable
          style={styles.accessButton}
          onPress={() => openExternalLink(publication.linkUrl)}
          accessibilityLabel={`Acceder a ${publication.title}`}
        >
          <Text style={styles.accessButtonText}>Consultar</Text>
          <Ionicons name="open-outline" size={14} color={COLORS.white} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  coverImage: {
    width: 60,
    height: 75,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
  },
  placeholderCover: {
    width: 60,
    height: 75,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
    alignItems: 'center',
  },
  openAccessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  openAccessText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
  },
  typeBadge: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
    lineHeight: 19,
    marginBottom: 2,
  },
  publisher: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  description: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tagChip: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  tagChipText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  metaRow: {
    flex: 1,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  doiText: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 2,
  },
  accessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
  },
  accessButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
});
