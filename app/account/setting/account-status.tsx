import { BackArrowIcon } from '@/assets';
import { Header } from '@/components';
import MyPageButton from '@/components/mypage/MypageButton';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export default function AccountStatusPage() {
  const router = useRouter();
  return (
    <Container>
      <Header
        LeftSection={
          <TouchableOpacity onPress={() => router.back()}>
            <BackArrowIcon />
          </TouchableOpacity>
        }
        TitleSection={
          <Text
            style={{
              fontWeight: 700,
              fontSize: fontSize.lg,
              fontFamily: fonts.Regular,
              lineHeight: lineHeight.l,
            }}
          >
            계정 관리
          </Text>
        }
      />
      <MarginContainer>
        <MyPageButton
          text="로그아웃"
          onPress={() => {
            console.log('알림설정');
          }}
          type="none"
        />
        <MyPageButton
          text="회원탈퇴"
          onPress={() => {
            router.push('/account/setting/help');
          }}
          type="none"
        />
      </MarginContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
  padding: ${28 * height}px ${20 * width}px;
`;
const MarginContainer = styled.View`
  margin-top: ${12 * height}px;
  gap: ${8 * height}px;
`;
