import styled, { css } from 'styled-components/native';
import { ButtonSize, ButtonVariant } from './CustomButton';
import { Pressable, Text } from 'react-native';

export const StyledButton = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const StyledButtonText = styled(Text)<{ variant?: ButtonVariant }>`
  font-size: 14px;
  font-weight: 700;
`;

export const sizeStyles: Record<
  ButtonSize,
  { height: number; paddingHorizontal: number; paddingVertical: number }
> = {
  xs: { height: 32, paddingHorizontal: 12, paddingVertical: 8 },
  sm: { height: 38, paddingHorizontal: 16, paddingVertical: 10 },
  md: { height: 44, paddingHorizontal: 20, paddingVertical: 12 },
  lg: { height: 52, paddingHorizontal: 24, paddingVertical: 14 },
  xl: { height: 60, paddingHorizontal: 28, paddingVertical: 16 },
};
