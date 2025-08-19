import React, { useState } from 'react';
import { Platform, TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import {
  fontSize,
  radius,
  height,
  width,
  fonts,
  lineHeight,
} from '@/theme/globalStyles';
import colors from '@/theme/color';
import { Asterisk } from './Textarea';

interface InputProps extends TextInputProps {
  title?: string;
  subMessage?: string;
  isRequired?: boolean;
  accessoryID?: string;
}

export default function Input({
  title,
  subMessage,
  placeholder,
  isRequired = false,
  accessoryID,
  ...textInputProps
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Wrapper>
      {title && (
        <Title>
          {title}
          {isRequired && <Asterisk> *</Asterisk>}
        </Title>
      )}

      <InputBox focused={focused}>
        <StyledTextInput
          {...textInputProps}
          placeholder={placeholder}
          placeholderTextColor="#B0B0B0"
          onFocus={(e) => {
            setFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            textInputProps.onBlur?.(e);
          }}
          {...(Platform.OS === 'ios'
            ? { inputAccessoryViewID: accessoryID }
            : {})}
        />
      </InputBox>

      {subMessage && <SubMessage>{subMessage}</SubMessage>}
    </Wrapper>
  );
}

export const Wrapper = styled.View`
  width: 100%;
  gap: ${12 * height}px;
  font-family: ${fonts.Regular};
`;

export const Title = styled.Text`
  font-size: ${fontSize.md}px;
  color: ${colors.text[2]};
  font-family: ${fonts.Bold};
`;

export const InputBox = styled.View<{ focused: boolean }>`
  width: 100%;
  border-radius: ${radius.sm}px;
  justify-content: center;
  padding-vertical: ${12 * height}px;
  height: ${48 * height}px;
  padding-horizontal: ${12 * width}px;
  border-width: ${({ focused }) => (focused ? 2 : 1)}px;

  border-color: ${({ focused }) =>
    focused ? colors.primaryLight : colors.gray[300]};
  border-style: solid;
  background-color: transparent;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const StyledTextInput = styled.TextInput`
  width: 100%;
  height: ${24 * height}px;
  font-size: ${fontSize.lg}px;
  font-family: ${fonts.Regular};
  color: ${colors.black};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
`;

export const SubMessage = styled.Text`
  font-size: ${fontSize.sm}px;
  color: ${colors.text[3]};
  margin-left: ${12 * width}px;
  font-family: ${fonts.Regular};
`;
