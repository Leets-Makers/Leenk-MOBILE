import { useEffect } from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  EmitterSubscription,
} from 'react-native';
import { useRef } from 'react';

export default function useKeyboardAnimation(offset = 10) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener: EmitterSubscription = Keyboard.addListener(
      showEvent,
      (e) => {
        Animated.timing(translateY, {
          toValue: -e.endCoordinates.height - offset,
          duration: Platform.OS === 'ios' ? e.duration : 250,
          useNativeDriver: true,
        }).start();
      },
    );

    const hideListener: EmitterSubscription = Keyboard.addListener(
      hideEvent,
      (e) => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? e.duration : 250,
          useNativeDriver: true,
        }).start();
      },
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [translateY, offset]);

  return translateY;
}
