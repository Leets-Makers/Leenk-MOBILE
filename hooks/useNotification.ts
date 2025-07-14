import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { requestNotificationPermission } from './usePushNotification';

export default function NotificationInitializer() {
  useEffect(() => {
    // 권한 요청 및 토큰 획득
    requestNotificationPermission();

    // 포그라운드 알림 수신 리스너 (앱 켜진 상태)
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground 알림:', remoteMessage);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
}
