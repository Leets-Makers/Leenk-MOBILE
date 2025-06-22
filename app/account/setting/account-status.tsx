import { BackArrowIcon } from '@/assets';
import { Header } from '@/components';
import PopupModal from '@/components/Modal/PopupModal';
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
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export default function AccountStatusPage() {
  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    console.log(logoutModalVisible);
  }, [logoutModalVisible]);

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

  const handleDeleteConfirm = () => {
    // TODO: 회원탈퇴 로직 추가
    console.log('회원탈퇴 실행');
    setDeleteModalVisible(false);
    setTimeout(() => {
      router.push('/');
    }, 200);
  };

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
        <MyPageButton text="로그아웃" onPress={handleLogout} type="none" />
        <MyPageButton text="회원탈퇴" onPress={handleDelete} type="none" />
      </MarginContainer>

      {logoutModalVisible && (
        <PopupModal
          isOpen={logoutModalVisible}
          onClose={() => setLogoutModalVisible(false)}
          onConfirm={handleLogoutConfirm}
          mainText="로그아웃 할까?"
          leftBtnText="취소"
          rightBtnText="확인"
          isCancel
        />
      )}

      {deleteModalVisible && (
        <PopupModal
          isOpen={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={handleDeleteConfirm}
          mainText="회원탈퇴 할까?"
          subText="탈퇴한 계정은 복구할 수 없어."
          leftBtnText="취소"
          rightBtnText="확인"
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
  padding: ${28 * height}px ${20 * width}px;
`;

const MarginContainer = styled.View`
  margin-top: ${12 * height}px;
  gap: ${8 * height}px;
`;
