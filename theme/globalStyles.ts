import { Dimensions, Platform } from 'react-native';

// 디자인 기준 사이즈
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

// 실제 기기 사이즈
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 웹에서는 비율 고정, 모바일은 사이즈 스케일링
export const width = Platform.OS === 'web' ? 1 : SCREEN_WIDTH / DESIGN_WIDTH;

export const height = Platform.OS === 'web' ? 1 : SCREEN_HEIGHT / DESIGN_HEIGHT;

// 폰트 크기
export const fontSize = {
  xs: Math.round(10 * width),
  sm: Math.round(12 * width),
  md: Math.round(14 * width),
  lg: Math.round(16 * width),
  xl: Math.round(18 * width),
  '2xl': Math.round(20 * width),
  '3xl': Math.round(22 * width),
  '4xl': Math.round(24 * width),
  '5xl': Math.round(32 * width),
};

// 줄 간격 (lineHeight)
export const lineHeight = {
  s: Math.round(16 * height),
  m: Math.round(22 * height),
  l: Math.round(24 * height),
  xl: Math.round(32 * height),
};

// 자간
export const letterSpacing = {
  tight: '-2%',
};

// 폰트 패밀리
export const fonts = {
  ExtraBold: 'NanumSquare-ExtraBold',
  Bold: 'NanumSquare-Bold',
  Regular: 'NanumSquare-Regular',
};

// 테두리 반경 (radius)
export const radius = {
  xs: Math.round(8 * width),
  sm: Math.round(12 * width),
  md: Math.round(16 * width),
  lg: Math.round(20 * width),
  full: Math.round(99 * width),
};

// 테두리 굵기 (stroke)
export const stroke = {
  thin: Math.round(1 * width),
  medium: Math.round(2 * width),
  thick: Math.round(3 * width),
};
