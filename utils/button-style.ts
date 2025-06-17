import { ButtonVariant } from '@/components/common/CustomButton';
import colors from '@/theme/color';

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
};

export const getButtonBackgroundColor = ({
  variant,
  disabled,
  pressed,
}: Props): string => {
  if (variant === 'primary') {
    if (disabled) return colors.divider[1];
    if (pressed) return colors.primaryDark;
  }

  if (variant === 'secondary') {
    if (disabled) return colors.divider[1];
    if (pressed) return colors.gray[400];
  }

  return 'transparent';
};

// disabled 일 때 텍스트 색상
export const getButtonTextColor = ({ variant, disabled }: Props): string => {
  if (disabled) return colors.gray[400];

  return colors.white;
};
