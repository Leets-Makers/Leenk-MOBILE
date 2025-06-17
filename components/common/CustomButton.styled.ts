import styled, { css } from 'styled-components/native';
import { Pressable, Text } from 'react-native';
import { ButtonVariant, ButtonSize, ButtonRounded } from './CustomButton';
import colors from '@/theme/color';

export const StyledButton = styled(Pressable)<{
  variant: ButtonVariant;
  size: ButtonSize;
  rounded: ButtonRounded;
  disabled?: boolean;
  fullWidth?: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${({ size }) => sizeStyles[size]};
  ${({ variant }) => variantStyles[variant]};
  ${({ rounded }) => roundedStyles[rounded]};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `};
`;

export const StyledButtonText = styled(Text)<{
  variant: ButtonVariant;
}>`
  ${({ variant }) => textColorStyles[variant]};
  font-size: 16px;
  font-weight: 500;
`;

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background-color: ${colors.primary};
  `,
  secondary: css`
    background-color: ${colors.divider};
  `,
  text: css`
    background-color: transparent;
  `,
};

const textColorStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    color: ${colors.white};
  `,
  secondary: css`
    color: ${colors.gray[700]};
  `,
  text: css`
    color: ${colors.primary};
  `,
};

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  xs: css`
    height: 32px;
    padding: 8px 12px;
  `,
  sm: css`
    height: 38px;
    padding: 10px 16px;
  `,
  md: css`
    height: 44px;
    padding: 12px 20px;
  `,
  lg: css`
    height: 52px;
    padding: 14px 24px;
  `,
  xl: css`
    height: 60px;
    padding: 16px 28px;
  `,
};

const roundedStyles: Record<ButtonRounded, ReturnType<typeof css>> = {
  sm: css`
    border-radius: 8px;
  `,
  md: css`
    border-radius: 16px;
  `,
  large: css`
    border-radius: 20px;
  `,
  full: css`
    border-radius: 9999px;
  `,
};
