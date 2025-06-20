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
import UserCard from '@/components/signup/UserCard';

export default function LandingPage() {
  const handleKakaoLogin = () => {
    console.log('카카오 로그인');
  };
  const handleSignUp = () => {
    console.log('새로 가입하기');
  };

  return (
    <Container>
      <LogoWrapper>
        <LogoGif
          source={require('@/assets/images/gif/ic_logo.gif')}
          contentFit="cover"
          transition={300}
        />
      </LogoWrapper>
      <UserCard cardinal={5} name="이한별" position="D" />

      <BottomArea>
        <KakaoBtn onPress={handleKakaoLogin}>
          <KakaoLogo />
          <KakaoBtnText>카카오로 로그인</KakaoBtnText>
        </KakaoBtn>
        <SignUpBtn onPress={handleSignUp}>
          <SignUpBtnText>새로 가입하기</SignUpBtnText>
        </SignUpBtn>
      </BottomArea>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
  align-items: center;
  position: relative;
`;

const LogoWrapper = styled.View`
  margin-top: ${277 * height}px;
`;

const LogoGif = styled(Image)`
  width: ${300 * width}px;
  height: ${171 * height}px;
`;

const BottomArea = styled.View`
  position: absolute;
  bottom: ${108 * height}px;
  align-items: center;
  width: 100%;
`;

const KakaoBtn = styled.Pressable`
  flex-direction: row;
  width: ${335 * width}px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.kakao};
  border-radius: ${radius.md}px;
  padding: ${13 * width}px 0;
`;

const KakaoBtnText = styled.Text`
  color: ${colors.text[2]};
  font-family: ${fonts.Regular};
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.m}px;
  margin-left: ${8 * width}px;
  font-weight: 500;
`;

const SignUpBtn = styled.Pressable`
  margin-top: ${12 * height}px;
  width: ${335 * width}px;
  height: ${40 * height}px;
  justify-content: center;
  align-items: center;
`;

const SignUpBtnText = styled.Text`
  color: ${colors.text[3]};
  font-family: ${fonts.Regular};
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.m}px;
  font-weight: 500;
`;
