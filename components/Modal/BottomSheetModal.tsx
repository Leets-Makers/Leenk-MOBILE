import React, { useEffect, useRef } from 'react';
import { Modal, Animated } from 'react-native';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { height, SCREEN_HEIGHT, width } from '@/theme/globalStyles';

interface Props {
  visible: boolean;
  dismissOnBackdropPress?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export default function BottomSheetModal({
  visible,
  dismissOnBackdropPress = false,
  onClose,
  children,
}: Props) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      <Overlay onPress={dismissOnBackdropPress ? onClose : undefined} />
      <AnimatedContainer style={{ transform: [{ translateY }] }}>
        {children}
      </AnimatedContainer>
    </Modal>
  );
}

const Overlay = styled.Pressable`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const AnimatedContainer = styled(Animated.View)`
  position: absolute;
  bottom: ${10 * height}px;
  left: ${10 * width}px;
  right: ${10 * width}px;
  background-color: ${colors.white};
  border-radius: 24px;
  padding: ${22 * height}px ${16 * width}px ${16 * height}px ${16 * width}px;
  z-index: 2;
`;
