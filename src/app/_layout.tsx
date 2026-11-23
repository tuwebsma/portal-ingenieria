import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor="#38205E" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8F7FA' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="ingenierias/index" />
        <Stack.Screen name="ingenierias/[slug]" />
        <Stack.Screen name="actualidad/index" />
        <Stack.Screen name="actualidad/[slug]" />
        <Stack.Screen name="instituciones/index" />
        <Stack.Screen name="instituciones/[slug]" />
        <Stack.Screen name="instituciones/[slug]/noticias" />
        <Stack.Screen name="publicaciones/index" />
      </Stack>
    </>
  );
}
