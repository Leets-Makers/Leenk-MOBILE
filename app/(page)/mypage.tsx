import { useCallback, useEffect } from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { width, height } from '@/theme/globalStyles';
import { Header, Loading } from '@/components';
import { useFocusEffect, useRouter } from 'expo-router';
import ProfileCard from '@/components/mypage/ProfileCard';
import MyPageButton from '@/components/mypage/MypageButton';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useProfileStore } from '@/stores/profileStore';

export default function MyPage() {
  const router = useRouter();
  const { userInfo, error, refetch, loading } = useUserInfo();
  const { setkakaoTalkId, setintroduction, setMbti, setProfileImage } =
    useProfileStore();

  // 마이페이지 진입/포커스될 때마다 refetch 실행
  useFocusEffect(
    useCallback(() => {
      // error가 없을 때만 요청
      if (!error) {
        refetch();
      }
    }, [error, refetch]),
  );

  // userInfo 값이 변경될 때만 store 업데이트
  useEffect(() => {
    if (userInfo) {
      setkakaoTalkId(userInfo.kakaoTalkId);
      setintroduction(userInfo.introduction);
      setMbti(userInfo.mbti);
      setProfileImage(userInfo.profileImage);
    }
  }, [userInfo, setkakaoTalkId, setintroduction, setMbti, setProfileImage]);

  if (loading) return <Loading />;

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
          isMyProfile
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
