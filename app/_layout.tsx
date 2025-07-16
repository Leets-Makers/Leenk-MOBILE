import 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from '@/components/Toast';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import NotificationInitializer from '@/hooks/useNotification';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'core-js/features/array/find-last-index';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    'NanumSquareNeo-Regular': require('../assets/fonts/NanumSquareNeo-bRg.ttf'),
    'NanumSquareNeo-Bold': require('../assets/fonts/NanumSquareNeo-cBd.ttf'),
    'NanumSquareNeo-ExtraBold': require('../assets/fonts/NanumSquareNeo-dEb.ttf'),
    ...FontAwesome.font,
  });
  const kakaoNativeAppKey = process.env.EXPO_PUBLIC_NATIVE_APP_KEY || '';

  if (!kakaoNativeAppKey) {
    console.error('EXPO_PUBLIC_NATIVE_APP_KEY가 설정되지 않았습니다.');
  }
  useEffect(() => {
    if (kakaoNativeAppKey) {
      initializeKakaoSDK(kakaoNativeAppKey);
    }
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  const excludeSafeAreaPages = ['/feed/write', /^\/feed\/[^/]+$/];
  const isExcluded = excludeSafeAreaPages.some((pattern) =>
    pattern instanceof RegExp ? pattern.test(pathname) : pattern === pathname,
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NotificationInitializer />

        <StatusBar
          style="dark"
          backgroundColor="#F0ECFE"
          translucent={Platform.OS === 'ios'}
        />

        {/* 조건부 SafeAreaView */}
        {!isExcluded && (
          <SafeAreaView
            edges={['top']}
            style={{ backgroundColor: '#F0ECFE' }}
          />
        )}

        <ThemeProvider value={DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
          <Toast />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
