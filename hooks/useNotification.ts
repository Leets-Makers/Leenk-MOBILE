import { useEffect } from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { requestNotificationPermission } from './usePushNotification';
import { useInAppNotification } from '@/components/InAppNotificationProvider';
import { handleNotificationOpen } from '@/utils/notificationRouter';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('[FCM][bg]', summarize(remoteMessage));
});

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
      handleNotificationOpen(m.messageId ?? undefined, m.data);
    });

    // 3) Cold start(앱 종료) 상태에서 알림으로 시작
    (async () => {
      const initial = await messaging().getInitialNotification();
      if (initial) {
        // console.log('[FCM][cold]', summarize(initial));
        handleNotificationOpen(initial.messageId ?? undefined, initial.data);
      }
    })();

    return () => {
      unsubMsg();
      unsubOpened();
    };
  }, []);

  return null;
}
