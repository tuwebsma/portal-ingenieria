import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageContainer } from '@/components/PageContainer';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

export default function PublicacionesScreen() {
  return (
    <PageContainer>
      <View style={styles.issueHeader}>
        <Text style={styles.kicker}>Biblioteca editorial</Text>
        <Text style={styles.title}>Publicaciones científicas y técnicas</Text>
        <Text style={styles.deck}>
          Próximamente: revistas, informes, documentos técnicos y papers organizados por
          disciplina e institución.
        </Text>
      </View>

      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Ionicons name="library-outline" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.emptyTitle}>Todavía no hay publicaciones incorporadas</Text>
        <Text style={styles.emptyText}>
          Esta sección está preparada para incorporar fuentes verificadas sin mostrar
          resultados simulados ni referencias ficticias.
        </Text>
      </View>

      <View style={styles.formats}>
        {['Revistas científicas', 'Artículos y papers', 'Informes técnicos', 'Documentos oficiales'].map((format) => (
          <View key={format} style={styles.formatItem}>
            <Ionicons name="document-text-outline" size={18} color={COLORS.primary} />
            <Text style={styles.formatText}>{format}</Text>
          </View>
        ))}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  issueHeader: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primaryDark,
    paddingBottom: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    color: COLORS.primaryDark,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '900',
    letterSpacing: -1,
  },
  deck: {
    color: COLORS.textMuted,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 760,
    marginTop: 8,
  },
  emptyState: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primarySoft,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryDark,
    textAlign: 'center',
  },
  emptyText: {
    maxWidth: 620,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
  formats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: SPACING.lg,
  },
  formatItem: {
    flexBasis: 220,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  formatText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
});
