import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { height } from '@/theme/globalStyles';

interface GradientOverlayProps {
  type: 'top' | 'bottom';
  style?: StyleProp<ViewStyle>;
  colors?: string[];
  heightValue?: number;
}

export default function GradientOverlay({
  type,
  style,
  colors,
  heightValue,
}: GradientOverlayProps) {
  const defaultColors =
    type === 'top'
      ? ['rgba(0,0,0,0.55)', 'transparent']
      : ['transparent', 'rgba(0,0,0,0.6)'];

  return (
    <LinearGradient
      colors={
        (colors as [string, string, ...string[]]) ||
        (defaultColors as [string, string, ...string[]])
      }
      style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          height: heightValue || 160 * height,
          zIndex: 10,
          [type]: 0,
        },
        style,
      ]}
    />
  );
}
