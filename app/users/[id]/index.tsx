import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { width, height } from '@/theme/globalStyles';
import { Header, Loading, MenuModal } from '@/components';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import ProfileCard from '@/components/mypage/ProfileCard';
import MyPageButton from '@/components/mypage/MypageButton';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useProfileStore } from '@/stores/profileStore';
import { getOtherUserInfo } from '@/api/users/getUsersInfo.api';
import { UserProfile } from '@/types/user';
import { useModalStore } from '@/stores/modalStore';

export default function MyPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userInfo, error, refetch } = useUserInfo();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { openModal, closeModal, modalType } = useModalStore();

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      try {
        const res = await getOtherUserInfo(Number(id));
        setProfile(res);
      } catch (error) {
        console.error('유저 정보 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (isLoading) return <Loading />;
  if (!profile) return null;

  return (
    <Container>
      <Header
        RightSection="KEBAB"
        kebabColor="black"
        kebabPress={() => openModal('menu')}
      >
        프로필
      </Header>
      {profile && (
        <ProfileCard
          cardinal={profile?.cardinal}
          name={profile?.name}
          imageUrl={profile?.profileImage}
          kakaoTalkId={profile?.kakaoTalkId}
          introduction={profile?.introduction}
          mbti={profile?.mbti}
        />
      )}
      <MyPageButton
        text="피드 보기"
        onPress={() => {
          router.push({
            pathname: '/users/feed',
            params: { userId: id },
          });
        }}
      />
      {/* <MyPageButton
        text="참여한 모임"
        onPress={() => router.push('/account/my-leenk')}
      /> */}
      <MenuModal
        visible={modalType === 'menu'}
        isWrite={false}
        onClose={closeModal}
        onPressFirst={() => {}} // 추후 수정하기 옵션 추가 시 사용
        onPressSecond={() => {}}
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
