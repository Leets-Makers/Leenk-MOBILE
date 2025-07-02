import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Image } from 'expo-image';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import colors from '@/theme/color';
import KakaoLogo from '@/assets/images/ic_KAKAO_symbol.svg';
import { useRouter } from 'expo-router';
import { CustomButton } from '@/components';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { login } from '@react-native-kakao/user';
import PopupModal from '@/components/Modal/PopupModal';
import { Linking } from 'react-native';
import { kakaoLogin } from '@/api/login/kakao.api';
import { saveAccessToken } from '@/utils/tokenStorage';
export default function LandingPage() {
  const kakaoNativeAppKey = process.env.EXPO_PUBLIC_NATIVE_APP_KEY || '';
  const router = useRouter();
  const [notRegisterModal, setNotRegisterModal] = useState(false);
  const [waitModal, setWaitModal] = useState(false);
  const weethSiteURL = 'https://www.weeth.site/';
  useEffect(() => {
    initializeKakaoSDK(kakaoNativeAppKey);
  }, []);

  const handleKakaoLogin = async () => {
    try {
      const token = await login();
      const accessToken = token?.accessToken;

      console.log('✅ Kakao Access Token:', accessToken);

      const result = await kakaoLogin(accessToken);

      if (result.success) {
        console.log('로그인 성공:', result.data);

        const serverToken = result.data.accessToken;

        await saveAccessToken(serverToken);

        router.push('/signup/verify');
      } else {
        switch (result.code) {
          case '2000':
            setWaitModal(true);
            break;
          case '2001':
            console.error('서버 인증 에러:', result.message);
            break;
          case '2002':
            setNotRegisterModal(true);
            break;
          default:
            console.error('알 수 없는 예외:', result.code, result.message);
        }
      }
    } catch (e) {
      console.error('카카오 로그인 실패:', e);
    }
  };

  const handleSignUp = () => {
    Linking.openURL(weethSiteURL);
    console.log('새로 가입하기');
  };

  return (
    <Container>
      <PopupModal
        isOpen={notRegisterModal}
        mainText="먼저 Weeth부터 가입해야 해"
        subText="Leets 활동을 위해 위드는 필수야"
        leftBtnText="닫기"
        rightBtnText="위드 가입하자"
        onConfirm={() => {
          Linking.openURL(weethSiteURL);
        }}
        onClose={() => setNotRegisterModal(false)}
      />
      <PopupModal
        isOpen={waitModal}
        mainText="Weeth 가입 승인 대기중이야"
        subText="승인이 완료될 때까지 조금만 기다려줘."
        leftBtnText="닫기"
        rightBtnText="위드 보러가자"
        onConfirm={() => {
          Linking.openURL(weethSiteURL);
        }}
        onClose={() => setWaitModal(false)}
      />
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
