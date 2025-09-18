import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  SafeAreaView,
  View,
} from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import * as Linking from 'expo-linking';
import { Header } from '@/components';
import { CONTAINER_PADDING } from '@/constants';
import { width } from '@/theme/globalStyles';

// Android intent:// 처리 (카카오 앱 열기 등)
const openAndroidIntent = async (intentUrl: string) => {
  try {
    await Linking.openURL(intentUrl);
  } catch {
    const fallback = /;S\.browser_fallback_url=([^;]+);?/.exec(intentUrl)?.[1];
    if (fallback) {
      const decoded = decodeURIComponent(fallback);
      await Linking.openURL(decoded);
      return;
    }
    const pkg = /;package=([^;]+);?/.exec(intentUrl)?.[1];
    if (pkg) {
      await Linking.openURL(`market://details?id=${pkg}`);
    }
  }
};

export default function WebviewScreen() {
  const { url = '' } = useLocalSearchParams<{ url?: string; title?: string }>();

  const webRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const targetUrl = useMemo(() => (typeof url === 'string' ? url : ''), [url]);

  const [currentUrl, setCurrentUrl] = useState(targetUrl);

  // 안드로이드 하드웨어 뒤로가기: WebView 내 뒤로가기가 가능하면 우선 처리
  React.useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webRef.current) {
        webRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack]);

  const onNavStateChange = useCallback((navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    if (navState.url) setCurrentUrl(navState.url);
  }, []);

  // 헤더에 표시할 도메인/경로
  const displayUrl = useMemo(() => {
    try {
      const u = new URL(currentUrl);
      const path = u.pathname === '/' ? '' : u.pathname;
      return `${u.host}${path}`;
    } catch {
      return currentUrl || '';
    }
  }, [currentUrl]);

  const onShouldStart = useCallback((req: ShouldStartLoadRequest) => {
    const nextUrl = req?.url ?? '';

    // 1) Android intent://
    if (/^intent:\/\//i.test(nextUrl)) {
      void openAndroidIntent(nextUrl);
      return false;
    }

    // 2) 카카오/마켓/전화/메일/SMS 등 앱 스킴은 외부로 넘김
    if (
      /^(kakaolink|kakaokompassauth|kakao|market|tel|mailto|sms):/i.test(
        nextUrl,
      )
    ) {
      void Linking.openURL(nextUrl);
      return false;
    }

    // 3) http/https는 전부 내부에서 허용
    if (/^https?:\/\//i.test(nextUrl)) {
      return true;
    }

    // 4) 그 외 알 수 없는 스킴은 외부(또는 false로 차단해도 됨)
    return false;
  }, []);

  if (!targetUrl) return null;

  const HEADER_HEIGHT = 48;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Header
        isWebView
        style={{
          zIndex: 9999,
          backgroundColor: 'white',
          paddingHorizontal: CONTAINER_PADDING * width,
        }}
      >
        {displayUrl}
      </Header>
      <WebView
        ref={webRef}
        source={{ uri: targetUrl }}
        onNavigationStateChange={onNavStateChange}
        startInLoadingState
        renderLoading={() => (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator />
          </View>
        )}
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={onShouldStart}
        contentInsetAdjustmentBehavior="never"
        bounces={false}
        originWhitelist={['https://*', 'http://*']}
        mixedContentMode="compatibility"
      />
    </SafeAreaView>
  );
}
