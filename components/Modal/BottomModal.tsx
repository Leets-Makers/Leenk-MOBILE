import React, { useEffect, useRef } from 'react';
import { Modal, Animated, Dimensions, Pressable } from 'react-native';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { height, width } from '@/theme/globalStyles';
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomModal({ visible, onClose, children }: Props) {
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
      <TouchableWithoutFeedback onPress={onClose}>
        <Overlay />
      </TouchableWithoutFeedback>
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
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
`;

const AnimatedContainer = styled(Animated.View)`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${colors.white};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: ${22 * height}px ${16 * width}px ${16 * height}px ${16 * width}px;
  z-index: 2;
`;
