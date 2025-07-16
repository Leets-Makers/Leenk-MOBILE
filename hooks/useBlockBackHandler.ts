// hooks/useBlockBackHandler.ts
import { useCallback, useRef } from 'react';
import { BackHandler, ToastAndroid, Platform } from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import { useToastStore } from '@/stores/toastStore';

interface BackHandlerOptions {
  block: boolean;
  exitOnDoubleBack?: boolean;
}

export const useBlockBackHandler = ({
  block,
  exitOnDoubleBack = false,
}: BackHandlerOptions): void => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const lastBackPressed = useRef<number | null>(null);
  const { showToast } = useToastStore();

  useFocusEffect(
    useCallback(() => {
      if (!block) return;

      navigation.setOptions?.({
        gestureEnabled: false,
        headerBackVisible: false,
      });

      const onBackPress = () => {
        if (!exitOnDoubleBack) return true;

        const now = Date.now();
        if (lastBackPressed.current && now - lastBackPressed.current < 2000) {
          BackHandler.exitApp();
          return true;
        }

        lastBackPressed.current = now;
        showToast('한 번 더 누르면 종료됩니다.', 'success');
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        subscription.remove();
      };
    }, [block, exitOnDoubleBack, navigation]),
  );
};
