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
    if (__DEV__) console.log('FCM 권한 요청 거부됨');
    return null;
  }

  console.log('FCM 권한 요청 성공');

  // FCM 토큰 가져오기
  const token = await messaging().getToken();
  await saveFcmToken(token);

  // 프로필 페이지 없이 시작할 경우 해당 코드 활성화 시키기
  // const registerFcmToken = async () => {
  //   if (!token) return;
  //   try {
  //     await patchNotificationsToken(token);
  //     console.log('FCM 토큰 서버 등록 성공');
  //   } catch (error) {
  //     console.error('FCM 토큰 서버 등록 실패:', error);
  //   }
  // };

  // registerFcmToken();
  return token;
}
