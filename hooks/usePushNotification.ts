import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { patchNotificationsToken } from '@/api/users/notification.api';
import { saveFcmToken } from '@/utils/tokenStorage';

export async function requestNotificationPermission() {
  // Android 13 이상 알림 권한 요청
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
      // console.log('알림 권한 거부됨');
      return null;
    }
  }

  // Firebase 권한 요청
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    // if (__DEV__) console.log('FCM 권한 요청 거부됨');
    return null;
  }

  // FCM 토큰 가져오기
  const token = await messaging().getToken();
  await saveFcmToken(token);
  // console.log(token, 'fcmToken');

  // registerFcmToken();
  return token;
}
