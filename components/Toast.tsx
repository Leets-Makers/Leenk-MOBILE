import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useToastStore } from '@/stores/toastStore';
import { width, height, fontSize, radius, fonts } from '@/theme/globalStyles';
import SuccessIcon from '@/assets/images/ic_toast_check.svg';
import ErrorIcon from '@/assets/images/ic_toast_alert.svg';
import { lineHeight } from '@/theme/globalStyles';
import colors from '@/theme/color';

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

  const backgroundColor =
    type === 'success'
      ? `${colors.primaryLight}99`
      : `${colors.secondaryLight}99`;
  const IconComponent = type === 'success' ? SuccessIcon : ErrorIcon;

  return (
    <Animated.View style={[styles.wrapper, { opacity }]}>
      <View style={[styles.toast, { backgroundColor }]}>
        <IconComponent width={20 * width} height={20 * width} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 114 * height,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 * width,
    borderRadius: radius.full,
    paddingHorizontal: 12 * width,
    paddingVertical: 10 * height,
    width: '90%',
  },
  text: {
    color: colors.white,
    fontSize: fontSize.md,
    fontFamily: fonts.Regular,
    lineHeight: lineHeight.m,
    fontWeight: '700',
  },
});

export default Toast;
