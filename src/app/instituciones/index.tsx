import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { PageContainer } from '@/components/PageContainer';
import { InstitutionCard } from '@/components/InstitutionCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar, FilterOption } from '@/components/FilterBar';
import { SectionTitle } from '@/components/SectionTitle';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { INSTITUTIONS } from '@/data/institutions';

export default function InstitucionesScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');

  const typeOptions: FilterOption[] = [
    { id: 'todos', label: 'Todos los organismos', count: INSTITUTIONS.length },
    {
      id: 'empresa',
      label: 'Empresas Tecnológicas',
      count: INSTITUTIONS.filter((i) => i.type === 'empresa').length,
    },
    {
      id: 'gobierno',
      label: 'Agencias Estatales',
      count: INSTITUTIONS.filter((i) => i.type === 'gobierno').length,
    },
    {
      id: 'investigacion',
      label: 'Institutos de Investigación',
      count: INSTITUTIONS.filter((i) => i.type === 'investigacion').length,
    },
    {
      id: 'consorcio',
      label: 'Consorcios Mixtos',
      count: INSTITUTIONS.filter((i) => i.type === 'consorcio').length,
    },
  ];

  const filteredInstitutions = useMemo(() => {
    return INSTITUTIONS.filter((inst) => {
      // Type filter
      if (selectedType !== 'todos' && inst.type !== selectedType) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = inst.name.toLowerCase().includes(q);
        const inAcronym = inst.acronym.toLowerCase().includes(q);
        const inCity = inst.city.toLowerCase().includes(q);
        const inFocus = inst.focusAreas.some((fa) => fa.toLowerCase().includes(q));
        const inProjects = inst.flagshipProjects.some((fp) => fp.toLowerCase().includes(q));
        if (!inName && !inAcronym && !inCity && !inFocus && !inProjects) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedType]);

  return (
    <PageContainer>
      {/* Header Banner */}
      <View style={styles.headerHero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ECOSISTEMA CIENTÍFICO-TECNOLÓGICO</Text>
        </View>
        <Text style={styles.title}>Instituciones y Centros de I+D</Text>
        <Text style={styles.subtitle}>
          Directorio especializado de laboratorios, empresas de base tecnológica, institutos
          y agencias estatales que lideran la ingeniería aplicada y la innovación en Argentina y el mundo.
        </Text>

        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por nombre, sigla (INVAP, CNEA, Y-TEC) o área de especialidad..."
          />
        </View>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Tipo de entidad:</Text>
        <FilterBar options={typeOptions} selectedId={selectedType} onSelect={setSelectedType} />
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <SectionTitle
          title={`Organizaciones Registradas (${filteredInstitutions.length})`}
          subtitle={
            searchQuery
              ? `Resultados para "${searchQuery}"`
              : 'Directorio verificado de entidades tecnológicas'
          }
        />
      </View>

      {/* Institutions Grid */}
      <View style={[styles.grid, isDesktop ? styles.grid2Cols : styles.grid1Col]}>
        {filteredInstitutions.map((inst) => (
          <InstitutionCard key={inst.slug} institution={inst} />
        ))}
      </View>

      {filteredInstitutions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No se encontraron instituciones</Text>
          <Text style={styles.emptyText}>
            Intentá modificar la búsqueda o seleccionar otro tipo de organización.
          </Text>
          <Pressable
            style={styles.resetButton}
            onPress={() => {
              setSearchQuery('');
              setSelectedType('todos');
            }}
          >
            <Text style={styles.resetButtonText}>Ver todas las instituciones</Text>
          </Pressable>
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
    marginBottom: SPACING.lg,
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
  filterSection: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    gap: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    marginBottom: 14,
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
  },
  resetButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
