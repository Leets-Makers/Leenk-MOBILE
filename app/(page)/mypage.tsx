import React from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { width, height } from '@/theme/globalStyles';
import { Header } from '@/components';
import { useRouter } from 'expo-router';
import ProfileCard from '@/components/mypage/ProfileCard';
import MyPageButton from '@/components/mypage/MypageButton';
import { mockUserData } from '@/constants/mockUserData';
import { useUserInfo } from '@/hooks/useUserInfo';

export default function MyPage() {
  const router = useRouter();
  const { userInfo } = useUserInfo();

  return (
    <Container>
      <Header LeftSection="NONE" RightSection="SETTING">
        마이페이지
      </Header>
      {userInfo && (
        <ProfileCard
          cardinal={userInfo?.cardinal}
          name={userInfo?.name}
          imageUrl={userInfo?.profileImage}
          kakaoTalkId={userInfo?.kakaoTalkId}
          introduction={userInfo?.introduction}
          mbti={userInfo?.mbti}
        />
      )}
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
  padding-horizontal: ${20 * width}px;
`;
