import {
  PressableStateCallbackType,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {
  StyledButton,
  StyledButtonText,
  sizeStyles,
} from '@/components/common/Button/CustomButton.styled';
import {
  getButtonBackgroundColor,
  getButtonTextColor,
  getBorderRadius,
} from '@/utils/button-style';
import styled from 'styled-components/native';

export type ButtonVariant = 'primary' | 'secondary' | 'text';
export type ButtonRounded = 'xs' | 'sm' | 'md' | 'lg' | 'full';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type CustomButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  textColor?: 'primary' | 'black';
  renderContent?: () => React.ReactNode;
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
  renderContent,
}: CustomButtonProps) {
  const sizeStyle = sizeStyles[size];
  const borderRadius = getBorderRadius(rounded);

  return (
    <StyledButton
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }: PressableStateCallbackType) => [
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
      <StyledContentWrapper>
        <StyledButtonText
          variant={variant}
          style={[
            { color: getButtonTextColor({ variant, disabled, textColor }) },
            textStyle,
          ]}
        >
          {children}
        </StyledButtonText>
      </StyledContentWrapper>
    </StyledButton>
  );
}

export const StyledContentWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
