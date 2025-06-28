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
  value,
  onChangeText,
  ...props
}: TextareaProps) {
  const [focused, setFocused] = useState(false);
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
          onChangeText={onChangeText}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
        />
        <CharCount
          isDark={isDark}
        >{`${value?.length ?? 0}/${maxLength}`}</CharCount>
      </InputBox>

      {subMessage && <SubMessage>{subMessage}</SubMessage>}
    </Wrapper>
  );
}

const InputBox = styled.View<{ focused: boolean; isDark: boolean }>`
  width: 100%;
  border-radius: ${radius.sm}px;
  padding-vertical: ${12 * height}px;
  padding-horizontal: ${12 * width}px;
  border-width: 2px;
  border-color: ${({ focused }) =>
    focused ? colors.violet[400] : colors.gray[300]};
  border-style: solid;
  background-color: ${({ isDark }) =>
    isDark ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
`;

const StyledTextarea = styled.TextInput<{ isDark: boolean; minHeight: number }>`
  width: 100%;
  min-height: ${({ minHeight }) =>
    minHeight ? `${minHeight * height}px` : `${74 * height}px`};
  max-height: ${85 * height}px;
  font-size: ${fontSize.md}px;
  font-family: ${fonts.Bold};
  color: ${({ isDark }) => (isDark ? colors.white : colors.black)};
  text-align-vertical: top;
`;

const CharCount = styled.Text<{ isDark: boolean }>`
  font-size: ${fontSize.sm}px;
  color: ${({ isDark }) => (isDark ? colors.gray[400] : colors.gray[500])};
  text-align: right;
  margin-top: 4px;
`;
