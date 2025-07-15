import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useBlockBackHandler = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // iOS: 제스처 및 헤더 뒤로가기 제거
    navigation.setOptions?.({
      gestureEnabled: false,
      headerBackVisible: false,
    });

    // Android: 하드웨어 뒤로가기 차단
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => subscription.remove();
  }, [navigation]);
};
