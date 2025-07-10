import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/hooks/usePushNotification';

export default function NotificationInitializer() {
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      //  서버에 token 전송
    });

    // 앱이 실행 중일 때 알림 수신
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // 알림 수신 시
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('Foreground 알림:', notification);
      });

    // 알림 클릭 시
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('클릭한 알림:', response);
        const data = response.notification.request.content.data;
        // data 값으로 화면 이동 가능
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return null;
}
