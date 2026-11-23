import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '@/constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar por palabra clave, especialidad, tecnología...',
  onClear,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color={COLORS.primary} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => {
            onChangeText('');
            if (onClear) onClear();
          }}
          style={styles.clearButton}
          accessibilityLabel="Limpiar búsqueda"
        >
          <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
    ...SHADOWS.searchBar,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
});
