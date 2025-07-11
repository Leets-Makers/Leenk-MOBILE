// components/common/Badge.tsx
import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { XIcon, PlusIcon } from '@/assets';
import {
  width,
  height,
  radius,
  fontSize,
  fonts,
  lineHeight,
} from '@/theme/globalStyles';
import colors from '@/theme/color';
import { getBadgeBackgroundColor } from '@/utils';

interface BadgeProps {
  label: string | number;
  variant?: 'primary' | 'gray' | 'white';
  iconType?: 'plus' | 'x'; // plus면 왼쪽에 + , x 면 오른쪽에 표시
  onRemove?: () => void;
  onPress?: () => void;
  profile?: boolean;
}

export default function Badge({
  label,
  variant = 'primary',
  iconType,
  onRemove,
  onPress,
  profile = false,
}: BadgeProps) {
  const BadgeContent = (
    <Container
      $variant={variant}
      $backgroundColor={getBadgeBackgroundColor(variant)}
      $profile={profile}
    >
      {/* 왼쪽 아이콘: plus */}
      {iconType === 'plus' && (
        <IconWrapper style={{ marginRight: 4 }}>
          <PlusIcon width={18} height={18} />
        </IconWrapper>
      )}

      <Text variant={variant}>{label}</Text>

      {/* 오른쪽 아이콘: x */}
      {iconType === 'x' && onRemove && (
        <RemoveButton onPress={onRemove}>
          <XIcon width={10} height={10} color={colors.white} />
        </RemoveButton>
      )}
    </Container>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress}>{BadgeContent}</TouchableOpacity>
    );
  }

  return BadgeContent;
}

const Container = styled.View<{
  $backgroundColor: string;
  $variant: 'primary' | 'gray' | 'white';
  $profile: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.full}px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  ${({ $profile }) =>
    $profile
      ? `
    padding: ${4 * height}px ${12 * width}px;
    min-height: ${24 * height}px;
  `
      : `
    padding: ${4.5 * height}px ${8 * width}px;
    min-height: ${24 * height}px;
  `}
  ${({ $variant }) =>
    $variant === 'white' &&
    `
      min-width: ${49 * width}px;
  `}
`;

const Text = styled.Text<{ variant: string }>`
  font-size: ${fontSize.sm}px;
  color: ${({ variant }) =>
    variant === 'primary' || variant === 'gray'
      ? colors.white
      : colors.text[3]};
  font-family: ${fonts.Bold};
  line-height: ${lineHeight.s};
`;

const IconWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

const RemoveButton = styled(TouchableOpacity)`
  margin-left: 6px;
`;
