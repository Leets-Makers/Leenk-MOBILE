import { TextStyle, ViewStyle } from 'react-native';
import { StyledButton, StyledButtonText } from './CustomButton.styled';

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
};

export default function CustomButton({
  children,
  onPress,
  variant,
  size,
  rounded,
  disabled,
  style,
  textStyle,
  fullWidth,
}: CustomButtonProps) {
  return (
    <StyledButton
      onPress={onPress}
      variant={variant}
      size={size}
      rounded={rounded}
      disabled={disabled}
      style={style}
      fullWidth={fullWidth}
    >
      {children && (
        <StyledButtonText variant={variant} style={textStyle}>
          {children}
        </StyledButtonText>
      )}
    </StyledButton>
  );
}
