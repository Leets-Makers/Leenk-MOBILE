import React from 'react';
import styled from 'styled-components/native';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import colors from '@/theme/color';
import { Text } from 'react-native';

export default function LandingPage() {
  const handleKakaoLogin = () => {
    console.log('카카오 로그인');
  };
  const handleSignUp = () => {
    console.log('새로 가입하기');
  };

  return (
    <Container>
      <LogoGif source={require('@/assets/images/gif/ic_logo.gif')} />
      <KakaoLoginBtn
        source={require('@/assets/images/kakao_login_btn.png')}
        onPress={handleKakaoLogin}
      />
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
  width: ${198 * width}px;
  height: ${71 * height}px;
`;

const KakaoLoginBtn = styled.Image`
  margin-top: ${256 * height}px;
`;

const SignUpBtn = styled.Pressable`
  display: flex;
  width: ${335 * width}px;
  height: ${40 * height}px;
  justify-content: center;
  align-items: center;
`;

const SignUpBtnText = styled.Text`
  color: ${colors.text[3]};
  font-family: ${fonts.Regular};
  font-size: ${fontSize.md};
  line-height: ${lineHeight.m};
`;
