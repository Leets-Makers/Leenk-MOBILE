import React, { useState } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CustomButton } from '@/components';
import { login } from '@react-native-kakao/user';
import PopupModal from '@/components/Modal/PopupModal';
import Input, { Title } from '@/components/common/Input';
import { Asterisk } from '@/components/common/Textarea';
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
import { postLogin } from '@/api/login/login.post.api';
import { useToastStore } from '@/stores/toastStore';
import { FEED_PADDING } from '@/constants';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { AppleLogo } from '@/assets';
import * as AppleAuthentication from 'expo-apple-authentication';
import { appleLogin } from '@/api/login/apple.api';

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
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const validEmailInput = (s: string) => s.replace(/[^A-Za-z0-9@._-]/g, '');
  const isValidEmail = (s: string) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(s);

  const { showToast } = useToastStore();

  const weethSiteURL = 'https://develop.dl97snxjdgiq1.amplifyapp.com';
  const { fromLogout } = useLocalSearchParams<{ fromLogout?: string }>();

  const { setName, setPosition, setCardinal } = useProfileStore();

  const shouldBlock = fromLogout === 'true';
  useBlockBackHandler({ block: shouldBlock });

  const handleSocialLogin = async (result: any) => {
    const code = result.code;
    const data = result.data;
    const message = result.message || '로그인에 실패했습니다';

    // --- 정상 로그인 ---
    if (code === 1002) {
      // 최초 로그인(회원가입 페이지로 이동)
      if (!data?.accessToken || !data?.refreshToken) {
        showToast('토큰 발급 실패', 'error');
        return;
      }

      await saveAccessToken(data.accessToken);
      await saveRefreshToken(data.refreshToken);

      setName(data.name);
      setPosition(data.position);
      setCardinal(data.cardinal);

      router.push('/signup/terms');
      return;
    }

    if (code === 1003) {
      // 일반 로그인(홈으로 이동)
      if (!data?.accessToken || !data?.refreshToken) {
        showToast('토큰 발급 실패', 'error');
        return;
      }

      await saveAccessToken(data.accessToken);
      await saveRefreshToken(data.refreshToken);

      // SecureStore 반영 대기
      await new Promise((r) => setTimeout(r, 150));

      await registerFcmToken();
      router.replace('/(page)/leenk');
      return;
    }

    // ---- 예외 처리 ----
    switch (code) {
      case 2000: // weeth 가입 승인 안된 유저
        setWaitModal(true);
        break;
      case 2001:
        await clearAllTokens();
        if (__DEV__) console.error('서버 인증 에러:', result.message);
        showToast(message, 'error');
        break;
      case 2002: // weeth에 가입되지 않은 유저
        setNotRegisterModal(true);
        break;
      default:
        if (__DEV__) console.error('알 수 없는 예외:', code, result.message);
        await clearAllTokens();
        showToast(message, 'error');
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const token = await login();
      const accessToken = token?.accessToken;
      if (!accessToken) {
        showToast('카카오 토큰 발급 실패', 'error');
        return;
      }

      const result = await kakaoLogin(accessToken);

      await handleSocialLogin(result);
    } catch (error: any) {
      const serverCode = error?.response?.data?.code;
      const serverMsg = error?.response?.data?.message;

      if (serverCode) {
        await handleSocialLogin({
          code: serverCode,
          message: serverMsg,
          data: error.response.data.data,
        });
        return;
      }

      await clearAllTokens();
      if (__DEV__) console.error('카카오 로그인 실패:', error);
      showToast('카카오 로그인 실패', 'error');
    }
  };

  const handleSignUp = () => {
    setWaitModal(false);
    setNotRegisterModal(false);

    router.push({
      pathname: '/webView',
      params: { url: weethSiteURL, title: 'Weeth' },
    });
  };

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const idToken = credential.identityToken;
      if (!idToken) {
        showToast('애플 토큰이 유효하지 않습니다.', 'error');
        return;
      }

      const result = await appleLogin(idToken);

      await handleSocialLogin(result);
    } catch (error: any) {
      if (error?.code === 'ERR_REQUEST_CANCELED') return;

      const serverCode = error?.response?.data?.code;
      const serverMsg = error?.response?.data?.message;

      if (serverCode) {
        await handleSocialLogin({
          code: serverCode,
          message: serverMsg,
          data: error.response.data.data,
        });
        return;
      }

      if (__DEV__) console.error('애플 로그인 실패:', error);
      showToast('애플 로그인 실패', 'error');
    }
  };

  // const handleLogin = async () => {
  //   if (!id.trim()) return showToast('이메일을 입력해줘', 'error');
  //   if (!isValidEmail(id))
  //     return showToast('올바른 이메일 형식이 아니야', 'error');
  //   if (!pw.trim()) return showToast('비밀번호를 입력해줘', 'error');

  //   try {
  //     const result = await postLogin(id.trim(), pw);

  //     if (result.code === 1003) {
  //       // 성공: 토큰/프로필 저장 후 화면 이동
  //       await saveAccessToken(result.data.accessToken);
  //       await saveRefreshToken(result.data.refreshToken);
  //       setName(result.data.name);
  //       setPosition(result.data.position);
  //       setCardinal(result.data.cardinal);
  //       await registerFcmToken();
  //       router.replace('/(page)/leenk');
  //     } else {
  //       showToast(result.message || '로그인에 실패했어', 'error');
  //     }
  //   } catch (e: any) {
  //     // 네트워크/서버 에러
  //     const status = e?.response?.status;
  //     const msg = e?.response?.data?.message ?? e?.message ?? '로그인 실패';
  //     console.log('[LOGIN ERROR]', status, msg);
  //     showToast(msg, 'error');
  //   }
  // };

  return (
    <Screen>
      <PopupModal
        isOpen={notRegisterModal}
        mainText="먼저 Weeth부터 가입해야 해"
        subText="Leets 활동을 위해 위드는 필수야"
        leftBtnText="닫기"
        rightBtnText="위드 가입하자"
        onRightBtn={handleSignUp}
        onLeftBtn={() => setNotRegisterModal(false)}
      />
      <PopupModal
        isOpen={waitModal}
        mainText="Weeth 가입 승인 대기중이야"
        subText="승인이 완료될 때까지 조금만 기다려줘."
        leftBtnText="닫기"
        rightBtnText="위드 보러가자"
        onRightBtn={handleSignUp}
        onLeftBtn={() => setWaitModal(false)}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 24 * height,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <LogoWrapper>
            <LogoGif
              source={require('@/assets/images/gif/ic_logo.gif')}
              contentFit="cover"
              transition={200}
            />
          </LogoWrapper>

          {/* <Form>
            <Title style={{ marginBottom: 8 * height }}>
              아이디<Asterisk> *</Asterisk>
            </Title>
            <Input
              placeholder="아이디를 입력해줘"
              value={id}
              onChangeText={(t) => setId(validEmailInput(t))}
              maxLength={30}
              isRequired
              returnKeyType="next"
            />

            <Title style={{ marginTop: 16 * height, marginBottom: 8 * height }}>
              비밀번호<Asterisk> *</Asterisk>
            </Title>
            <Input
              placeholder="비밀번호를 입력해줘"
              value={pw}
              onChangeText={setPw}
              maxLength={30}
              isRequired
              secureTextEntry
              returnKeyType="done"
            />

            <CustomButton
              size="md"
              fullWidth
              onPress={handleLogin}
              style={{ marginTop: 16 * height }}
            >
              로그인
            </CustomButton>
          </Form> */}

          <Divider />

          <ButtonSection
            style={{
              paddingLeft: FEED_PADDING * width,
              paddingRight: FEED_PADDING * width,
            }}
          >
            <CustomButton
              variant="apple"
              size="lg"
              fullWidth
              onPress={handleAppleLogin}
              style={{
                marginBottom: 12 * height,
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.04,
                shadowRadius: 20,
                elevation: 5,
              }}
              textStyle={{ fontFamily: fonts.ExtraBold }}
              icon={<AppleLogo width={19 * width} height={19 * height} />}
            >
              Apple로 로그인
            </CustomButton>
            <CustomButton
              variant="kakao"
              size="lg"
              fullWidth
              onPress={handleKakaoLogin}
              textStyle={{ fontFamily: fonts.ExtraBold }}
              icon={<KakaoLogo width={19 * width} height={19 * height} />}
              style={{ marginBottom: 0 }}
            >
              카카오로 로그인
            </CustomButton>

            <CustomButton
              variant="text"
              textColor="text[3]"
              size="md"
              fullWidth
              onPress={handleSignUp}
              style={{ marginTop: 12 * height }}
            >
              새로 가입하기
            </CustomButton>
          </ButtonSection>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.bg[2]};
`;

const LogoWrapper = styled.View`
  margin-bottom: ${85 * height}px;
`;

const LogoGif = styled(Image)`
  width: ${300 * width}px;
  height: ${200 * height}px;
`;

const Form = styled.View`
  width: 100%;
  align-items: flex-start;
`;

const Divider = styled.View`
  width: 100%;
  height: ${99 * height}px;
`;

const ButtonSection = styled.View`
  position: absolute;
  bottom: ${80 * height}px;
  width: 100%;
  align-items: center;
`;
