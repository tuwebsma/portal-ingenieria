import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { PageContainer } from '@/components/PageContainer';
import { CategoryCard } from '@/components/CategoryCard';
import { InstitutionCard } from '@/components/InstitutionCard';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { ENGINEERING_BRANCHES } from '@/data/engineering';
import { INSTITUTIONS } from '@/data/institutions';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  return (
    <PageContainer>
      <View style={styles.masthead}>
        <View>
          <Text style={styles.edition}>Edición digital · Argentina</Text>
          <Text style={styles.title}>Ingeniería, ciencia y tecnología</Text>
        </View>
        <Link href="/actualidad" asChild>
          <Pressable style={styles.actualidadButton}>
            <Text style={styles.actualidadButtonText}>Ir a Actualidad</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.white} />
          </Pressable>
        </Link>
      </View>

      <View style={styles.leadGrid}>
        <View style={styles.mainColumn}>
          <Text style={styles.sectionLabel}>Actualidad</Text>
          <View style={styles.emptyLead}>
            <View style={styles.emptyIcon}>
              <Ionicons name="newspaper-outline" size={34} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>Próxima edición editorial</Text>
            <Text style={styles.emptyText}>
              Todavía no hay publicaciones disponibles. Aquí se incorporarán vistas previas
              de fuentes oficiales, siempre con enlace a la nota original.
            </Text>
          </View>
        </View>

        <View style={styles.sideColumn}>
          <Text style={styles.sectionLabel}>Directorio académico</Text>
          <Text style={styles.sideTitle}>13 carreras de grado</Text>
          <Text style={styles.sideText}>
            Facultad de Ingeniería de la Universidad de Buenos Aires.
          </Text>
          <Link href="/ingenierias" asChild>
            <Pressable style={styles.textLink}>
              <Text style={styles.textLinkLabel}>Explorar carreras</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionLabel}>Ingenierías</Text>
          <Text style={styles.sectionTitle}>Carreras de grado de la UBA</Text>
        </View>
        <Link href="/ingenierias" asChild>
          <Pressable style={styles.textLink}>
            <Text style={styles.textLinkLabel}>Ver las 13 carreras</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
          </Pressable>
        </Link>
      </View>

      <View style={[styles.grid, isDesktop ? styles.grid3 : styles.grid1]}>
        {ENGINEERING_BRANCHES.slice(0, isDesktop ? 6 : 4).map((branch) => (
          <CategoryCard key={branch.slug} branch={branch} />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionLabel}>Instituciones</Text>
          <Text style={styles.sectionTitle}>Organismos y centros de I+D</Text>
        </View>
        <Link href="/instituciones" asChild>
          <Pressable style={styles.textLink}>
            <Text style={styles.textLinkLabel}>Ver directorio</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
          </Pressable>
        </Link>
      </View>

      <View style={[styles.grid, isDesktop ? styles.grid2 : styles.grid1]}>
        {INSTITUTIONS.slice(0, 4).map((institution) => (
          <InstitutionCard key={institution.slug} institution={institution} />
        ))}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  masthead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 12,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primaryDark,
    paddingBottom: SPACING.md,
    marginBottom: SPACING.lg,
  },
  edition: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    color: COLORS.primaryDark,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '900',
    letterSpacing: -1,
  },
  actualidadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actualidadButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  leadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  mainColumn: {
    flexGrow: 2,
    flexBasis: 480,
  },
  sideColumn: {
    flexGrow: 1,
    flexBasis: 260,
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
  },
  sectionLabel: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  emptyLead: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primarySoft,
    marginBottom: 12,
  },
  emptyTitle: {
    color: COLORS.primaryDark,
    fontSize: 20,
    fontWeight: '800',
  },
  emptyText: {
    maxWidth: 520,
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 6,
  },
  sideTitle: {
    color: COLORS.primaryDark,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
  },
  sideText: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  textLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  textLinkLabel: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    borderTopWidth: 2,
    borderTopColor: COLORS.primaryDark,
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.primaryDark,
    fontSize: 24,
    fontWeight: '900',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  grid1: {
  },
  grid2: {},
  grid3: {},
});
