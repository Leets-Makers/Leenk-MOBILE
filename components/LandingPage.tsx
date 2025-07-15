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
import { useRouter } from 'expo-router';
import { CustomButton } from '@/components';
import { login } from '@react-native-kakao/user';
import PopupModal from '@/components/Modal/PopupModal';
import { Linking } from 'react-native';
import { kakaoLogin } from '@/api/login/kakao.api';
import { saveAccessToken } from '@/utils/tokenStorage';
import { useProfileStore } from '@/stores/profileStore';
import { useToastStore } from '@/stores/toastStore';

export default function LandingPage() {
  const router = useRouter();
  const [notRegisterModal, setNotRegisterModal] = useState(false);
  const [waitModal, setWaitModal] = useState(false);
  const weethSiteURL = 'https://www.weeth.site/';
  const { showToast } = useToastStore();

  const { setName, setPosition, setCardinal } = useProfileStore();

  const handleKakaoLogin = async () => {
    setName('이유진');
    setPosition('FE');
    setCardinal(4);
    router.push('/signup/terms');
    //카카오 로그인 로직
    /*  try {
      const token = await login();
      const accessToken = token?.accessToken;

      // 이메일 정보 조회
      // const userInfo = await getKakaoUserInfo(accessToken);
      // console.log('사용자 이메일:', userInfo.kakao_account.email);

      const result = await kakaoLogin(accessToken);
      if (result.success) {
        const serverToken = result.data.accessToken;
        try {
          await saveAccessToken(serverToken);
        } catch (error) {
          console.error('토큰 저장 실패:', error);
          showToast('에러가 발생했어. 관리자에게 문의해줘.', 'error');
          return;
        }
        if (result.code === 1002) {
          setName(result.data.name);
          setPosition(result.data.position);
          setCardinal(result.data.cardinal);
          // 최초 로그인: 약관 페이지로 이동
          router.push('/signup/terms');
        } else if (result.code === 1003) {
          // 일반 로그인: 바로 피드로 이동
          router.replace('/(page)/feed');
          // setName('이유진');
          // setPosition('FE');
          // setCardinal(4);
          // router.push('/signup/terms');
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
    } */
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
