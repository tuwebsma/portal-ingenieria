import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PageContainer } from '@/components/PageContainer';
import { FeaturedNews } from '@/components/FeaturedNews';
import { NewsCard } from '@/components/NewsCard';
import { CategoryCard } from '@/components/CategoryCard';
import { InstitutionCard } from '@/components/InstitutionCard';
import { SourceCard } from '@/components/SourceCard';
import { SectionTitle } from '@/components/SectionTitle';
import { FilterBar, FilterOption } from '@/components/FilterBar';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { NEWS_ARTICLES } from '@/data/news';
import { ENGINEERING_BRANCHES } from '@/data/engineering';
import { INSTITUTIONS } from '@/data/institutions';
import { PUBLICATIONS } from '@/data/publications';
import { CATEGORIES } from '@/data/categories';

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Featured article (lead news)
  const featuredArticle = NEWS_ARTICLES.find((a) => a.isFeatured) || NEWS_ARTICLES[0];
  const secondaryNews = NEWS_ARTICLES.filter((a) => a.id !== featuredArticle.id).slice(0, 3);

  // Category filter options
  const categoryFilterOptions: FilterOption[] = [
    { id: 'todos', label: 'Todas las áreas', count: NEWS_ARTICLES.length },
    ...CATEGORIES.map((cat) => ({
      id: cat.slug,
      label: cat.name,
      count: NEWS_ARTICLES.filter((a) => a.category === cat.slug).length,
    })),
  ];

  const filteredNews =
    selectedCategory === 'todos'
      ? NEWS_ARTICLES
      : NEWS_ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <PageContainer>
      {/* Editorial Hero Announcement Bar */}
      <View style={styles.heroBanner}>
        <View style={styles.heroBannerContent}>
          <View style={styles.pulseDot} />
          <Text style={styles.heroBannerTag}>PANORAMA ESTRATÉGICO</Text>
          <Text style={styles.heroBannerText} numberOfLines={1}>
            Desarrollos de ingeniería, transición energética, misiones satelitales y tecnología de punta
          </Text>
        </View>
        <Link href="/actualidad" asChild>
          <Pressable style={styles.heroBannerLink}>
            <Text style={styles.heroBannerLinkText}>Explorar noticias</Text>
            <Ionicons name="arrow-forward" size={13} color={COLORS.primary} />
          </Pressable>
        </Link>
      </View>

      {/* Main Featured Lead Story */}
      <FeaturedNews article={featuredArticle} />

      {/* Top Secondary Stories Grid */}
      <View style={styles.sectionSpacing}>
        <SectionTitle
          title="Avances y Proyectos Destacados"
          subtitle="Investigaciones científicas e innovaciones técnicas en curso"
          viewAllLink="/actualidad"
          viewAllText="Ver todas las noticias"
          badge="Actualidad"
        />

        <View style={[styles.grid, isDesktop ? styles.grid3Cols : isTablet ? styles.grid2Cols : styles.grid1Col]}>
          {secondaryNews.map((article) => (
            <NewsCard key={article.id} article={article} variant="vertical" />
          ))}
        </View>
      </View>

      {/* Engineering Branches Showcase */}
      <View style={styles.sectionSpacing}>
        <SectionTitle
          title="Ramas de la Ingeniería"
          subtitle="Especialidades clave, alcance industrial y proyectos emblemáticos"
          viewAllLink="/ingenierias"
          viewAllText="Ver todas las ramas"
          badge="Directorio"
        />

        <View style={[styles.grid, isDesktop ? styles.grid4Cols : isTablet ? styles.grid2Cols : styles.grid1Col]}>
          {ENGINEERING_BRANCHES.slice(0, 4).map((branch) => (
            <CategoryCard key={branch.slug} branch={branch} />
          ))}
        </View>
      </View>

      {/* Interactive Category Filter Section */}
      <View style={styles.sectionSpacing}>
        <SectionTitle
          title="Explorar por Área Temática"
          subtitle="Filtrá las publicaciones e investigaciones según tu campo de interés"
          badge="Filtros"
        />

        <View style={styles.filterBarWrapper}>
          <FilterBar
            options={categoryFilterOptions}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </View>

        <View style={[styles.grid, isDesktop ? styles.grid3Cols : isTablet ? styles.grid2Cols : styles.grid1Col]}>
          {filteredNews.slice(0, 6).map((article) => (
            <NewsCard key={article.id} article={article} variant="vertical" />
          ))}
        </View>
      </View>

      {/* Institutions & Research Centers Highlights */}
      <View style={styles.sectionSpacing}>
        <SectionTitle
          title="Ecosistema Institucional y de I+D"
          subtitle="Centros de investigación, empresas de alta tecnología y organismos de ciencia aplicada"
          viewAllLink="/instituciones"
          viewAllText="Directorio completo"
          badge="Instituciones"
        />

        <View style={[styles.grid, isDesktop ? styles.grid2Cols : styles.grid1Col]}>
          {INSTITUTIONS.slice(0, 4).map((institution) => (
            <InstitutionCard key={institution.slug} institution={institution} />
          ))}
        </View>
      </View>

      {/* Scientific Publications and Journals */}
      <View style={styles.sectionSpacing}>
        <SectionTitle
          title="Revistas y Publicaciones Especializadas"
          subtitle="Fuentes bibliográficas confiables, revistas arbitradas y reportes técnicos"
          viewAllLink="/publicaciones"
          viewAllText="Ver publicaciones"
          badge="Divulgación"
        />

        <View style={[styles.grid, isDesktop ? styles.grid3Cols : isTablet ? styles.grid2Cols : styles.grid1Col]}>
          {PUBLICATIONS.slice(0, 3).map((publication) => (
            <SourceCard key={publication.slug} publication={publication} />
          ))}
        </View>
      </View>

      {/* Engineering Stats & Manifesto Banner */}
      <View style={styles.manifestoBanner}>
        <View style={styles.manifestoHeader}>
          <Text style={styles.manifestoPreTitle}>CONOCIMIENTO Y DESARROLLO SOBERANO</Text>
          <Text style={styles.manifestoTitle}>La ingeniería como motor de transformación</Text>
          <Text style={styles.manifestoDescription}>
            El Portal de Ingeniería reúne a profesionales, investigadores y entusiastas de la técnica
            para documentar los grandes proyectos que definen la matriz productiva, la infraestructura y el avance tecnológico.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>8+</Text>
            <Text style={styles.statLabel}>Ramas Principales</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>10+</Text>
            <Text style={styles.statLabel}>Centros de I+D</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Acceso Abierto</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Actualidad Técnica</Text>
          </View>
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  heroBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    flexWrap: 'wrap',
    gap: 8,
  },
  heroBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 280,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  heroBannerTag: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  heroBannerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    flex: 1,
  },
  heroBannerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
  },
  heroBannerLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  sectionSpacing: {
    marginBottom: SPACING.xxl,
  },
  filterBarWrapper: {
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
  grid4Cols: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  manifestoBanner: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: '#4A2B78',
    ...SHADOWS.card,
  },
  manifestoHeader: {
    marginBottom: SPACING.lg,
    maxWidth: 700,
  },
  manifestoPreTitle: {
    color: '#D8B4FE',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  manifestoTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  manifestoDescription: {
    color: '#D1C4E9',
    fontSize: 14,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#4A2B78',
  },
  statBox: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#271442',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  statNumber: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    color: '#C4B5FD',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
