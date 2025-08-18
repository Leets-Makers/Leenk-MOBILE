import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function useIOSKeyboardSpacer(extraGap: number) {
  const [bottom, setBottom] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const show = Keyboard.addListener('keyboardWillShow', (e) => {
      const h = e.endCoordinates?.height ?? 0;
      setBottom(Math.max(0, h - insets.bottom - extraGap));
    });
    const hide = Keyboard.addListener('keyboardWillHide', () => setBottom(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, [insets.bottom, extraGap]);

  return bottom;
}
