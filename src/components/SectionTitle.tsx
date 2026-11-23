import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  badge?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'Ver todo',
  badge,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge.toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.titleRow}>
          <View style={styles.verticalBar} />
          <Text style={styles.title}>{title}</Text>
        </View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {viewAllLink && (
        <Link href={viewAllLink as any} asChild>
          <Pressable style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>{viewAllText}</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
          </Pressable>
        </Link>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
    gap: 8,
  },
  leftContainer: {
    flex: 1,
    minWidth: 260,
  },
  badge: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verticalBar: {
    width: 4,
    height: 22,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    marginLeft: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primarySoft,
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
