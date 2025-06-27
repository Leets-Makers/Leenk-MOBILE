import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import HeartIcon from './HeartIcon';

interface Props {
  onComplete: () => void;
  color: string;
}

const AnimatedContainer = styled(Animated.View)`
  position: absolute;
  bottom: 60px;
  left: 50%;
`;

export default function FloatingHeart({ onComplete, color }: Props) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(Math.random() * 60 - 30); // -30 ~ +30 사이 랜덤 시작 위치
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.6, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );

    // 위로 올라가기
    translateY.value = withTiming(-150, { duration: 1000 });

    // 좌우 흔들림 반복
    translateX.value = withRepeat(
      withSequence(
        withTiming(translateX.value + 20, { duration: 300 }),
        withTiming(translateX.value - 10, { duration: 300 }),
      ),
      5, // 5번 반복
      true, // 되돌아오기
    );

    // 사라짐
    opacity.value = withTiming(0, { duration: 1000 }, (finished) => {
      if (finished) runOnJS(onComplete)();
    });
  }, []);

  return (
    <AnimatedContainer style={animatedStyle}>
      <HeartIcon width={28} height={28} fill={color} />
    </AnimatedContainer>
  );
}
