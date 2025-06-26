import React from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import LockIcon from '@/assets/images/ic_leenk_bg_gray.svg';
import { fontSize, lineHeight, fonts, width } from '@/theme/globalStyles';

export default function LeenkPage() {
  return (
    <Container>
      <LockIcon width={120 * width} height={120 * width} />
      <MessageText>곧 출시될 예정이야{'\n'} 조금만 기다려줘!</MessageText>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.bg[2]};
  gap: 20px;
`;

const MessageText = styled.Text`
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l}px;
  font-family: ${fonts.Regular};
  font-weight: 600;
  color: ${colors.text[3]};
  text-align: center;
`;
