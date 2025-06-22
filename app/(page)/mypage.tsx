import React from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import LockIcon from '@/assets/images/ic_lock.svg';
import {
  fontSize,
  lineHeight,
  radius,
  fonts,
  width,
  height,
} from '@/theme/globalStyles';
import { Header } from '@/components';
import { Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SettingIcon } from '@/assets';
import ProfileCard from '@/components/mypage/ProfileCard';

export default function MyPage() {
  const router = useRouter();

  const mockUserData = {
    name: '이한별',
    cardinal: 3,
    intro:
      '안녕하세요 디자이너 이한별입니다. 저는 지금 배가 고파요. 전자정보도서관에서 모각작 하실 분 모집합니다. 우하하 우하하',
    kakaoId: 'hahanbyeol1234',
    mbti: 'ISTP',
  };

  return (
    <Container>
      <Header
        TitleSection={
          <Text
            style={{
              fontWeight: 700,
              fontSize: fontSize.lg,
              fontFamily: fonts.Regular,
              lineHeight: lineHeight.l,
            }}
          >
            마이 페이지
          </Text>
        }
        RightSection={
          <TouchableOpacity onPress={() => router.push('/')}>
            <SettingIcon />
          </TouchableOpacity>
        }
      />
      <ProfileCard
        cardinal={mockUserData.cardinal}
        name={mockUserData.name}
        kakaoId={mockUserData.kakaoId}
        intro={mockUserData.intro}
        mbti={mockUserData.mbti}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.bg[2]};
  gap: 20px;
`;
