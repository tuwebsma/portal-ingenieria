import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageContainer } from '@/components/PageContainer';
import { SourceCard } from '@/components/SourceCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar, FilterOption } from '@/components/FilterBar';
import { SectionTitle } from '@/components/SectionTitle';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { PUBLICATIONS } from '@/data/publications';

export default function PublicacionesScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [openAccessOnly, setOpenAccessOnly] = useState(false);

  const typeOptions: FilterOption[] = [
    { id: 'todos', label: 'Todos los formatos', count: PUBLICATIONS.length },
    {
      id: 'revista',
      label: 'Revistas Científicas',
      count: PUBLICATIONS.filter((p) => p.type === 'revista').length,
    },
    {
      id: 'paper',
      label: 'Artículos & Papers',
      count: PUBLICATIONS.filter((p) => p.type === 'paper').length,
    },
    {
      id: 'reporte',
      label: 'Reportes Técnicos',
      count: PUBLICATIONS.filter((p) => p.type === 'reporte').length,
    },
  ];

  const filteredPublications = useMemo(() => {
    return PUBLICATIONS.filter((pub) => {
      // Open Access filter
      if (openAccessOnly && !pub.openAccess) {
        return false;
      }
      // Type filter
      if (selectedType !== 'todos' && pub.type !== selectedType) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = pub.title.toLowerCase().includes(q);
        const inPublisher = pub.publisher.toLowerCase().includes(q);
        const inDesc = pub.description.toLowerCase().includes(q);
        const inTags = pub.tags.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inPublisher && !inDesc && !inTags) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedType, openAccessOnly]);

  return (
    <PageContainer>
      {/* Header Banner */}
      <View style={styles.headerHero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>BIBLIOGRAFÍA & DIVULGACIÓN TÉCNICA</Text>
        </View>
        <Text style={styles.title}>Revistas y Publicaciones Científicas</Text>
        <Text style={styles.subtitle}>
          Catálogo curado de publicaciones arbitradas, revistas técnicas especializadas, actas de congresos
          y reportes de acceso abierto para profundizar en los avances de la ingeniería.
        </Text>

        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por revista, temática (ej: IEEE, mecánica, materiales, IA)..."
          />
        </View>
      </View>

      {/* Filter Bar with Open Access Toggle */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeaderRow}>
          <Text style={styles.filterLabel}>Filtrar por tipo de publicación:</Text>

          <Pressable
            style={[styles.openAccessToggle, openAccessOnly && styles.openAccessToggleActive]}
            onPress={() => setOpenAccessOnly(!openAccessOnly)}
          >
            <Ionicons
              name={openAccessOnly ? 'checkbox' : 'square-outline'}
              size={18}
              color={openAccessOnly ? COLORS.primary : COLORS.textMuted}
            />
            <Text style={[styles.openAccessToggleText, openAccessOnly && styles.openAccessToggleTextActive]}>
              Solo Acceso Abierto (Open Access)
            </Text>
          </Pressable>
        </View>

        <FilterBar options={typeOptions} selectedId={selectedType} onSelect={setSelectedType} />
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <SectionTitle
          title={`Publicaciones Disponibles (${filteredPublications.length})`}
          subtitle={
            searchQuery
              ? `Resultados para "${searchQuery}"`
              : 'Directorio indexado de fuentes científicas'
          }
        />
      </View>

      {/* Publications Grid */}
      <View style={[styles.grid, isDesktop ? styles.grid3Cols : isTablet ? styles.grid2Cols : styles.grid1Col]}>
        {filteredPublications.map((pub) => (
          <SourceCard key={pub.slug} publication={pub} />
        ))}
      </View>

      {filteredPublications.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No se encontraron publicaciones</Text>
          <Text style={styles.emptyText}>
            Probá desmarcando el filtro de acceso abierto o buscando con términos más amplios.
          </Text>
          <Pressable
            style={styles.resetButton}
            onPress={() => {
              setSearchQuery('');
              setSelectedType('todos');
              setOpenAccessOnly(false);
            }}
          >
            <Text style={styles.resetButtonText}>Ver todas las publicaciones</Text>
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
    gap: 10,
  },
  filterHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  openAccessToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  openAccessToggleActive: {
    backgroundColor: COLORS.primarySoft,
  },
  openAccessToggleText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  openAccessToggleTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
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
