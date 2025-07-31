import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { width, height } from '@/theme/globalStyles';
import { Header, Loading, MenuModal, PopupModal } from '@/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ProfileCard from '@/components/mypage/ProfileCard';
import MyPageButton from '@/components/mypage/MypageButton';
import { getOtherUserInfo } from '@/api/users/getUsersInfo.api';
import { UserProfile } from '@/types/user';
import { useModalStore } from '@/stores/modalStore';
import { useToastStore } from '@/stores/toastStore';
import { blockUser } from '@/api/users/deleteUser.api';

export default function MyPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { openModal, closeModal, modalType } = useModalStore();
  const { showToast } = useToastStore();
  const handleBlock = useCallback(() => {
    closeModal();
    openModal('deleteConfirm');
  }, [closeModal, openModal]);

  const handleConfirmBlock = async () => {
    if (!profile?.id) return;
    try {
      await blockUser(profile?.id);
      showToast(`${profile?.name}을 차단했어.`, 'success');
      setTimeout(() => {
        router.replace('/(page)/feed'); // 차단 후 피드 목록으로 이동
      }, 1500);
    } catch (error) {
      console.error('유저 차단 오류 ', error);
      showToast(`${profile?.name} 차단 실패!`, 'error');
    } finally {
      closeModal();
    }
  };

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
        onPressSecond={handleBlock}
        secondOptionText="차단하기"
        isDanger
      />
      {modalType === 'deleteConfirm' && (
        <PopupModal
          isOpen={modalType === 'deleteConfirm'}
          onRightBtn={handleConfirmBlock}
          onLeftBtn={closeModal}
          isWarning
          mainText={`${profile?.name}을 차단할거야?`}
          subText="차단한 사람의 글을 볼 수 없어."
          isCancel={true}
          leftBtnText="취소"
          rightBtnText="차단할래"
        />
      )}
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
