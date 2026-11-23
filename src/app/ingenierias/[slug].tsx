import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { PageContainer } from '@/components/PageContainer';
import { NewsCard } from '@/components/NewsCard';
import { SectionTitle } from '@/components/SectionTitle';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { ENGINEERING_BRANCHES } from '@/data/engineering';
import { NEWS_ARTICLES } from '@/data/news';

export default function EngineeringDetailPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;

  const branch = ENGINEERING_BRANCHES.find((b) => b.slug === slug);

  if (!branch) {
    return (
      <PageContainer>
        <View style={styles.notFound}>
          <Text style={styles.branchTitle}>Carrera no encontrada</Text>
          <Text style={styles.branchSubtitle}>La ruta solicitada no corresponde a una carrera de este directorio.</Text>
          <Link href="/ingenierias" asChild>
            <Pressable style={styles.backButton}>
              <Ionicons name="arrow-back" size={16} color={COLORS.white} />
              <Text style={styles.backButtonText}>Volver a Ingenierías</Text>
            </Pressable>
          </Link>
        </View>
      </PageContainer>
    );
  }

  const relatedNews = NEWS_ARTICLES.filter(() => false);

  return (
    <PageContainer>
      {/* Navigation Breadcrumb */}
      <View style={styles.breadcrumbRow}>
        <Link href="/" asChild>
          <Pressable style={styles.breadcrumbLink}>
            <Text style={styles.breadcrumbText}>Inicio</Text>
          </Pressable>
        </Link>
        <Ionicons name="chevron-forward" size={12} color={COLORS.textLight} />
        <Link href="/ingenierias" asChild>
          <Pressable style={styles.breadcrumbLink}>
            <Text style={styles.breadcrumbText}>Ingenierías</Text>
          </Pressable>
        </Link>
        <Ionicons name="chevron-forward" size={12} color={COLORS.textLight} />
        <Text style={styles.breadcrumbCurrent}>{branch.name}</Text>
      </View>

      {/* Hero Banner */}
      <View style={styles.heroCard}>
        {branch.bannerImage ? (
          <Image source={{ uri: branch.bannerImage }} style={styles.heroBannerImage} contentFit="cover" />
        ) : (
          <View style={styles.heroPlaceholder}>
            <Ionicons name={branch.icon as any} size={48} color={COLORS.primary} />
          </View>
        )}
        <View style={styles.heroOverlay}>
          <View style={styles.iconCircle}>
            <Ionicons name={branch.icon as any} size={28} color={COLORS.white} />
          </View>
          <Text style={styles.branchTitle}>{branch.name}</Text>
          <Text style={styles.branchSubtitle}>{branch.shortDescription}</Text>
        </View>
      </View>

      {/* Main Content Layout */}
      <View style={[styles.mainLayout, isDesktop && styles.mainLayoutRow]}>
        {/* Left Column: Deep Dive */}
        <View style={styles.mainContent}>
          {/* Overview */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionHeader}>Visión General de la Disciplina</Text>
            <Text style={styles.bodyParagraph}>{branch.fullDescription}</Text>

            <View style={styles.impactBox}>
              <View style={styles.impactIconRow}>
                <Ionicons name="trending-up" size={18} color={COLORS.primary} />
                <Text style={styles.impactTitle}>Impacto Industrial y Estratégico</Text>
              </View>
              <Text style={styles.impactText}>{branch.careerImpact}</Text>
            </View>
          </View>

          {/* Subdisciplines & Key Areas */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionHeader}>Campos de Especialización e Investigación</Text>
            <View style={styles.areasGrid}>
              {branch.keyAreas.map((area, idx) => (
                <View key={idx} style={styles.areaItem}>
                  <View style={styles.areaDot} />
                  <Text style={styles.areaText}>{area}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Flagship Projects */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionHeader}>Proyectos Emblemáticos</Text>
            {branch.flagshipProjects.map((project, idx) => (
              <View key={idx} style={styles.projectCard}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <View style={styles.countryBadge}>
                    <Ionicons name="globe-outline" size={12} color={COLORS.primary} />
                    <Text style={styles.countryBadgeText}>{project.country}</Text>
                  </View>
                </View>
                <Text style={styles.projectDescription}>{project.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Right Sidebar */}
        <View style={[styles.sidebar, !isDesktop && styles.sidebarFull]}>
          {/* Technologies Box */}
          <View style={styles.sidebarCard}>
            <Text style={styles.sidebarTitle}>Tecnologías & Herramientas</Text>
            <View style={styles.techTagsRow}>
              {branch.technologies.map((tech, idx) => (
                <View key={idx} style={styles.techTag}>
                  <Text style={styles.techTagText}>{tech}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Nav other branches */}
          <View style={styles.sidebarCard}>
            <Text style={styles.sidebarTitle}>Otras Especialidades</Text>
            {ENGINEERING_BRANCHES.filter((b) => b.slug !== branch.slug).slice(0, 5).map((other) => (
              <Link key={other.slug} href={`/ingenierias/${other.slug}` as any} asChild>
                <Pressable style={styles.otherBranchItem}>
                  <Ionicons name={other.icon as any} size={16} color={COLORS.primary} />
                  <Text style={styles.otherBranchText}>{other.name}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>
      </View>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <View style={styles.relatedSection}>
          <SectionTitle
            title="Investigaciones y Noticias Relacionadas"
            subtitle={`Artículos y avances vinculados a ${branch.name}`}
            viewAllLink="/actualidad"
          />
          <View style={[styles.grid, isDesktop ? styles.grid3Cols : isTablet ? styles.grid2Cols : styles.grid1Col]}>
            {relatedNews.map((article) => (
              <NewsCard key={article.id} article={article} variant="vertical" />
            ))}
          </View>
        </View>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  notFound: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
  },
  breadcrumbLink: {
    paddingVertical: 2,
  },
  breadcrumbText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  breadcrumbCurrent: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  heroCard: {
    height: 320,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: SPACING.xl,
    ...SHADOWS.cardHover,
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primarySoft,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.xl,
    backgroundColor: 'rgba(25, 21, 34, 0.88)',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  branchTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  branchSubtitle: {
    fontSize: 15,
    color: '#D1C4E9',
    lineHeight: 22,
    maxWidth: 800,
  },
  mainLayout: {
    gap: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  mainLayoutRow: {
    flexDirection: 'row',
  },
  mainContent: {
    flex: 2,
  },
  sidebar: {
    flex: 1,
    minWidth: 280,
  },
  sidebarFull: {
    width: '100%',
  },
  cardSection: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 14,
  },
  bodyParagraph: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  impactBox: {
    backgroundColor: COLORS.primarySoft,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  impactIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  impactTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  impactText: {
    fontSize: 13,
    color: COLORS.primaryDark,
    lineHeight: 20,
  },
  areasGrid: {
    gap: 10,
  },
  areaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.surfaceAlt,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
  },
  areaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  areaText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  projectCard: {
    backgroundColor: COLORS.surfaceAlt,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  projectName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  countryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  countryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  projectDescription: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  sidebarCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 12,
  },
  techTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  techTag: {
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
  },
  techTagText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  otherBranchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  otherBranchText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  relatedSection: {
    marginTop: SPACING.lg,
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
});
