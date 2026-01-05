import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { router, usePathname, type Href } from 'expo-router';
import colors from '@/theme/color';
import { LeenkIcon, LogoNotify } from '@/assets';
import styled from 'styled-components/native';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import { BlurView } from 'expo-blur';

type InAppPayload = {
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  duration?: number;
};

type Ctx = {
  show: (p: InAppPayload) => void;
  hide: () => void;
};

const Ctx = createContext<Ctx | null>(null);

const ROUTES = {
  leenk: '/leenk/[id]' as const,
  feed: '/feed/[id]' as const,
};

const BLOCKED_PATHS = ['/', '/signup'];

export const isBlockedRoute = (pathname: string) =>
  BLOCKED_PATHS.some((blocked) => blocked === pathname);

// FCM data → 앱 내 라우팅
function navigateFromData(raw?: Record<string, unknown>) {
  const d = raw ?? {};

  // 알림 클릭시 해당 게시물로 이동
  const pathRaw = String(d['path'] ?? d['type'] ?? '').toLowerCase();
  const id = String(d['pathId'] ?? d['id'] ?? '').trim();
  const isLeenk =
    pathRaw === 'leenks' || pathRaw === 'leenk' || pathRaw === 'link';
  const isFeed = pathRaw === 'feeds' || pathRaw === 'feed';

  if (!id) return;
  if (isLeenk) {
    router.push({ pathname: ROUTES.leenk, params: { id } });
  } else if (isFeed) {
    router.push({ pathname: ROUTES.feed, params: { id } });
  }
}

export function InAppNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [payload, setPayload] = useState<InAppPayload | null>(null);
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const blocked = isBlockedRoute(pathname);

  // 애니메이션: 위에서 아래로 슬라이드 인/아웃
  const ty = useSharedValue(-200);

  const clearTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const hide = useCallback(() => {
    clearTimer();
    ty.value = withTiming(-200, { duration: 200 }, () => {
      runOnJS(setVisible)(false);
      runOnJS(setPayload)(null);
    });
  }, []);

  const show = useCallback(
    (p: InAppPayload) => {
      clearTimer();
      setPayload(p);
      setVisible(true);
      ty.value = withTiming(0, { duration: 220 });
      const d = p.duration ?? 5000;
      hideTimerRef.current = setTimeout(() => hide(), d);
    },
    [hide],
  );

  React.useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  const onOpen = useCallback(() => {
    if (payload?.data) navigateFromData(payload.data);
    hide();
  }, [payload, hide]);

  const ctxValue = useMemo<Ctx>(() => ({ show, hide }), [show, hide]);

  const aStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
  }));

  const bannerText = payload?.body ?? '알림';

  return (
    <Ctx.Provider value={ctxValue}>
      {children}

      {visible && !blocked && (
        <Overlay pointerEvents="box-none">
          <SafeAreaView edges={['top']} style={{ pointerEvents: 'box-none' }}>
            <CardWrap style={aStyle}>
              <Card onPress={onOpen} accessibilityRole="button">
                {/* iOS: 블러 + 살짝 회색 오버레이, Android: 반투명 폴백 */}
                {Platform.OS === 'ios' ? (
                  <>
                    <IOSBlur intensity={40} tint="light" />
                    <FrostOverlay />
                  </>
                ) : (
                  <AndroidFallback />
                )}

                <IconBadge>
                  <LogoNotify width={24 * width} />
                </IconBadge>
                <BannerText>{bannerText}</BannerText>
              </Card>
            </CardWrap>
          </SafeAreaView>
        </Overlay>
      )}
    </Ctx.Provider>
  );
}

export function useInAppNotification() {
  const v = useContext(Ctx);
  if (!v) throw new Error('InAppNotificationProvider로 감싸야 해요.');
  return v;
}

const Overlay = styled(Animated.View)`
  position: absolute;
  inset: 0px;
  z-index: 9999;
`;

const CardWrap = styled(Animated.View)`
  padding: 88px 20px 0 20px;
`;

const Card = styled.Pressable`
  position: relative;
  overflow: hidden;
  flex-direction: row;
  align-items: center;
  padding: ${9 * height}px ${8 * width}px;
  border-radius: ${radius.sm}px;
  background-color: transparent;
`;

/* iOS 블러 */
const IOSBlur = styled(BlurView)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

/* 유리질감 강화용 얇은 회색 레이어(iOS 전용) */
const FrostOverlay = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(120, 120, 120, 0.35);
`;

/* Android 폴백: 반투명 회색 배경 */
const AndroidFallback = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #0000004d;
`;

const IconBadge = styled.View`
  align-items: center;
  justify-content: center;
  margin-right: ${12 * width}px;
`;

const BannerText = styled.Text`
  font-family: ${fonts.Regular};
  font-size: ${fontSize.md}px;
  font-weight: ${Platform.select({ ios: '600', android: '700' })};
  color: ${colors.text[5]};
  line-height: ${lineHeight.m}px;
`;
