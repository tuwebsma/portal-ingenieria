import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import { PageContainer } from '@/components/PageContainer';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { INSTITUTIONS } from '@/data/institutions';
import { openExternalLink } from '@/lib/utils';

export default function InstitutionDetailPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const institution = INSTITUTIONS.find((item) => item.slug === slug);

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
        <Text style={styles.sectionTitle}>Publicaciones relacionadas</Text>
        <Text style={styles.relatedEmpty}>Todavía no hay publicaciones incorporadas.</Text>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
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
  notFound: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
  },
});
