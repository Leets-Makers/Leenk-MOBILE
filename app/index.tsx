import React from 'react';
import styled from 'styled-components/native';
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
        width="100%"
        height="100%"
        source={require('@/assets/images/gif/ic_logo.gif')}
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

const LogoGif = styled.Image`
  width: 198px;
  height: 40px;
`;

const KakaoBtn = styled.Pressable`
  display: flex;
  flex-direction: row;
  width: ${335 * width}px;
  height: ${40 * height}px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.kakao};
  border-radius: ${radius.md}px;
  margin-top: 256px;
`;

const KakaoBtnText = styled.Text`
  color: ${colors.text[2]};
  font-family: ${fonts.Regular};
  font-size: ${fontSize.md};
  line-height: ${lineHeight.m};
  margin-left: ${8 * width};
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
  font-size: ${fontSize.md};
  line-height: ${lineHeight.m};
  font-weight: 500;
`;
