// 📁 config/globalStyles.ts

import { Dimensions } from 'react-native';

// 디자인 기준 사이즈
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

// 실제 기기 사이즈
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 비율 스케일링
export const width = SCREEN_WIDTH / DESIGN_WIDTH;
export const height = SCREEN_HEIGHT / DESIGN_HEIGHT;

// 폰트 크기 (디자인 기준 px × width 배수로 사용)
export const fontSize = {
  xs: 10 * width,
  sm: 12 * width,
  md: 14 * width,
  lg: 16 * width,
  xl: 18 * width,
  '2xl': 20 * width,
  '3xl': 22 * width,
  '4xl': 24 * width,
  '5xl': 32 * width,
};

// 줄 간격
export const lineHeight = {
  s: 16 * height,
  m: 22 * height,
  l: 24 * height,
  xl: 32 * height,
};

// 자간
export const letterSpacing = {
  tight: '-2%',
};

export const fonts = {
  ExtraBold: 'SpoqaHanSansNeo-ExtraBold',
  Bold: 'SpoqaHanSansNeo-Bold',
  Regular: 'SpoqaHanSansNeo-Regular',
  Light: 'SpoqaHanSansNeo-Light',
};

export const radius = {
  xs: 8 * width,
  sm: 12 * width,
  md: 16 * width,
  lg: 20 * width,
  full: 99 * width,
};

export const stroke = {
  thin: 1 * width,
  medium: 2 * width,
  thick: 3 * width,
};
