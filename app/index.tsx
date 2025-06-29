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
import { useRouter } from 'expo-router';
import { CustomButton } from '@/components';
export default function LandingPage() {
  const router = useRouter();

  const handleKakaoLogin = () => {
    console.log('카카오 로그인');
    router.push('/signup/verify');
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
      <BottomArea>
        <CustomButton
          variant="kakao"
          size="md"
          fullWidth
          onPress={handleKakaoLogin}
        >
          <KakaoContainer>
            <KakaoLogo />
            <KakaoBtnText>카카오로 로그인</KakaoBtnText>
          </KakaoContainer>
        </CustomButton>
        <CustomButton
          variant="text"
          textColor="text[3]"
          size="md"
          fullWidth
          onPress={handleSignUp}
        >
          새로 가입하기
        </CustomButton>
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
  margin-top: ${247 * height}px;
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
  padding-horizontal: ${20 * width}px;
`;

const KakaoContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const KakaoBtnText = styled.Text`
  color: ${colors.text[2]};
  font-family: ${fonts.Bold};
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.m}px;
  margin-left: ${8 * width}px;
  text-align: center;
`;
