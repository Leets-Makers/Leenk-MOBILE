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

const TRUSTED_HOSTS = [
  'weeth.kr',
  'www.weeth.kr',

  // Kakao OAuth/동의/리다이렉트 도메인
  'accounts.kakao.com',
  'kauth.kakao.com',
  'kapi.kakao.com',
  'talk-apps.kakao.com',
];

const isHttp = (url: string) => /^https?:\/\//i.test(url);
const isTrustedHost = (u: string) => {
  try {
    return TRUSTED_HOSTS.includes(new URL(u).host);
  } catch {
    return false;
  }
};

// 비동기여도 호출만 하고 기다리지 않음
const openAndroidIntent = async (intentUrl: string) => {
  try {
    await Linking.openURL(intentUrl);
  } catch {
    // fallback URL 또는 PlayStore 이동 처리
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

  // 안드로이드 하드웨어 뒤로가기 처리
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

  const displayUrl = useMemo(() => {
    try {
      const u = new URL(currentUrl);
      const path = u.pathname === '/' ? '' : u.pathname;
      return `${u.host}${path}`;
    } catch {
      return currentUrl || '';
    }
  }, [currentUrl]);

  // 동기 함수로 변경
  const onShouldStart = useCallback((req: ShouldStartLoadRequest) => {
    const nextUrl: string = req?.url ?? '';

    // 1) 카카오/마켓 등 앱 스킴은 외부로
    if (/^(kakaolink|kakaokompassauth|kakao|market):\/\//i.test(nextUrl)) {
      void Linking.openURL(nextUrl);
      return false;
    }
    // 2) Android intent:// 처리 (카카오 앱 열기 등)
    if (/^intent:\/\//i.test(nextUrl)) {
      void openAndroidIntent(nextUrl);
      return false;
    }

    // 3) http(s)인 경우: 신뢰 도메인은 WebView 내부, 그 외는 외부 브라우저
    if (isHttp(nextUrl)) {
      if (isTrustedHost(nextUrl)) return true;
      void Linking.openURL(nextUrl);
      return false;
    }

    // 4) 나머지 스킴도 외부로 넘김
    void Linking.openURL(nextUrl);
    return false;
  }, []);

  if (!targetUrl) return null;

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
        originWhitelist={['*']}
        mixedContentMode="always"
      />
    </SafeAreaView>
  );
}
