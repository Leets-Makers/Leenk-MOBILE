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
import axios from 'axios';
import { login } from '@react-native-kakao/user';
import PopupModal from '@/components/Modal/PopupModal';
import { Linking } from 'react-native';
export default function LandingPage() {
  const kakaoNativeAppKey = process.env.EXPO_PUBLIC_NATIVE_APP_KEY || '';
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const [notRegisterModal, setNotRegisterModal] = useState(false);
  const [waitModal, setWaitModal] = useState(false);
  const weethSiteURL = 'https://www.weeth.site/';
  useEffect(() => {
    initializeKakaoSDK(kakaoNativeAppKey);
  }, []);

  const handleKakaoLogin = async () => {
    try {
      // 1. 카카오 로그인 시도
      const token = await login();
      const accessToken = token?.accessToken;

      console.log('✅ Kakao Access Token:', accessToken);

      // 2. 서버에 토큰 전송
      const response = await axios.post(
        `${BASE_URL}kakao/login`,
        {},
        {
          headers: {
            'Kakao-Access-Token': accessToken,
          },
        },
      );

      console.log('로그인 성공: ', response.data);

      // 3. 다음 화면으로 이동
      router.push('/signup/verify');
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { code, message } = error.response.data;

        switch (code) {
          case '2000':
            // 가입 승인 대기
            setWaitModal(true);
            break;
          case '2001':
            // 인증 서버 예외 메시지 → 콘솔 출력
            console.error('서버 인증 에러:', message);
            break;
          case '2002':
            // 미가입 사용자
            setNotRegisterModal(true);
            break;
          default:
            console.error('알 수 없는 예외:', code, message);
        }
      } else {
        console.error('카카오 로그인 실패:', error);
      }
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
