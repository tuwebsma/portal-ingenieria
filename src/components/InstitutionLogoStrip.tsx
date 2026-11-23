import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Institution } from '@/types';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

interface InstitutionLogoStripProps {
  institutions: Institution[];
}

export const InstitutionLogoStrip: React.FC<InstitutionLogoStripProps> = ({ institutions }) => {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <View style={styles.strip}>
      {institutions.map((institution) => (
        <View key={institution.slug} style={styles.item}>
          <Link href={`/instituciones/${institution.slug}` as any} asChild>
            <Pressable
              style={styles.logoButton}
              accessibilityLabel={`Ver institución ${institution.name}`}
              onHoverIn={() => setActiveSlug(institution.slug)}
              onHoverOut={() => setActiveSlug(null)}
              onPressIn={() => setActiveSlug(institution.slug)}
            >
              {institution.logoUrl ? (
                <Image
                  source={{ uri: institution.logoUrl }}
                  style={styles.logo}
                  contentFit="contain"
                />
              ) : (
                <View style={styles.initials}>
                  <Text style={styles.initialsText}>{institution.acronym}</Text>
                </View>
              )}
              <Text style={styles.name} numberOfLines={1}>
                {institution.acronym}
              </Text>
            </Pressable>
          </Link>

          {activeSlug === institution.slug && (
            <View style={styles.tooltip} pointerEvents="none">
              <Text style={styles.tooltipName}>{institution.name}</Text>
              <Text style={styles.tooltipDescription} numberOfLines={2}>
                {institution.description}
              </Text>
              {institution.country ? (
                <Text style={styles.tooltipCountry}>{institution.country}</Text>
              ) : null}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.white,
    borderTopWidth: 2,
    borderBottomWidth: 1,
    borderTopColor: COLORS.primaryDark,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.sm,
  },
  item: {
    position: 'relative',
    width: 132,
  },
  logoButton: {
    minHeight: 86,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: RADIUS.md,
    paddingHorizontal: 8,
  },
  logo: {
    width: 96,
    height: 48,
  },
  initials: {
    width: 96,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
  },
  initialsText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  name: {
    maxWidth: 116,
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '800',
  },
  tooltip: {
    position: 'absolute',
    zIndex: 20,
    left: 8,
    bottom: 92,
    width: 220,
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.md,
    padding: 10,
  },
  tooltipName: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  tooltipDescription: {
    color: '#E9D5FF',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  tooltipCountry: {
    color: '#C4B5FD',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
});
