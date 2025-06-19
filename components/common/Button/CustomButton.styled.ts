import styled from 'styled-components/native';
import { ButtonSize, ButtonVariant } from './CustomButton';
import { Pressable, Text } from 'react-native';
import { width, height, fonts } from '@/theme/globalStyles';

export const StyledButton = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const StyledButtonText = styled(Text)<{ variant?: ButtonVariant }>`
  font-size: 14px;
  font-weight: 700;
  font-family: ${fonts.Regular};
`;

export const sizeStyles: Record<
  ButtonSize,
  { height: number; paddingHorizontal: number; paddingVertical: number }
> = {
  xs: {
    height: 32 * height,
    paddingHorizontal: 12 * width,
    paddingVertical: 8 * height,
  },
  sm: {
    height: 38 * height,
    paddingHorizontal: 16 * width,
    paddingVertical: 10 * height,
  },
  md: {
    height: 44 * height,
    paddingHorizontal: 20 * width,
    paddingVertical: 12 * height,
  },
  lg: {
    height: 52 * height,
    paddingHorizontal: 24 * width,
    paddingVertical: 14 * height,
  },
  xl: {
    height: 60 * height,
    paddingHorizontal: 28 * width,
    paddingVertical: 16 * height,
  },
};
