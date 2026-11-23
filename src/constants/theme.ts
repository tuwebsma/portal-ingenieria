import { Platform } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/styles/variables';

export const Colors = {
  light: {
    text: COLORS.text,
    background: COLORS.background,
    surface: COLORS.surface,
    primary: COLORS.primary,
    primaryDark: COLORS.primaryDark,
    primaryLight: COLORS.primaryLight,
    border: COLORS.border,
    textSecondary: COLORS.textMuted,
  },
  dark: {
    text: '#F8FAFC',
    background: '#0F0E17',
    surface: '#1A1829',
    primary: '#9270CF',
    primaryDark: '#38205E',
    primaryLight: '#B799EC',
    border: '#2D2845',
    textSecondary: '#94A3B8',
  },
} as const;

export { COLORS, SPACING, RADIUS, SHADOWS };

export const MaxContentWidth = 1200;
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
