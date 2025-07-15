import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';

export const useBlockBackHandler = (shouldBlock: boolean): void => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  useFocusEffect(
    useCallback(() => {
      if (!shouldBlock) return;

      // iOS: 뒤로가기 제스처 및 버튼 막기
      if (navigation.setOptions) {
        navigation.setOptions({
          gestureEnabled: false,
          headerBackVisible: false,
        });
      }

      // Android: 하드웨어 뒤로가기 막기
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      return () => {
        subscription.remove();
      };
    }, [navigation, shouldBlock]),
  );
};
