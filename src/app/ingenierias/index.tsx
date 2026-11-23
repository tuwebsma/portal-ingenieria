import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { PageContainer } from '@/components/PageContainer';
import { CategoryCard } from '@/components/CategoryCard';
import { SearchBar } from '@/components/SearchBar';
import { SectionTitle } from '@/components/SectionTitle';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { ENGINEERING_BRANCHES } from '@/data/engineering';

export default function IngenieriasScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;

  const [searchQuery, setSearchQuery] = useState('');

  const filteredBranches = useMemo(() => {
    if (!searchQuery.trim()) return ENGINEERING_BRANCHES;
    const q = searchQuery.toLowerCase().trim();
    return ENGINEERING_BRANCHES.filter((branch) => {
      const matchName = branch.name.toLowerCase().includes(q);
      const matchDesc = branch.shortDescription.toLowerCase().includes(q);
      const matchAreas = branch.keyAreas.some((area) => area.toLowerCase().includes(q));
      const matchTech = branch.technologies.some((tech) => tech.toLowerCase().includes(q));
      return matchName || matchDesc || matchAreas || matchTech;
    });
  }, [searchQuery]);

  return (
    <PageContainer>
      {/* Header Banner */}
      <View style={styles.headerHero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>DIRECTORIO ESPECIALIZADO</Text>
        </View>
        <Text style={styles.title}>Ramas de la Ingeniería</Text>
        <Text style={styles.subtitle}>
          Explorá las principales disciplinas científicas y técnicas, sus campos de aplicación,
          los desarrollos industriales en curso y los proyectos emblemáticos nacionales e internacionales.
        </Text>

        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por especialidad, tecnología (ej: satélites, reactores, IA, litio)..."
          />
        </View>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <SectionTitle
          title={`Especialidades (${filteredBranches.length})`}
          subtitle={
            searchQuery
              ? `Resultados para "${searchQuery}"`
              : 'Directorio completo de disciplinas de la ingeniería moderna'
          }
        />
      </View>

      {/* Branches Grid */}
      <View style={[styles.grid, isDesktop ? styles.grid3Cols : isTablet ? styles.grid2Cols : styles.grid1Col]}>
        {filteredBranches.map((branch) => (
          <CategoryCard key={branch.slug} branch={branch} />
        ))}
      </View>

      {filteredBranches.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No se encontraron especialidades</Text>
          <Text style={styles.emptyText}>
            Probá buscando con otros términos como "nuclear", "materiales", "robótica" o "química".
          </Text>
        </View>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  headerHero: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  badge: {
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    lineHeight: 22,
    marginBottom: SPACING.lg,
    maxWidth: 720,
  },
  searchWrapper: {
    maxWidth: 600,
  },
  resultsHeader: {
    marginBottom: SPACING.md,
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
  emptyState: {
    backgroundColor: COLORS.white,
    padding: SPACING.xxl,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
