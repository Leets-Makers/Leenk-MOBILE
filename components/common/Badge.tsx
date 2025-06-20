// components/common/Badge.tsx
import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { XIcon, PlusIcon } from '@/assets';
import { width, height, radius, fontSize } from '@/theme/globalStyles';
import colors from '@/theme/color';
import { getBackgroundColor } from '@/utils/button-style';

interface BadgeProps {
  label: string | number;
  variant?: 'primary' | 'gray' | 'white';
  iconType?: 'plus' | 'x'; // plus면 왼쪽에 + , x 면 오른쪽에 표시
  onRemove?: () => void;
}

export default function Badge({
  label,
  variant = 'primary',
  iconType,
  onRemove,
}: BadgeProps) {
  return (
    <Container variant={variant} backgroundColor={getBackgroundColor(variant)}>
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
          <XIcon width={10} height={10} />
        </RemoveButton>
      )}
    </Container>
  );
}

const Container = styled.View<{ backgroundColor: string }>`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  padding-vertical: ${4 * height}px;
  padding-horizontal: ${10 * width}px;
  border-radius: ${radius.full}px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const Text = styled.Text<{ variant: string }>`
  font-size: ${fontSize.sm}px;
  color: ${({ variant }) =>
    variant === 'primary' || variant === 'gray'
      ? colors.white
      : colors.text[3]};
`;

const IconWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

const RemoveButton = styled(TouchableOpacity)`
  margin-left: 6px;
`;
