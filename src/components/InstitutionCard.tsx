import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '@/constants/theme';
import { Institution } from '@/types';
import { openExternalLink } from '@/lib/utils';

interface InstitutionCardProps {
  institution: Institution;
}

export const InstitutionCard: React.FC<InstitutionCardProps> = ({ institution }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {institution.logoUrl ? (
          <Image source={{ uri: institution.logoUrl }} style={styles.logoImage} contentFit="cover" />
        ) : (
          <View style={styles.acronymBox}>
            <Text style={styles.acronymText}>{institution.acronym.slice(0, 3)}</Text>
          </View>
        )}
        <View style={styles.titleInfo}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{institution.typeName}</Text>
          </View>
          <Text style={styles.name}>{institution.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={COLORS.primary} />
            <Text style={styles.locationText}>{institution.city}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {institution.description}
      </Text>

      {/* Focus areas pills */}
      <View style={styles.focusContainer}>
        <Text style={styles.sectionLabel}>Áreas de especialidad:</Text>
        <View style={styles.focusPillsRow}>
          {institution.focusAreas.slice(0, 3).map((area, idx) => (
            <View key={idx} style={styles.focusPill}>
              <Text style={styles.focusPillText}>{area}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Flagship projects */}
      {institution.flagshipProjects.length > 0 && (
        <View style={styles.projectsBox}>
          <Text style={styles.projectsTitle}>Hitos & Proyectos:</Text>
          <Text style={styles.projectsList} numberOfLines={2}>
            {institution.flagshipProjects.join(' • ')}
          </Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.cardFooter}>
        <Text style={styles.establishedYear}>Fundado en {institution.establishedYear}</Text>
        <Link href={`/instituciones/${institution.slug}` as any} asChild>
          <Pressable style={styles.profileButton}>
            <Text style={styles.profileButtonText}>Ver ficha</Text>
          </Pressable>
        </Link>
        <Pressable
          style={styles.websiteButton}
          onPress={() => openExternalLink(institution.websiteUrl)}
          accessibilityLabel={`Visitar sitio oficial de ${institution.name}`}
        >
          <Text style={styles.websiteButtonText}>Sitio oficial</Text>
          <Ionicons name="open-outline" size={14} color={COLORS.primary} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: 360,
    maxWidth: 580,
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
    marginBottom: 12,
  },
  logoImage: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
  },
  acronymBox: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acronymText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  titleInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  typeBadge: {
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  typeBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
    lineHeight: 20,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  description: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 19,
    marginBottom: 12,
  },
  focusContainer: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  focusPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  focusPill: {
    backgroundColor: COLORS.surfaceAlt,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  focusPillText: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '500',
  },
  projectsBox: {
    backgroundColor: COLORS.primarySoft,
    padding: 10,
    borderRadius: RADIUS.md,
    marginBottom: 12,
  },
  projectsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  projectsList: {
    fontSize: 11,
    color: COLORS.primaryDark,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  establishedYear: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surfaceAlt,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  websiteButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  profileButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  profileButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});
