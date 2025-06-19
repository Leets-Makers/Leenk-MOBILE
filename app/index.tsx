import React from 'react';
import styled from 'styled-components/native';
import { CustomButton } from '@/components';
import { height } from '@/theme/globalStyles';
import colors from '@/theme/color';

export default function LandingPage() {
  const handleKakaoLogin = () => {
    console.log('카카오 로그인');
  };

  return (
    <Container>
      <LogoGif source={require('@/assets/images/gif/ic_logo.gif')} />
      <KakaoLoginBtn source={require('@/assets/images/kakao_login_btn.png')} />
      <CustomButton
        onPress={handleKakaoLogin}
        variant="text"
        size="md"
        rounded="xs"
      >
        새로 가입하기
      </CustomButton>
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
  width: 300px;
  height: 300px;
`;

const KakaoLoginBtn = styled.Image`
  margin-top: ${256 * height}px;
`;
