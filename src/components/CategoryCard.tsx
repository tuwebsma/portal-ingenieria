import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '@/constants/theme';
import { EngineeringBranch } from '@/types';

interface CategoryCardProps {
  branch: EngineeringBranch;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ branch }) => {
  return (
    <Link href={`/ingenierias/${branch.slug}` as any} asChild>
      <Pressable style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: branch.bannerImage }} style={styles.bannerImage} contentFit="cover" />
          <View style={styles.iconCircle}>
            <Ionicons name={branch.icon as any} size={22} color={COLORS.white} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{branch.name}</Text>
          <Text style={styles.description} numberOfLines={3}>
            {branch.shortDescription}
          </Text>

          <View style={styles.areasRow}>
            {branch.keyAreas.slice(0, 2).map((area, idx) => (
              <View key={idx} style={styles.areaChip}>
                <Text style={styles.areaChipText} numberOfLines={1}>
                  {area}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.projectsCount}>
              {branch.flagshipProjects.length} proyectos emblemáticos
            </Text>
            <View style={styles.exploreLink}>
              <Text style={styles.exploreText}>Explorar rama</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  imageContainer: {
    height: 120,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.surfaceAlt,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  iconCircle: {
    position: 'absolute',
    bottom: -18,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    ...SHADOWS.card,
  },
  content: {
    padding: SPACING.md,
    paddingTop: SPACING.lg,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  areasRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  areaChip: {
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    maxWidth: '100%',
  },
  areaChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  projectsCount: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  exploreLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exploreText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
