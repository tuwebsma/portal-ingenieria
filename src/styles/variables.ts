import { Platform, ViewStyle } from 'react-native';

export const COLORS = {
  // Main brand violet palette
  primary: '#6C35B5',        // Violeta principal
  primaryDark: '#38205E',    // Violeta oscuro
  primaryLight: '#9270CF',   // Violeta secundario / acento
  primarySoft: '#F0EAF8',    // Fondo violeta muy suave
  primarySubtle: '#FAF7FD',  // Tinte violeta sutilísimo

  // Neutral tones
  white: '#FFFFFF',
  background: '#F8F7FA',     // Gris muy claro
  surface: '#FFFFFF',        // Tarjetas y modales
  surfaceAlt: '#F3F2F6',     // Superficie secundaria
  border: '#E6E3EB',         // Bordes sutiles
  borderLight: '#F0EEF4',    // Bordes más suaves

  // Typography
  text: '#191522',           // Títulos y texto principal (casi negro)
  textMuted: '#64748B',      // Gris medio para textos secundarios
  textLight: '#94A3B8',      // Textos de apoyo / fecha
  textInverse: '#FFFFFF',

  // Accents & status
  accentBlue: '#2563EB',
  accentTeal: '#0D9488',
  accentAmber: '#D97706',
  accentRose: '#E11D48',
  tagBg: '#EDE9FE',
  tagText: '#5B21B6',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

/**
 * Helper to create cross-platform shadow styles.
 *
 * React Native Web (>= 0.19) deprecates the `shadow*` shorthand properties
 * in favour of the CSS-standard `boxShadow` string.  Native platforms still
 * require the legacy `shadow*` + `elevation` properties.
 *
 * This function returns the appropriate style object for the current platform
 * so consumers can simply spread the result: `...SHADOWS.card`.
 */
function createShadow(
  color: string,
  offsetX: number,
  offsetY: number,
  opacity: number,
  radius: number,
  elevation: number,
): ViewStyle {
  if (Platform.OS === 'web') {
    // Convert colour + opacity into an rgba() value for boxShadow.
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return {
      boxShadow: `${offsetX}px ${offsetY}px ${radius}px rgba(${r}, ${g}, ${b}, ${opacity})`,
    } as ViewStyle;
  }

  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
}

export const SHADOWS = {
  card: createShadow('#38205E', 0, 4, 0.06, 12, 2),
  cardHover: createShadow('#38205E', 0, 8, 0.12, 20, 4),
  header: createShadow('#191522', 0, 2, 0.05, 8, 3),
  searchBar: createShadow('#38205E', 0, 2, 0.04, 6, 2),
};
