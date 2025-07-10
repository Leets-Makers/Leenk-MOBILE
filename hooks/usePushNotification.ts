import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useToastStore } from '@/stores/toastStore';

export async function registerForPushNotificationsAsync() {
  const { showToast } = useToastStore();
  if (!Device.isDevice) {
    showToast('실제 기기에서만 푸시 알림을 사용할 수 있습니다!', 'error');
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    showToast('푸시 알림 권한이 필요합니다!', 'error');
    return;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    showToast('Project ID가 없습니다', 'error');
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  //TODO: 서버에 저장?
  console.log('Push Token:', token);

  return token;
}
