import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { PageContainer } from '@/components/PageContainer';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

export default function ArticleDetailPage() {
  return (
    <PageContainer>
      <View style={styles.emptyState}>
        <Ionicons name="newspaper-outline" size={36} color={COLORS.primary} />
        <Text style={styles.title}>Publicación no disponible</Text>
        <Text style={styles.text}>
          No hay artículos cargados en esta etapa. Las publicaciones futuras se abrirán
          directamente en el sitio oficial de su fuente.
        </Text>
        <Link href="/actualidad" asChild>
          <Pressable style={styles.button}>
            <Ionicons name="arrow-back" size={16} color={COLORS.white} />
            <Text style={styles.buttonText}>Volver a Actualidad</Text>
          </Pressable>
        </Link>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
  },
  title: {
    color: COLORS.primaryDark,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 12,
  },
  text: {
    maxWidth: 580,
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 6,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginTop: 16,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
