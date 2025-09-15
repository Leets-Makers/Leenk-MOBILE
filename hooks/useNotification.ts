import { useEffect } from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { router, type Href } from 'expo-router';
import { requestNotificationPermission } from './usePushNotification';
import { useInAppNotification } from '@/components/InAppNotificationProvider';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('[FCM][bg]', summarize(remoteMessage));
});

const ROUTES = {
  leenk: '/leenk/[id]' as const,
  feed: '/feed/[id]' as const,
};

// 전체 데이터 확인용 로그
function summarize(msg: FirebaseMessagingTypes.RemoteMessage) {
  return {
    phase: 'log',
    os: Platform.OS,
    msgId: msg.messageId ?? null,
    title: msg.notification?.title ?? null,
    body: msg.notification?.body ?? null,
    data: msg.data ?? null,
    sentTime: msg.sentTime ?? null,
  };
}

// 받은 메시지 → 해당 화면으로 이동 (탭/냉시작에서만 호출)
function navigateFromMessage(msg: FirebaseMessagingTypes.RemoteMessage) {
  const d = msg.data ?? {};

  // 지금 들어오는 키에 맞춰 읽기: path + pathId
  const pathRaw = (d.path ?? d.type ?? '').toString().toLowerCase();
  const id = (d.pathId ?? d.id ?? '').toString().trim();

  // 단/복수 표기 모두 허용해서 매핑
  const isLeenk =
    pathRaw === 'leenks' || pathRaw === 'leenk' || pathRaw === 'link';
  const isFeed = pathRaw === 'feeds' || pathRaw === 'feed';

  if (!id) {
    // console.log('[FCM] id가 없어서 상세로 이동할 수 없어요:', d);
    return;
  }

  if (isLeenk) {
    router.push({ pathname: ROUTES.leenk, params: { id } });
    return;
  }
  if (isFeed) {
    router.push({ pathname: ROUTES.feed, params: { id } });
    return;
  }

  // console.log('[FCM] 알 수 없는 path:', pathRaw, d);
}

export default function NotificationInitializer() {
  const { show } = useInAppNotification();

  useEffect(() => {
    // 권한/토큰
    requestNotificationPermission();

    // 1) 포그라운드 수신
    const unsubMsg = messaging().onMessage(async (m) => {
      // console.log('[FCM][fg]', {
      //   title: m.notification?.title,
      //   body: m.notification?.body,
      //   data: m.data,
      // });

      show({
        title: m.notification?.title ?? '알림',
        body: m.notification?.body ?? '',
        data: m.data ?? {},
        duration: 5000,
      });
    });

    // 2) 알림 "탭"해서 앱 열림(백→포그라운드)
    const unsubOpened = messaging().onNotificationOpenedApp((m) => {
      // console.log('[FCM][tap]', summarize(m));
      navigateFromMessage(m);
    });

    // 3) Cold start(앱 종료) 상태에서 알림으로 시작
    (async () => {
      const initial = await messaging().getInitialNotification();
      if (initial) {
        // console.log('[FCM][cold]', summarize(initial));
        navigateFromMessage(initial);
      }
    })();

    return () => {
      unsubMsg();
      unsubOpened();
    };
  }, []);

  return null;
}
