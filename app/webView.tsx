import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';
import {
  WebView,
  type WebViewNavigation,
  type WebViewMessageEvent,
} from 'react-native-webview';
import * as Linking from 'expo-linking';

/** 신뢰하는 도메인만 내부 WebView로 열고, 나머지는 외부 앱으로 보낼 때 사용 */
const isHttp = (url: string) => /^https?:\/\//i.test(url);
const TRUSTED_HOSTS = ['weeth.kr', 'www.weeth.kr'];

export default function WebviewScreen() {
  const { url = '', title } = useLocalSearchParams<{
    url?: string;
    title?: string;
  }>();
  const router = useRouter();
  const webRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const targetUrl = useMemo(() => (typeof url === 'string' ? url : ''), [url]);

  // 안드로이드 하드웨어 뒤로가기 처리 (WebView 내부 뒤로가기 우선)
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
  }, []);

  const onShouldStart = useCallback((req: any) => {
    const nextUrl: string = req?.url ?? '';
    if (!isHttp(nextUrl)) {
      // 카카오톡 등 외부 스킴은 외부로 넘김
      Linking.openURL(nextUrl).catch(() => {});
      return false;
    }
    try {
      const host = new URL(nextUrl).host;
      // 신뢰 도메인이면 WebView 내부에서 계속 열기
      if (TRUSTED_HOSTS.includes(host)) return true;
    } catch {
      // URL 파싱 실패 시 외부로 넘김
    }
    Linking.openURL(nextUrl).catch(() => {});
    return false;
  }, []);

  if (!targetUrl) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* 간단한 헤더 */}
      <View
        style={{
          height: 48,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        }}
      >
        <View style={{ width: 48 }}>
          {/* Back 버튼 */}
          <ActivityIndicator animating={false} />
        </View>
        <View>
          {/* 가운데 타이틀 */}
          <ActivityIndicator animating={false} />
        </View>
        <View style={{ width: 48 }} />
      </View>

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
        // 새 창 열기 억제 (target=_blank 등)
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={onShouldStart}
        // 필요 시 UA 커스터마이징
        // userAgent="LeenkApp/1.0 (ReactNative WebView)"
        // 메시지 브릿지 필요 시
        onMessage={(e: WebViewMessageEvent) => {
          // window.ReactNativeWebView.postMessage(...) 처리
          console.log('WEBVIEW_MESSAGE:', e.nativeEvent.data);
        }}
        // iOS에서 스크롤 바운스 방지 원하면
        // bounces={false}
      />
    </SafeAreaView>
  );
}
