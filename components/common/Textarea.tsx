import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { fontSize, radius, height, width, fonts } from '@/theme/globalStyles';
import colors from '@/theme/color';
import { Wrapper, Title, SubMessage } from './Input';

interface TextareaProps extends TextInputProps {
  title?: string;
  subMessage?: string;
  maxLength?: number;
  variant?: 'light' | 'dark'; // 밝은 테마 / 어두운 테마
  minHeight?: number;
}

export default function Textarea({
  title,
  subMessage,
  maxLength = 200,
  placeholder,
  variant = 'light',
  minHeight,
  ...props
}: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  const isDark = variant === 'dark';

  return (
    <Wrapper>
      {title && <Title>{title}</Title>}
      <InputBox focused={focused} isDark={isDark}>
        <StyledTextarea
          {...props}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
          multiline
          maxLength={maxLength}
          value={value}
          isDark={isDark}
          minHeight={minHeight}
          onChangeText={(text) => setValue(text)}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
        />
        <CharCount isDark={isDark}>{`${value.length}/${maxLength}`}</CharCount>
      </InputBox>

      {subMessage && <SubMessage>{subMessage}</SubMessage>}
    </Wrapper>
  );
}

const InputBox = styled.View<{ focused: boolean; isDark: boolean }>`
  width: 100%;
  border-radius: ${radius.sm}px;
  padding: ${12 * height}px ${16 * width}px;
  border: 1px solid
    ${({ focused }) => (focused ? colors.primary : colors.gray[300])};
  background-color: ${({ isDark }) => (isDark ? '#999' : 'transparent')};
`;

const StyledTextarea = styled.TextInput<{ isDark: boolean; minHeight: number }>`
  width: 100%;
  min-height: ${({ minHeight }) =>
    minHeight ? `${minHeight * height}px` : `${74 * height}px`};
  font-size: ${fontSize.md}px;
  color: ${({ isDark }) => (isDark ? colors.white : colors.black)};
  text-align-vertical: top;
`;

const CharCount = styled.Text<{ isDark: boolean }>`
  font-size: ${fontSize.sm}px;
  color: ${({ isDark }) => (isDark ? colors.divider[1] : colors.gray[500])};
  text-align: right;
  margin-top: 4px;
`;
