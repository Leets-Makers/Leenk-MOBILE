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
import MyPageButton from '@/components/mypage/MypageButton';
import { mockUserData } from '@/constants/mockData';

export default function MyPage() {
  const router = useRouter();

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
          <TouchableOpacity onPress={() => router.push('/account/setting')}>
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
      <MyPageButton
        text="피드 보기"
        onPress={() => router.push('/account/my-feed')}
      />
      <MyPageButton
        text="참여한 모임"
        onPress={() => router.push('/account/my-leenk')}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: ${colors.bg[2]};
  gap: ${13 * height}px;
  padding-top: ${28 * height}px;
  padding-horizontal: ${20 * width}px;
`;
