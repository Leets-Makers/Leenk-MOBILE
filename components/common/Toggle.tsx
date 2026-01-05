import styled from 'styled-components/native';
import { width, height } from '@/theme/globalStyles';
import colors from '@/theme/color';
import { Pressable, Animated } from 'react-native';
import { useRef, useEffect } from 'react';

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

export default function Toggle({ isOn, onToggle }: ToggleProps) {
  const anim = useRef(new Animated.Value(isOn ? 1 : 0)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // 최초 진입 시 애니메이션 없이 바로 반영
      anim.setValue(isOn ? 1 : 0);
      isFirstRender.current = false;
      return;
    }

    Animated.timing(anim, {
      toValue: isOn ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isOn, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15 * width], // Thumb 이동 거리
  });

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.gray[400], colors.primary],
  });

  return (
    <ToggleWrapper onPress={onToggle}>
      <AnimatedTrack style={{ backgroundColor: trackColor }}>
        <AnimatedThumb
          style={{
            transform: [{ translateX }],
          }}
        />
      </AnimatedTrack>
    </ToggleWrapper>
  );
}

const ToggleWrapper = styled(Pressable)`
  width: ${36 * width}px;
  height: ${21 * height}px;
  justify-content: center;
`;

const AnimatedTrack = styled(Animated.View)`
  width: 100%;
  height: 100%;
  border-radius: ${100 * height}px;
  padding: 0 ${2.5 * width}px;
  justify-content: center;
`;

const AnimatedThumb = styled(Animated.View)`
  width: ${16 * height}px;
  height: ${16 * height}px;
  border-radius: ${100 * height}px;
  background-color: ${colors.white};
`;
