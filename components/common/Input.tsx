import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { fontSize, radius, height, width, fonts } from '@/theme/globalStyles';
import colors from '@/theme/color';
import { Asterisk } from './Textarea';

interface InputProps extends TextInputProps {
  title?: string;
  subMessage?: string;
  isRequired?: boolean;
}

export default function Input({
  title,
  subMessage,
  placeholder,
  isRequired = false,
  ...textInputProps
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Wrapper>
      {title && (
        <Title>
          {title}
          {isRequired && <Asterisk>*</Asterisk>}
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
        />
      </InputBox>

      {subMessage && <SubMessage>{subMessage}</SubMessage>}
    </Wrapper>
  );
}

export const Wrapper = styled.View`
  width: 100%;
  gap: 8px;
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
  padding-vertical: ${12 * height}px;
  padding-horizontal: ${12 * width}px;
  border-width: 2px;
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
  font-size: ${fontSize.lg}px;
  color: ${colors.black};
  padding: 0;
`;

export const SubMessage = styled.Text`
  font-size: ${fontSize.sm}px;
  color: ${colors.text[3]};
  margin-left: ${12 * width}px;
  font-family: ${fonts.Regular};
`;
