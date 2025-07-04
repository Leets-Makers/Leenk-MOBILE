import { Header } from '@/components';
import PopupModal from '@/components/Modal/PopupModal';
import MyPageButton from '@/components/mypage/MypageButton';
import colors from '@/theme/color';
import { height, width } from '@/theme/globalStyles';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import styled from 'styled-components/native';
import { useToastStore } from '@/stores/toastStore';
import { deleteUser } from '@/api/users/deleteUser.api';

export default function AccountStatusPage() {
  const router = useRouter();
  const { showToast } = useToastStore();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const handleLogoutConfirm = () => {
    // TODO: 로그아웃 로직 추가
    console.log('로그아웃 실행');
    setLogoutModalVisible(false);
    setTimeout(() => {
      router.push('/');
    }, 200);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser();
      showToast('탈퇴 완료! 이용해주셔서 고마웠어요 :)', 'success');
      setDeleteModalVisible(false);
      setTimeout(() => {
        router.push('/');
      }, 200);
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      showToast('탈퇴에 실패했어. 다시 시도해줘.', 'error');
    }
  };

  return (
    <Container>
      <Header>계정관리</Header>
      <MarginContainer>
        <MyPageButton text="로그아웃" onPress={handleLogout} type="none" />
        <MyPageButton text="회원탈퇴" onPress={handleDelete} type="none" />
      </MarginContainer>

      {logoutModalVisible && (
        <PopupModal
          isOpen={logoutModalVisible}
          onClose={handleLogoutConfirm}
          onConfirm={() => setLogoutModalVisible(false)}
          mainText="로그아웃 할까?"
          leftBtnText="확인"
          rightBtnText="취소"
          isCancel
        />
      )}

      {deleteModalVisible && (
        <PopupModal
          isOpen={deleteModalVisible}
          mainText="회원탈퇴 할까?"
          subText="탈퇴한 계정은 복구할 수 없어."
          onClose={handleDeleteConfirm}
          onConfirm={() => setDeleteModalVisible(false)}
          leftBtnText="확인"
          rightBtnText="취소"
          isCancel
          isWarning
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
  padding-horizontal: ${20 * width}px;
`;

const MarginContainer = styled.View`
  margin-top: ${12 * height}px;
  gap: ${8 * height}px;
`;
