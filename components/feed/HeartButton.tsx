import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import FloatingHeart from './FloatingHeart';
import HeartIcon from './HeartIcon';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { radius, width, height } from '@/theme/globalStyles';
import { getNumberWithComma } from '@/utils';
import { Badge } from '@/components';

const COLORS = [
  '#f472b6', // pink
  '#fbbf24', // yellow
  '#34d399', //  green
  '#38bdf8', // blue
  '#a78bfa', // purple
  '#fb7185', // rose
  '#60a5fa', // sky blue
  '#f87171', // red
];

const getRandomColor = () => {
  const index = Math.floor(Math.random() * COLORS.length);
  return COLORS[index];
};

type HeartData = {
  id: number;
  color: string;
};

export default function HeartButton() {
  const [hearts, setHearts] = useState<HeartData[]>([]);
  const [count, setCount] = useState<number>(0);

  const handlePress = () => {
    const newHeart: HeartData = {
      id: Date.now(),
      color: getRandomColor(),
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
            <HeartIcon width={28} height={28} fill="#E4387E" />
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
  bottom: ${54 * height}px;
`;
