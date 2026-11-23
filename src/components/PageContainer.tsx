import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { COLORS, MaxContentWidth, SPACING } from '@/constants/theme';

interface PageContainerProps {
  children: React.ReactNode;
  contentMaxWidth?: number;
  noHorizontalPadding?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  contentMaxWidth = MaxContentWidth,
  noHorizontalPadding = false,
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Header />
        <View style={styles.mainWrapper}>
          <View
            style={[
              styles.contentContainer,
              { maxWidth: contentMaxWidth },
              !noHorizontalPadding && styles.contentPadding,
            ]}
          >
            {children}
          </View>
        </View>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  mainWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.lg,
  },
  contentContainer: {
    width: '100%',
  },
  contentPadding: {
    paddingHorizontal: SPACING.md,
  },
});
