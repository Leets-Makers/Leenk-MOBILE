import React, { useState } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CustomButton } from '@/components';
import { login } from '@react-native-kakao/user';
import PopupModal from '@/components/Modal/PopupModal';
import { Linking } from 'react-native';
import { kakaoLogin } from '@/api/login/kakao.api';
import {
  clearAllTokens,
  getFcmToken,
  saveAccessToken,
  saveRefreshToken,
} from '@/utils/tokenStorage';
import { useProfileStore } from '@/stores/profileStore';
import { useBlockBackHandler } from '@/hooks/useBlockBackHandler';
import { patchNotificationsToken } from '@/api/users/notification.api';

// FCM 토큰 서버 전송 함수
export const registerFcmToken = async () => {
  const fcmToken = await getFcmToken();
  if (!fcmToken) return;
  try {
    await patchNotificationsToken(fcmToken);
  } catch (error) {
    console.error('FCM 토큰 서버 등록 실패:', error);
  }
};

export default function LandingPage() {
  const router = useRouter();
  const [notRegisterModal, setNotRegisterModal] = useState(false);
  const [waitModal, setWaitModal] = useState(false);
  const weethSiteURL = 'https://www.weeth.kr';
  const { fromLogout } = useLocalSearchParams();

  const { setName, setPosition, setCardinal } = useProfileStore();

  const shouldBlock = fromLogout === 'true';

  useBlockBackHandler({ block: shouldBlock });

  const handleKakaoLogin = async () => {
    await clearAllTokens();
    //카카오 로그인 로직
    try {
      const token = await login();
      const accessToken = token?.accessToken;
      if (!accessToken) {
        if (__DEV__) console.warn('카카오 accessToken 없음(취소/실패)');
        return;
      }
      const result = await kakaoLogin(accessToken);

      if (result.success) {
        const serverToken = result.data.accessToken;
        const refreshToken = result.data.refreshToken;

        if (result.code === 1002) {
          await saveAccessToken(serverToken);
          await saveRefreshToken(refreshToken);
          setName(result.data.name);
          setPosition(result.data.position);
          setCardinal(result.data.cardinal);
          // 최초 로그인: 약관 페이지로 이동
          router.push('/signup/terms');
        } else if (result.code === 1003) {
          // 일반 로그인: 바로 링크로 이동
          await saveAccessToken(serverToken);
          await saveRefreshToken(refreshToken);
          await registerFcmToken();
          router.replace('/(page)/leenk');
        }
      } else {
        switch (result.code) {
          case 2000:
            setWaitModal(true);
            break;
          case 2001:
            if (__DEV__) console.error('서버 인증 에러:', result.message);
            break;
          case 2002:
            setNotRegisterModal(true);
            break;
          default:
            if (__DEV__)
              console.error('알 수 없는 예외:', result.code, result.message);
        }
      }
    } catch (e) {
      if (__DEV__) console.error('카카오 로그인 실패:', e);
    }
  };

  const handleSignUp = () => {
    Linking.openURL(weethSiteURL);
  };

  return (
    <Container>
      <PopupModal
        isOpen={notRegisterModal}
        mainText="먼저 Weeth부터 가입해야 해"
        subText="Leets 활동을 위해 위드는 필수야"
        leftBtnText="닫기"
        rightBtnText="위드 가입하자"
        onRightBtn={() => {
          Linking.openURL(weethSiteURL);
        }}
        onLeftBtn={() => setNotRegisterModal(false)}
      />
      <PopupModal
        isOpen={waitModal}
        mainText="Weeth 가입 승인 대기중이야"
        subText="승인이 완료될 때까지 조금만 기다려줘."
        leftBtnText="닫기"
        rightBtnText="위드 보러가자"
        onRightBtn={() => {
          Linking.openURL(weethSiteURL);
        }}
        onLeftBtn={() => setWaitModal(false)}
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
          style={{ marginTop: 12 * height }}
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

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.bg[2]};
  align-items: center;
  position: relative;
`;

const LogoWrapper = styled.View`
  margin-top: ${190 * height}px;
`;

const LogoGif = styled(Image)`
  width: ${300 * width}px;
  height: ${171 * height}px;
`;

const BottomArea = styled.View`
  position: absolute;
  bottom: ${120 * height}px;
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
