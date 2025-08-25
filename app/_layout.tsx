import 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from '@/components/Toast';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import NotificationInitializer from '@/hooks/useNotification';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'core-js/features/array/find-last-index';
import colors from '@/theme/color';
import * as Notifications from 'expo-notifications';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

type NotiData = {
  type?: 'leenk' | 'link' | 'feed';
  id?: string | number;
};

const ROUTES = {
  leenk: '/leenk/[id]' as const,
  feed: '/feed/[id]' as const,
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
  const pathname = usePathname();

  // 일부 페이지는 상단 SafeAreaView 배경을 제외하기 위한 패턴
  const excludeSafeAreaPages = ['/feed/write', /^\/feed\/[^/]+$/];
  const isExcluded = excludeSafeAreaPages.some((pattern) =>
    pattern instanceof RegExp ? pattern.test(pathname) : pattern === pathname,
  );

  // =========================
  // 🔔 푸시 알림 → 딥링크 이동 처리
  // =========================

  // 동일 알림으로 중복 네비게이션을 방지하기 위한 Set
  const handledNotiIdsRef = useRef<Set<string>>(new Set());

  // 알림 data를 해석해서 라우팅하는 헬퍼
  const navigateFromData = (raw?: Record<string, unknown>) => {
    const data = (raw ?? {}) as NotiData;

    const type = (data.type ?? '').toString().toLowerCase();
    const id = data.id != null ? String(data.id).trim() : '';
    if (!id) return;

    if (type === 'leenk') {
      // 타입드 라우트: pathname + params 형태
      router.push({
        pathname: ROUTES.leenk,
        params: { id },
      });
      return;
    }

    if (type === 'feed') {
      router.push({
        pathname: ROUTES.feed,
        params: { id },
      });
      return;
    }
  };

  useEffect(() => {
    // 앱이 실행 중(포어그라운드/백그라운드)일 때 알림을 "탭"한 경우 수신
    const sub = Notifications.addNotificationResponseReceivedListener(
      (resp) => {
        const id = resp.notification.request.identifier;

        // 이미 처리한 알림이면 무시 (중복 네비 방지)
        if (handledNotiIdsRef.current.has(id)) return;
        handledNotiIdsRef.current.add(id);

        // 알림 data로부터 목적지 이동
        const data = resp.notification.request.content.data as
          | Record<string, unknown>
          | undefined;
        navigateFromData(data);
      },
    );

    return () => sub.remove();
  }, []);

  useEffect(() => {
    // 앱이 완전 종료(cold start) 상태에서 "알림 탭"으로 시작한 경우 처리
    (async () => {
      const last = await Notifications.getLastNotificationResponseAsync();
      if (!last) return;

      const id = last.notification.request.identifier;
      if (handledNotiIdsRef.current.has(id)) return;
      handledNotiIdsRef.current.add(id);

      const data = last.notification.request.content.data as
        | Record<string, unknown>
        | undefined;
      navigateFromData(data);
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NotificationInitializer />

        <StatusBar
          style="dark"
          backgroundColor={
            pathname === '/account/notification-list'
              ? colors.white
              : colors.bg[2]
          }
          translucent={Platform.OS === 'ios'}
        />

        {/* 조건부 SafeAreaView (상단 배경 색 유지용) */}
        {!isExcluded && (
          <SafeAreaView
            edges={['top']}
            style={{
              backgroundColor:
                pathname === '/account/notification-list'
                  ? colors.white
                  : colors.bg[2],
            }}
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
