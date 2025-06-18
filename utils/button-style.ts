import {
  ButtonRounded,
  ButtonVariant,
} from '@/components/common/Button/CustomButton';
import colors from '@/theme/color';
import { radius } from '@/theme/globalStyles';
/**
 *  버튼 Press 시 색상 변화
 *
 *  1. variant:primary -> primaryDark
 *  2. variant: secondary -> gray[400]
 *
 */

type Props = {
  variant: ButtonVariant;
  disabled?: boolean;
  pressed?: boolean;
  textColor?: 'primary' | 'black';
};

export const getButtonBackgroundColor = ({
  variant,
  disabled,
  pressed,
}: Props): string => {
  if (variant === 'primary') {
    if (disabled) return colors.gray[100];
    if (pressed) return colors.primaryDark;
    return colors.primary;
  }

  if (variant === 'secondary') {
    if (disabled) return colors.gray[100];
    if (pressed) return colors.gray[400];
    return colors.divider[2];
  }

  return 'transparent';
};

export const getButtonTextColor = ({
  variant,
  disabled,
  textColor,
}: Props): string => {
  if (disabled) return colors.gray[400];

  if (variant === 'primary') return colors.white;
  if (variant === 'secondary') return colors.gray[700];
  if (variant === 'text') {
    return textColor === 'black' ? colors.black : colors.primary;
  }

  return colors.white;
};

export const getBorderRadius = (rounded: ButtonRounded): number => {
  switch (rounded) {
    case 'xs':
      return radius.xs;
    case 'sm':
      return radius.sm;
    case 'md':
      return radius.md;
    case 'lg':
      return radius.lg;
    case 'full':
      return radius.full;
    default:
      return radius.sm;
  }
};

//Badge 컴포넌트
export const getBackgroundColor = (variant: string) => {
  switch (variant) {
    case 'primary':
      return colors.primary;
    case 'gray':
      return colors.gray[900];
    case 'white':
      return colors.white;
    default:
      return colors.primary;
  }
};
