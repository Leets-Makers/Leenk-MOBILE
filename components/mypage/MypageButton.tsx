import { RightArrowIcon } from '@/assets';
import colors from '@/theme/color';
import { fonts, fontSize, width } from '@/theme/globalStyles';
import React from 'react';
import styled from 'styled-components/native';

export default function MyPageButton({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) {
  return (
    <Container onPress={onPress}>
      <Title>{text}</Title>
      <RightArrowIcon />
    </Container>
  );
}

const Container = styled.Pressable`
  flex-direction: row;
  background-color: ${colors.white};
  width: ${336 * width}px;
  border-radius: 13px;
  padding: ${14 * width}px;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text`
  font-size: ${fontSize.md}px;
  font-weight: 700;
  color: ${colors.text[1]};
  font-family: ${fonts.Regular};
`;
