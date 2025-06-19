import React from 'react';
import styled from 'styled-components/native';
import { Image } from 'expo-image';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import colors from '@/theme/color';
import KakaoLogo from '@/assets/images/ic_KAKAO_symbol.svg';
import { Platform } from 'react-native';

export default function LandingPage() {
  const handleKakaoLogin = () => {
    console.log('카카오 로그인');
  };
  const handleSignUp = () => {
    console.log('새로 가입하기');
  };

  return (
    <Container>
      <LogoGif
        source={require('@/assets/images/gif/ic_logo.gif')}
        contentFit="cover"
        transition={300}
      />

      <KakaoBtn onPress={handleKakaoLogin}>
        <KakaoLogo />
        <KakaoBtnText>카카오로 로그인</KakaoBtnText>
      </KakaoBtn>
      <SignUpBtn onPress={handleSignUp}>
        <SignUpBtnText>새로 가입하기</SignUpBtnText>
      </SignUpBtn>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
  justify-content: center;
  align-items: center;
`;

const LogoGif = styled(Image)`
  margin-top: ${277 * height}px;
  width: ${300 * width}px;
  aspect-ratio: 5;
`;

const KakaoBtn = styled.Pressable`
  display: flex;
  flex-direction: row;
  width: ${335 * width}px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.kakao};
  border-radius: ${radius.md}px;
  margin-top: ${256 * height}px;
  padding: ${13 * width}px 0;
`;

const KakaoBtnText = styled.Text`
  color: ${colors.text[2]};
  font-family: ${fonts.Regular};
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.m}px;
  margin-left: ${8 * width}px;
  padding-bottom: 1px;
  font-weight: 500;
`;

const SignUpBtn = styled.Pressable`
  display: flex;
  width: ${335 * width}px;
  height: ${40 * height}px;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
`;

const SignUpBtnText = styled.Text`
  color: ${colors.text[3]};
  font-family: ${fonts.Regular};
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.m}px;
  font-weight: 500;
`;
