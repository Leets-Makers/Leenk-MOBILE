import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';
import { useToastStore } from '@/stores/toastStore';
import {
  width,
  height,
  fontSize,
  radius,
  fonts,
  lineHeight,
} from '@/theme/globalStyles';
import colors from '@/theme/color';
import SuccessIcon from '@/assets/images/ic_toast_check.svg';
import ErrorIcon from '@/assets/images/ic_toast_alert.svg';

const Toast = () => {
  const { visible, message, type, hideToast } = useToastStore();
  const opacity = useRef(new Animated.Value(0)).current;

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
    <Wrapper style={{ opacity }}>
      <ToastBox $backgroundColor={backgroundColor}>
        <IconComponent width={20 * width} height={20 * height} />
        <ToastText>{message}</ToastText>
      </ToastBox>
    </Wrapper>
  );
};

export default Toast;

const Wrapper = styled(Animated.View)`
  position: absolute;
  bottom: ${114 * height}px;
  left: 0;
  right: 0;
  align-items: center;
  z-index: 9999;
`;

const ToastBox = styled.View<{ $backgroundColor: string }>`
  flex-direction: row;
  align-items: center;
  gap: ${12 * width}px;
  border-radius: ${radius.full}px;
  padding: ${4 * height}px ${5 * width}px;
  width: 90%;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
`;

const ToastText = styled.Text`
  color: ${colors.white};
  font-size: ${fontSize.md}px;
  font-family: ${fonts.Regular};
  line-height: ${lineHeight.m}px;
`;
