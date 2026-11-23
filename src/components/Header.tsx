import { COLORS, MaxContentWidth, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { NAVIGATION_ITEMS } from '@/lib/constants';
import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

interface HeaderProps {
  onSearchPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchPress }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 860;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <View style={styles.headerWrapper}>
      {/* Top Banner Ticker */}
      <View style={styles.topBar}>
        <View style={styles.topBarContainer}>
          <View style={styles.topBarLeft}>
            <View style={styles.liveDot} />
            <Text style={styles.topBarText}>EDICIÓN CIENTÍFICA & TECNOLÓGICA</Text>
            <Text style={styles.topBarDivider}>|</Text>
            <Text style={styles.topBarLocation}>ARGENTINA & EL MUNDO</Text>
          </View>
          <View style={styles.topBarRight}>
            <Text style={styles.topBarDate}>
              {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Navigation Bar */}
      <View style={styles.navbar}>
        <View style={styles.navContainer}>
          {/* Brand Logo */}
          <Link href="/" style={{ textDecorationLine: 'none' }}>
            <View style={styles.brandContainer}>
              <View style={styles.logoBadge}>
                <Ionicons name="hardware-chip" size={20} color={COLORS.white} />
              </View>
              <View>
                <View style={styles.brandTitleRow}>
                  <Text style={styles.brandTitle}>PORTAL</Text>
                  <Text style={styles.brandTitleAccent}>INGENIERÍA</Text>
                </View>
                <Text style={styles.brandTagline}>REVISTA DIGITAL & DIRECTORIO I+D</Text>
              </View>
            </View>
          </Link>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <View style={styles.navLinks}>
              {NAVIGATION_ITEMS.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path as any}
                    style={{ textDecorationLine: 'none' }}
                  >
                    <View style={[styles.navItem, active && styles.navItemActive]}>
                      <Text style={[styles.navItemText, active && styles.navItemTextActive]}>
                        {item.label}
                      </Text>
                      {active && <View style={styles.activeIndicator} />}
                    </View>
                  </Link>
                );
              })}
            </View>
          )}

          {/* Right Actions */}
          <View style={styles.rightActions}>
            <Pressable
              style={styles.searchIconButton}
              onPress={() => {
                if (onSearchPress) {
                  onSearchPress();
                } else {
                  router.push('/actualidad');
                }
              }}
              accessibilityLabel="Buscar noticias y artículos"
            >
              <Ionicons name="search-outline" size={20} color={COLORS.primaryDark} />
            </Pressable>

            {isMobile && (
              <Pressable
                style={styles.menuToggleButton}
                onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
                accessibilityLabel="Abrir menú"
              >
                <Ionicons
                  name={mobileMenuOpen ? 'close-outline' : 'menu-outline'}
                  size={26}
                  color={COLORS.primaryDark}
                />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* Mobile Drawer Navigation */}
      {isMobile && mobileMenuOpen && (
        <View style={styles.mobileMenu}>
          {NAVIGATION_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
            <Link
              key={item.path}
              href={item.path as any}
              style={{ textDecorationLine: 'none' }}
              onPress={() => setMobileMenuOpen(false)}
            >
              <View
                style={[styles.mobileMenuItem, active && styles.mobileMenuItemActive]}
              >
                  <Text
                    style={[
                      styles.mobileMenuItemText,
                      active && styles.mobileMenuItemTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {active && <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />}
                </View>
              </Link>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 100,
    ...SHADOWS.header,
  },
  topBar: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
  },
  topBarContainer: {
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  topBarText: {
    color: '#D8B4FE',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  topBarDivider: {
    color: '#6B5888',
    fontSize: 10,
  },
  topBarLocation: {
    color: '#E9D5FF',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarDate: {
    color: '#C4B5FD',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  navbar: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
  },
  navContainer: {
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: COLORS.primaryDark,
  },
  brandTitleAccent: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: COLORS.primary,
  },
  brandTagline: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.sm,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: COLORS.primarySoft,
  },
  navItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  navItemTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    left: 14,
    right: 14,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchIconButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuToggleButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileMenu: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: SPACING.md,
  },
  mobileMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  mobileMenuItemActive: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
  },
  mobileMenuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  mobileMenuItemTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
