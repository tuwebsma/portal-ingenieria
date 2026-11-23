import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, MaxContentWidth } from '@/constants/theme';
import { NAVIGATION_ITEMS, SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';
import { ENGINEERING_BRANCHES } from '@/data/engineering';

export const Footer: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <View style={styles.footerWrapper}>
      <View style={styles.footerContainer}>
        {/* Newsletter Section Banner */}
        <View style={styles.newsletterCard}>
          <View style={styles.newsletterInfo}>
            <View style={styles.newsletterBadge}>
              <Ionicons name="mail-open-outline" size={16} color={COLORS.primaryLight} />
              <Text style={styles.newsletterBadgeText}>BOLETÍN TÉCNICO SEMANAL</Text>
            </View>
            <Text style={styles.newsletterTitle}>Mantenete al día con la ingeniería y la ciencia</Text>
            <Text style={styles.newsletterSubtitle}>
              Recibí resúmenes de proyectos de infraestructura, patentes, lanzamientos aeroespaciales y desarrollos nucleares.
            </Text>
          </View>
          <View style={styles.newsletterForm}>
            {subscribed ? (
              <View style={styles.subscribedBox}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.subscribedText}>¡Gracias por suscribirte al boletín del Portal!</Text>
              </View>
            ) : (
              <View style={styles.formRow}>
                <TextInput
                  style={styles.newsletterInput}
                  placeholder="Tu correo electrónico..."
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <Pressable style={styles.newsletterButton} onPress={handleSubscribe}>
                  <Text style={styles.newsletterButtonText}>Suscribirse</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* 4 Column Directory Links */}
        <View style={[styles.columnsGrid, isMobile && styles.columnsGridMobile]}>
          {/* Column 1: Editorial Info */}
          <View style={styles.columnMain}>
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <Ionicons name="hardware-chip" size={18} color={COLORS.white} />
              </View>
              <Text style={styles.logoText}>{SITE_NAME}</Text>
            </View>
            <Text style={styles.brandDescription}>{SITE_DESCRIPTION}</Text>
            <View style={styles.locationPill}>
              <Ionicons name="location-outline" size={14} color={COLORS.primaryLight} />
              <Text style={styles.locationText}>Buenos Aires • Bariloche • Córdoba • Rosario</Text>
            </View>
          </View>

          {/* Column 2: Secciones */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Secciones</Text>
            {NAVIGATION_ITEMS.map((item) => (
              <Link key={item.path} href={item.path as any} asChild>
                <Pressable style={styles.linkItem}>
                  <Ionicons name="chevron-forward" size={12} color={COLORS.primaryLight} />
                  <Text style={styles.linkText}>{item.label}</Text>
                </Pressable>
              </Link>
            ))}
          </View>

          {/* Column 3: Ramas Destacadas */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Ramas de la Ingeniería</Text>
            {ENGINEERING_BRANCHES.slice(0, 5).map((branch) => (
              <Link key={branch.slug} href={`/ingenierias/${branch.slug}` as any} asChild>
                <Pressable style={styles.linkItem}>
                  <Ionicons name="chevron-forward" size={12} color={COLORS.primaryLight} />
                  <Text style={styles.linkText} numberOfLines={1}>{branch.name}</Text>
                </Pressable>
              </Link>
            ))}
            <Link href="/ingenierias" asChild>
              <Pressable style={styles.viewAllLink}>
                <Text style={styles.viewAllText}>Ver todas las ramas →</Text>
              </Pressable>
            </Link>
          </View>

          {/* Column 4: Ecosistema & Enlaces Institucionales */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Ecosistema de I+D</Text>
            <Link href="/instituciones" asChild>
              <Pressable style={styles.linkItem}>
                <Ionicons name="business-outline" size={12} color={COLORS.primaryLight} />
                <Text style={styles.linkText}>Directorio de Centros y Empresas</Text>
              </Pressable>
            </Link>
            <Link href="/publicaciones" asChild>
              <Pressable style={styles.linkItem}>
                <Ionicons name="book-outline" size={12} color={COLORS.primaryLight} />
                <Text style={styles.linkText}>Revistas y Publicaciones Científicas</Text>
              </Pressable>
            </Link>
            <Link href="/actualidad" asChild>
              <Pressable style={styles.linkItem}>
                <Ionicons name="newspaper-outline" size={12} color={COLORS.primaryLight} />
                <Text style={styles.linkText}>Archivo de Noticias Tecnológicas</Text>
              </Pressable>
            </Link>
            <View style={styles.openAccessTag}>
              <Ionicons name="lock-open-outline" size={14} color="#10B981" />
              <Text style={styles.openAccessText}>Divulgación abierta y gratuita</Text>
            </View>
          </View>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <Text style={styles.copyrightText}>
            © {new Date().getFullYear()} Portal de Ingeniería. Todos los derechos reservados.
          </Text>
          <Text style={styles.bottomDisclaimer}>
            Plataforma de divulgación técnica orientada a la ingeniería, innovación industrial y desarrollo de base científica.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerWrapper: {
    backgroundColor: COLORS.primaryDark,
    color: COLORS.white,
    marginTop: SPACING.xxl,
    borderTopWidth: 4,
    borderTopColor: COLORS.primary,
  },
  footerContainer: {
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  newsletterCard: {
    backgroundColor: '#271442',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: '#4A2B78',
  },
  newsletterInfo: {
    flex: 1,
    minWidth: 280,
  },
  newsletterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  newsletterBadgeText: {
    color: '#D8B4FE',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  newsletterTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  newsletterSubtitle: {
    color: '#C4B5FD',
    fontSize: 13,
    lineHeight: 18,
  },
  newsletterForm: {
    minWidth: 280,
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newsletterInput: {
    flex: 1,
    backgroundColor: '#38205E',
    borderWidth: 1,
    borderColor: '#6C35B5',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    color: COLORS.white,
    fontSize: 14,
  },
  newsletterButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: RADIUS.md,
  },
  newsletterButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  subscribedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1E3A2F',
    padding: 12,
    borderRadius: RADIUS.md,
  },
  subscribedText: {
    color: '#A7F3D0',
    fontSize: 13,
    fontWeight: '600',
  },
  columnsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: SPACING.xl,
    paddingBottom: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: '#4A2B78',
  },
  columnsGridMobile: {
    flexDirection: 'column',
    gap: SPACING.lg,
  },
  columnMain: {
    flex: 2,
    minWidth: 240,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandDescription: {
    color: '#D1C4E9',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#271442',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  locationText: {
    color: '#D8B4FE',
    fontSize: 11,
    fontWeight: '500',
  },
  column: {
    flex: 1,
    minWidth: 180,
  },
  columnTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  linkText: {
    color: '#D1C4E9',
    fontSize: 13,
  },
  viewAllLink: {
    marginTop: 4,
  },
  viewAllText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  openAccessTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: '#1E3A2F',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  openAccessText: {
    color: '#6EE7B7',
    fontSize: 11,
    fontWeight: '600',
  },
  bottomBar: {
    paddingTop: SPACING.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  copyrightText: {
    color: '#A78BFA',
    fontSize: 12,
  },
  bottomDisclaimer: {
    color: '#8B72A8',
    fontSize: 11,
  },
});
