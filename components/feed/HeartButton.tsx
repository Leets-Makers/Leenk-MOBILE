import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import FloatingHeart from './FloatingHeart';
import HeartIcon from './HeartIcon';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { radius, width, height } from '@/theme/globalStyles';
import { getNumberWithComma } from '@/utils';
import { Badge } from '@/components';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// const COLORS = [
//   '#f472b6', // pink
//   '#fbbf24', // yellow
//   '#34d399', //  green
//   '#38bdf8', // blue
//   '#a78bfa', // purple
//   '#fb7185', // rose
//   '#60a5fa', // sky blue
//   '#f87171', // red
// ];

// const getRandomColor = () => {
//   const index = Math.floor(Math.random() * COLORS.length);
//   return COLORS[index];
// };

type HeartData = {
  id: number;
  color?: string;
};

export default function HeartButton() {
  const [hearts, setHearts] = useState<HeartData[]>([]);
  const [count, setCount] = useState<number>(0);

  const heartScale = useSharedValue(1);
  const outlineScale = useSharedValue(0.8);
  const outlineOpacity = useSharedValue(0);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const outlineAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: outlineScale.value }],
    opacity: outlineOpacity.value,
  }));

  const handlePress = () => {
    //햅틱 추가
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    outlineOpacity.value = 0.5;
    outlineScale.value = 0.8;

    outlineScale.value = withTiming(1.8, { duration: 400 });
    outlineOpacity.value = withTiming(0, { duration: 400 });

    heartScale.value = withSequence(
      withTiming(0.85, { duration: 100 }),
      withTiming(1.15, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );

    //하트 생성
    const newHeart: HeartData = {
      id: Date.now(),
      // color: getRandomColor(),
    };
    setHearts((prev) => [...prev, newHeart]);
    setCount((prev) => prev + 1);
  };

  const handleComplete = (id: number) => {
    setHearts((prev) => prev.filter((heart) => heart.id !== id));
  };

  return (
    <View>
      {hearts.map((heart) => (
        <FloatingHeartWrapper key={heart.id}>
          <FloatingHeart
            color={heart.color}
            onComplete={() => handleComplete(heart.id)}
          />
        </FloatingHeartWrapper>
      ))}
      <Pressable
        onPress={handlePress}
        style={{
          bottom: 16,
          alignSelf: 'center',
        }}
      >
        <HeartWithBadge>
          <Circle>
            <OutlineWrapper style={outlineAnimatedStyle}>
              <HeartIcon width={28} height={28} fill="#E4387E" />
            </OutlineWrapper>

            {/* 기본 하트 (항상 보이는 고정 아이콘) */}
            <Animated.View style={heartStyle}>
              <HeartIcon width={28} height={28} fill="#E4387E" />
            </Animated.View>
          </Circle>
          <BadgeWrapper>
            <Badge label={getNumberWithComma(count)} variant="white" />
          </BadgeWrapper>
        </HeartWithBadge>
      </Pressable>
    </View>
  );
}

const HeartWithBadge = styled.View`
  align-items: center;
`;

const Circle = styled.View`
  width: ${44 * width}px;
  height: ${44 * height}px;
  background-color: ${colors.white};
  border-radius: ${radius.full}px;
  align-items: center;
  justify-content: center;
`;

const BadgeWrapper = styled.View`
  margin-top: ${8 * height}px;
`;

const FloatingHeartWrapper = styled.View`
  position: absolute;
  bottom: ${9 * height}px;
  z-index: 100;
`;

const OutlineWrapper = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;
