// CustomButton.tsx
import { TextStyle, ViewStyle } from 'react-native';
import {
  StyledButton,
  StyledButtonText,
  sizeStyles,
} from '@/components/common/CustomButton.styled';
import {
  getButtonBackgroundColor,
  getButtonTextColor,
  getBorderRadius,
} from '@/utils/button-style';

export type ButtonVariant = 'primary' | 'secondary' | 'text';
export type ButtonRounded = 'sm' | 'md' | 'large' | 'full';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type CustomButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  textColor?: 'primary' | 'black';
};

export default function CustomButton({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  rounded = 'md',
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
  textColor,
}: CustomButtonProps) {
  const sizeStyle = sizeStyles[size];
  const borderRadius = getBorderRadius(rounded);

  return (
    <StyledButton
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: sizeStyle.paddingVertical,
          borderRadius,
          backgroundColor: getButtonBackgroundColor({
            variant,
            disabled,
            pressed,
          }),
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      <StyledButtonText
        variant={variant}
        style={{
          color: getButtonTextColor({ variant, disabled, textColor }),
          ...(textStyle || {}),
        }}
      >
        {children}
      </StyledButtonText>
    </StyledButton>
  );
}
