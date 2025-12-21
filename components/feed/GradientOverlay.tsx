import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { height } from '@/theme/globalStyles';

interface GradientOverlayProps {
  type: 'top' | 'bottom';
  style?: StyleProp<ViewStyle>;
  colors?: [string, string];
  heightValue?: number;
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
  zIndex?: number;
  locations?: [number, number];
}

const TOP_DEFAULT = ['rgba(0,0,0,0.55)', 'transparent'] as const;
const BOTTOM_DEFAULT = ['rgba(0,0,0,0.6)', 'transparent'] as const;

export default function GradientOverlay({
  type,
  style,
  colors,
  heightValue,
  pointerEvents,
  zIndex = 1,
  locations,
}: GradientOverlayProps) {
  const isTop = type === 'top';

  // colors가 비어있거나 유효하지 않으면 기본값 사용
  const gradientColors =
    colors && colors.length >= 2
      ? colors
      : (isTop ? TOP_DEFAULT : BOTTOM_DEFAULT);

  return (
    <LinearGradient
      pointerEvents={pointerEvents ?? 'none'}
      colors={gradientColors as [string, string]}
      start={{ x: 0.5, y: isTop ? 0 : 1 }}
      end={{ x: 0.5, y: isTop ? 1 : 0 }}
      locations={locations}
      style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          height: heightValue ?? 160 * height,
          zIndex,
          ...(isTop ? { top: 0 } : { bottom: 0 }),
        },
        style,
      ]}
    />
  );
}
