import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { PageContainer } from '@/components/PageContainer';
import { NewsCard } from '@/components/NewsCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar, FilterOption } from '@/components/FilterBar';
import { SectionTitle } from '@/components/SectionTitle';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { NEWS_ARTICLES } from '@/data/news';
import { CATEGORIES } from '@/data/categories';

export default function ActualidadScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedLocation, setSelectedLocation] = useState<string>('todos');

  // Category filter options
  const categoryOptions: FilterOption[] = [
    { id: 'todos', label: 'Todas las áreas', count: NEWS_ARTICLES.length },
    ...CATEGORIES.map((cat) => ({
      id: cat.slug,
      label: cat.name,
      count: NEWS_ARTICLES.filter((a) => a.category === cat.slug).length,
    })),
  ];

  // Location filter options
  const locationOptions = [
    { id: 'todos', label: 'Todas las regiones' },
    { id: 'Argentina', label: 'Argentina' },
    { id: 'Internacional', label: 'Internacional' },
  ];

  // Filtered news calculation
  const filteredArticles = useMemo(() => {
    return NEWS_ARTICLES.filter((article) => {
      // Category filter
      if (selectedCategory !== 'todos' && article.category !== selectedCategory) {
        return false;
      }
      // Location filter
      if (selectedLocation !== 'todos' && !article.location.includes(selectedLocation)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = article.title.toLowerCase().includes(q);
        const inSubtitle = article.subtitle.toLowerCase().includes(q);
        const inAuthor = article.author.toLowerCase().includes(q);
        const inTags = article.tags.some((tag) => tag.toLowerCase().includes(q));
        const inBranch = article.engineeringBranch.toLowerCase().includes(q);
        if (!inTitle && !inSubtitle && !inAuthor && !inTags && !inBranch) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedLocation]);

  return (
    <PageContainer>
      {/* Header Banner */}
      <View style={styles.headerHero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>REVISTA DIGITAL & ACTUALIDAD</Text>
        </View>
        <Text style={styles.title}>Noticias, Ciencia y Tecnología</Text>
        <Text style={styles.subtitle}>
          Seguí los avances técnicos más trascendentes en energía nuclear, misiones espaciales,
          inteligencia artificial, biotecnología y grandes obras de infraestructura.
        </Text>

        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por titular, tecnología, institución (INVAP, CNEA, satélites, litio)..."
          />
        </View>
      </View>

      {/* Filter Bars */}
      <View style={styles.filterSection}>
        {/* Categories */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterGroupLabel}>Área temática:</Text>
          <FilterBar
            options={categoryOptions}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </View>

        {/* Location selector pills */}
        <View style={styles.locationSelectorRow}>
          <Text style={styles.filterGroupLabel}>Enfoque territorial:</Text>
          <View style={styles.locationPills}>
            {locationOptions.map((loc) => {
              const active = selectedLocation === loc.id;
              return (
                <Pressable
                  key={loc.id}
                  style={[styles.locationChip, active && styles.locationChipActive]}
                  onPress={() => setSelectedLocation(loc.id)}
                >
                  <Text style={[styles.locationChipText, active && styles.locationChipTextActive]}>
                    {loc.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      {/* Articles Grid */}
      <View style={styles.resultsHeader}>
        <SectionTitle
          title={`Artículos Publicados (${filteredArticles.length})`}
          subtitle={
            searchQuery
              ? `Resultados para "${searchQuery}"`
              : 'Cobertura editorial verificada de la ingeniería'
          }
        />
      </View>

      <View style={[styles.grid, isDesktop ? styles.grid3Cols : isTablet ? styles.grid2Cols : styles.grid1Col]}>
        {filteredArticles.map((article) => (
          <NewsCard key={article.id} article={article} variant="vertical" />
        ))}
      </View>

      {filteredArticles.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No se hallaron artículos con esos criterios</Text>
          <Text style={styles.emptyText}>
            Intentá restablecer los filtros de categoría o región, o utilizá palabras más generales.
          </Text>
          <Pressable
            style={styles.resetButton}
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory('todos');
              setSelectedLocation('todos');
            }}
          >
            <Text style={styles.resetButtonText}>Restablecer filtros</Text>
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
    gap: 12,
  },
  filterGroup: {
    gap: 6,
  },
  filterGroupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationSelectorRow: {
    gap: 6,
  },
  locationPills: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  locationChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  locationChipActive: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  locationChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  locationChipTextActive: {
    color: COLORS.white,
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
