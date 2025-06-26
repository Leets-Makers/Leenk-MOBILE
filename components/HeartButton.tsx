import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import FloatingHeart from './FloatingHeart'; // 실제 경로에 맞게 조정
import HeartIcon from './HeartIcon';

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

  const handlePress = () => {
    const newHeart: HeartData = {
      id: Date.now(),
      color: getRandomColor(),
    };
    setHearts((prev) => [...prev, newHeart]);
  };

  const handleComplete = (id: number) => {
    setHearts((prev) => prev.filter((heart) => heart.id !== id));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {hearts.map((heart) => (
        <FloatingHeart
          key={heart.id}
          color={heart.color}
          onComplete={() => handleComplete(heart.id)}
        />
      ))}
      <Pressable
        onPress={handlePress}
        style={{
          position: 'absolute',
          bottom: 30,
          alignSelf: 'center',
        }}
      >
        <HeartIcon width={36} height={36} fill="#E4387E" />
      </Pressable>
    </View>
  );
}
