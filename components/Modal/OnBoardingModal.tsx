import { useEffect, useRef } from 'react';
import { Animated, Modal } from 'react-native';
import styled from 'styled-components/native';
import { height, radius, SCREEN_HEIGHT, width } from '@/theme/globalStyles';
import { OnBoarding } from '@/components';
import colors from '@/theme/color';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function OnBoardingModal({ visible, onClose }: Props) {
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
      <Container>
        <AnimatedContent style={{ transform: [{ translateY }] }}>
          <OnBoarding onClose={onClose} />
        </AnimatedContent>
      </Container>
    </Modal>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: transparent;
`;

const AnimatedContent = styled(Animated.View)`
  height: ${650 * height}px;
  background-color: ${colors.white};
  border-radius: ${radius.lg}px;
  overflow: hidden;
  margin: 0 ${8 * width}px ${32 * height}px;
`;
