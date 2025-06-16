import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useToastStore } from '@/stores/toastStore';
import colors from '@/theme/color';
import SuccessIcon from '@/assets/icons/ic_check.svg';
import ErrorIcon from '@/assets/icons/ic_alert.svg';

const Toast = () => {
  const { visible, message, type, hideToast } = useToastStore();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const timeout = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => hideToast());
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!visible) return null;

  const backgroundColor =
    type === 'success' ? colors.violet[100] : colors.pink[100];
  const iconColor = type === 'success' ? colors.violet[500] : colors.pink[500];

  const IconComponent = type === 'success' ? SuccessIcon : ErrorIcon;

  return (
    <Animated.View style={[styles.wrapper, { opacity }]}>
      <View style={[styles.toast, { backgroundColor }]}>
        <IconComponent width={20} height={20} stroke={iconColor} />
        <Text style={[styles.text, { color: iconColor }]}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '90%',
  },
  text: {
    fontSize: 14,
    fontFamily: 'NanumSquareNeo-Regular',
  },
});

export default Toast;
