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
import { useRouter } from 'expo-router';
import { Header } from '@/components';
import { BellIcon, LogoText } from '@/assets';

export default function PrivatePage() {
  const router = useRouter();
  return (
    <Container>
      <Header
        LeftSection={<LogoText width={65} height={24} />}
        RightSection={<BellIcon />}
      />
      <LockIcon
        width={120 * width}
        height={120 * width}
        style={{ marginTop: 162 * height }}
      />
      <MessageText>
        재밌는 기능들을 {'\n'}
        준비중이야
      </MessageText>
      <FeedbackButton
        onPress={() => {
          router.push('/account/setting/help');
        }}
      >
        <ButtonLabel>이런 것도 있으면 좋겠어</ButtonLabel>
      </FeedbackButton>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: ${28 * height}px ${20 * width}px;
  align-items: center;
  background-color: ${colors.bg[2]};
  gap: ${20 * height};
`;

const MessageText = styled.Text`
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l}px;
  font-family: ${fonts.Regular};
  font-weight: 700;
  color: ${colors.text[3]};
  text-align: center;
`;

const FeedbackButton = styled.Pressable`
  background-color: ${colors.white};
  border-radius: ${radius.md}px;
  padding: ${8 * height}px ${12 * width}px;
  justify-content: center;
`;

const ButtonLabel = styled.Text`
  font-size: ${fontSize.sm}px;
  font-family: ${fonts.Regular};
  font-weight: 700;
  color: ${colors.primaryLight};
`;
