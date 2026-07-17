import 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
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
import { getAccessToken } from '@react-native-kakao/user';
import { getUsersInfo } from '@/api/users/getUsersInfo.api';
import { useUserStore } from '@/stores/userStore';
import { InAppNotificationProvider } from '@/components/InAppNotificationProvider';
import { LogBox } from 'react-native';
import { getAuthStatus, clearAllTokens } from '@/utils/tokenStorage';
import * as Clarity from '@microsoft/react-native-clarity';
import { saveAuthStatus } from '@/utils/tokenStorage';
import {
  handleNotificationOpen,
  markAuthResolved,
  markNavigatorMounted,
} from '@/utils/notificationRouter';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

LogBox.ignoreLogs([
  'StatusBar backgroundColor is not supported with edge-to-edge enabled.',
  'StatusBar is always translucent when edge-to-edge is enabled.',
]);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// 클래리티 초기화
Clarity.initialize('ub586r8mex', {
  logLevel: Clarity.LogLevel.None, // Note: Use "LogLevel.Verbose" value while testing to debug initialization issues.
});

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const { setUserInfo } = useUserStore();

  // 포그라운드에서도 배너 보이도록
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }, []);

  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const autoLogin = async () => {
      try {
        const status = await getAuthStatus();

        if (status === 'REGISTERING') {
          await clearAllTokens();
        }

        if (!kakaoNativeAppKey) return;

        const accessToken = await getAccessToken();

        if (accessToken) {
          const data = await getUsersInfo();
          setUserInfo(data);
          saveAuthStatus('AUTHENTICATED');
          router.replace('/leenk');
        } else {
          router.replace('/');
        }
      } catch (err) {
        console.warn('[AUTO-LOGIN] accessToken 만료');
        router.replace('/');
      } finally {
        setAppReady(true);
        // 자동 로그인의 replace가 끝난 뒤에 대기 중인 딥링크를 흘려보낸다.
        markAuthResolved();
        await SplashScreen.hideAsync();
      }
    };

    autoLogin();
  }, []);
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
  const excludeSafeAreaPages = [
    '/feed/write',
    /^\/feed\/[^/]+$/,
    /^\/leenk\/[^/]+$/,
  ];
  const isExcluded = excludeSafeAreaPages.some((pattern) =>
    pattern instanceof RegExp ? pattern.test(pathname) : pattern === pathname,
  );

  // =========================
  // 🔔 푸시 알림 → 딥링크 이동 처리
  // 목적지 해석과 중복 처리는 notificationRouter가 담당한다.
  // =========================

  useEffect(() => {
    // Stack이 마운트된 뒤에야 이동이 유실되지 않는다.
    markNavigatorMounted();
  }, []);

  useEffect(() => {
    // 앱이 실행 중(포어그라운드/백그라운드)일 때 알림을 "탭"한 경우 수신
    const sub = Notifications.addNotificationResponseReceivedListener(
      (resp) => {
        handleNotificationOpen(
          resp.notification.request.identifier,
          resp.notification.request.content.data as
            | Record<string, unknown>
            | undefined,
        );
      },
    );

    return () => sub.remove();
  }, []);

  useEffect(() => {
    // 앱이 완전 종료(cold start) 상태에서 "알림 탭"으로 시작한 경우 처리
    (async () => {
      const last = await Notifications.getLastNotificationResponseAsync();
      if (!last) return;

      handleNotificationOpen(
        last.notification.request.identifier,
        last.notification.request.content.data as
          | Record<string, unknown>
          | undefined,
      );
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <InAppNotificationProvider>
          <NotificationInitializer />

          <StatusBar translucent style="dark" backgroundColor="transparent" />

          {/* <StatusBar
            style="dark"
            backgroundColor={
              pathname === '/account/notification-list'
                ? colors.white
                : colors.bg[2]
            }
            translucent={Platform.OS === 'ios'}
          /> */}

          {/* 조건부 SafeAreaView (상단 배경 색 유지용) */}
          {/* {!isExcluded && (
            <SafeAreaView
              edges={['top']}
              style={{
                backgroundColor:
                  pathname === '/account/notification-list'
                    ? colors.white
                    : colors.bg[2],
              }}
            />
          )} */}

          <ThemeProvider value={DefaultTheme}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
            <Toast />
          </ThemeProvider>
        </InAppNotificationProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
