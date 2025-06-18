import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useToastStore } from '@/stores/toastStore';
import colors from '@/theme/color';
import SuccessIcon from '@/assets/images/ic_toast_check.svg';
import ErrorIcon from '@/assets/images/ic_toast_alert.svg';

const Toast = () => {
  const { visible, message, type, hideToast } = useToastStore();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timeout = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => hideToast());
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!visible) return null;

  const backgroundColor = type === 'success' ? '#B085F999' : '#F180AE99';

  const IconComponent = type === 'success' ? SuccessIcon : ErrorIcon;

  return (
    <Animated.View style={[styles.wrapper, { opacity }]}>
      <View style={[styles.toast, { backgroundColor }]}>
        <IconComponent width={20} height={20} />
        <Text style={[styles.text]}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 114,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 99,
    paddingHorizontal: 5,
    paddingVertical: 4,
    width: '90%',
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'NanumSquareNeo-Regular',
    fontWeight: 700,
    lineHeight: 22,
  },
});

export default Toast;
