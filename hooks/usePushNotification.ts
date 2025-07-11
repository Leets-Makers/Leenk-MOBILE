import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { patchNotificationsToken } from '@/api/users/notification.api';

export async function requestNotificationPermission() {
  // Android 13 이상 알림 권한 요청
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('알림 권한 거부됨');
      return null;
    }

    console.log('알림 권한 허용됨');
  }

  // Firebase 권한 요청
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    console.log('FCM 권한 요청 거부됨');
    return null;
  }

  console.log('FCM 권한 요청 성공');

  // FCM 토큰 가져오기
  const token = await messaging().getToken();
  console.log('FCM Token:', token);

  return token;
}
