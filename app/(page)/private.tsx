import React from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import LockIcon from '@/assets/images/ic_lock.svg';
import {
  fontSize,
  lineHeight,
  radius,
  fonts,
  width,
  height,
} from '@/theme/globalStyles';

export default function PrivatePage() {
  return (
    <Container>
      <LockIcon width={120 * width} height={120 * width} />
      <MessageText>
        재밌는 기능들을 {'\n'}
        준비중이야
      </MessageText>
      <FeedbackButton>
        <ButtonLabel>이런 것도 있으면 좋겠어</ButtonLabel>
      </FeedbackButton>
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

const FeedbackButton = styled.Pressable`
  height: 32px;
  background-color: ${colors.white};
  border-radius: ${radius.md}px;
  padding: ${8 * height}px ${12 * width}px;
  justify-content: center;
`;

const ButtonLabel = styled.Text`
  font-size: ${fontSize.sm}px;
  font-family: ${fonts.Light};
  font-weight: 700;
  color: ${colors.primaryLight};
`;
