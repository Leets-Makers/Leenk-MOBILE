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
import { router, type Href } from 'expo-router';
import colors from '@/theme/color';
import { LeenkIcon } from '@/assets';
import styled from 'styled-components/native';
import { height, radius, width } from '@/theme/globalStyles';

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

      {visible && (
        <Overlay pointerEvents="box-none">
          <SafeAreaView edges={['top']} style={{ pointerEvents: 'box-none' }}>
            <CardWrap style={aStyle}>
              <Card onPress={onOpen} accessibilityRole="button">
                <IconBadge>
                  <LeenkIcon stroke={colors.primary} width={16} height={16} />
                </IconBadge>
                <TextWrap>
                  <BannerText numberOfLines={1}>{bannerText}</BannerText>
                </TextWrap>
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
  padding: 8px 12px 0 12px;
`;

const Card = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding: ${9 * height}px ${8 * width}px;
  border-radius: ${radius.sm}px;

  background-color: #0000004d;

  ${Platform.select({
    ios: `
      shadow-color: ${colors.black};
      shadow-opacity: 0.12;
      shadow-radius: 10px;
      shadow-offset: 0px 6px;
    `,
    android: `
      elevation: 4;
    `,
  }) as any}
`;

const IconBadge = styled.View`
  width: ${16 * width}px;
  height: ${16 * width}px;
  border-radius: 12px;
  background-color: ${colors.white};
  align-items: center;
  justify-content: center;
  margin-left: ${12 * width};
`;

const TextWrap = styled.View`
  flex: 1;
`;

const BannerText = styled.Text`
  font-size: 14px;
  font-weight: ${Platform.select({ ios: '600', android: '700' })};
  color: ${colors.white};
`;
