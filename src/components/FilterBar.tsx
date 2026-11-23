import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ options, selectedId, onSelect }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option.id)}
            style={[styles.filterChip, isSelected && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
              {option.label}
            </Text>
            {option.count !== undefined && (
              <View style={[styles.countBadge, isSelected && styles.countBadgeActive]}>
                <Text style={[styles.countText, isSelected && styles.countTextActive]}>
                  {option.count}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 6,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  filterTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  countBadgeActive: {
    backgroundColor: COLORS.primaryDark,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  countTextActive: {
    color: COLORS.white,
  },
});
