import { CheckerIcon, ReviewIcon, ShareIcon } from '@/assets';
import {
  BottomSheetModal,
  CustomButton,
  Header,
  Loading,
  MenuModal,
  PopupModal,
} from '@/components';
import GradientOverlay from '@/components/feed/GradientOverlay';
import { CONTAINER_PADDING } from '@/constants';
import { useModalStore } from '@/stores/modalStore';
import { useToastStore } from '@/stores/toastStore';
import colors from '@/theme/color';
import { height, width } from '@/theme/globalStyles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { mockLeenkData } from '@/constants/mockUserData';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Share } from 'react-native';
import { SubText, TitleText } from '@/components/OnBoarding';
import { useState } from 'react';
import LeenkContentSection from '@/components/leenk/LeenkDetailContent';
import LeenkBottomButtonSection from '@/components/leenk/LeenkDetailBottomButton';
import ReportModal from '@/components/Modal/ReportModal';

export default function LeenkDetailPage() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const leenkId = Array.isArray(id) ? id[0] : id;
  const { modalType, openModal, closeModal } = useModalStore();
  const { showToast } = useToastStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isParticipating, setIsParticipating] = useState(false);
  const [isLeenkEnd, setIsLeenkEnd] = useState(false);

  const isAuthor = true;
  const leenkData = mockLeenkData.find((item) => item.id === leenkId);

  if (!leenkData) return <Loading />;

  const {
    title,
    place,
    content,
    date,
    name,
    createdAt,
    profileImageUri,
    participantCount,
    allParticipants,
    leenkImageUri,
  } = leenkData;

  const handleDelete = () => {
    closeModal();
    openModal('deleteConfirm');
  };

  const handleEdit = () => closeModal();

  const handleReport = () => {
    closeModal();
    openModal('leenkReport');
  };

  const handleLeenkCloseModal = () => openModal('leenkClose');

  const handleLeenkClose = () => {
    openModal('bottomSheet');
  };

  const handleParticipants = () => {
    router.push('/leenk/participants-list');
  };

  const handleConfirmDelete = async () => {
    try {
      showToast('삭제 완료!', 'success');
      setTimeout(() => {
        router.replace('/feed');
      }, 1500);
    } catch (err: any) {
      console.error('링크 삭제 오류:', err);
      showToast('삭제 실패!', 'error');
    } finally {
      closeModal();
    }
  };

  const handleLeave = () => {
    setIsParticipating(false);
    closeModal();
    // TODO: 유저 나가기 api 추가
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: title });
    } catch (error) {
      showToast('공유에 실패했어요', 'error');
    }
  };

  const renderPopupModal = () => {
    switch (modalType) {
      case 'deleteConfirm':
        return (
          <PopupModal
            isOpen
            onRightBtn={handleConfirmDelete}
            onLeftBtn={closeModal}
            isWarning
            mainText="모집글을 삭제할거야?"
            subText="삭제하면 복구할 수 없어."
            isCancel
            leftBtnText="취소"
            rightBtnText="삭제할래"
          />
        );
      case 'leenkLeave':
        return (
          <PopupModal
            isOpen
            onRightBtn={handleLeave}
            onLeftBtn={closeModal}
            isWarning
            mainText="정말 떠날거야?"
            subText={
              title.length > 10
                ? `${title.slice(0, 10)}...에서 나가지게 돼.`
                : `${title}에서 나가지게 돼.`
            }
            isCancel
            leftBtnText="취소"
            rightBtnText="나갈래"
          />
        );
      case 'leenkClose':
        return (
          <PopupModal
            isOpen
            onRightBtn={handleLeenkClose}
            onLeftBtn={closeModal}
            isWarning
            mainText={`아직 모임 시간이 아니야! \n모집을 종료할까?`}
            subText="종료하면 다시 모집할 수 없어."
            isCancel
            leftBtnText="취소"
            rightBtnText="종료할래"
          />
        );
      case 'leenkEarlyClose':
        return (
          <PopupModal
            isOpen
            onRightBtn={handleLeenkClose}
            onLeftBtn={closeModal}
            mainText={`링크 시간이 아직 남았어! \n일찍 끝낼거야?`}
            isCancel
            leftBtnText="취소"
            rightBtnText="삭제할래"
          />
        );
      case 'leenkReport':
        return <ReportModal type="leenk" />; // TODO : 신고하기 api 연결 시 linkId 추가
      default:
        return null;
    }
  };

  return (
    <Container>
      <GradientOverlay type="top" heightValue={120 * height} />
      <Header
        isBackWhite
        RightSection="KEBAB"
        kebabPress={() => openModal('menu')}
        style={{
          position: 'absolute',
          width: '100%',
          zIndex: 9999,
          paddingHorizontal: width * CONTAINER_PADDING,
        }}
      />
      <ImageContainer>
        {leenkImageUri ? (
          <Image
            source={{ uri: leenkImageUri }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
        ) : (
          <CheckerWrapper>
            <CheckerIcon width="100%" height="100%" />
          </CheckerWrapper>
        )}
      </ImageContainer>

      <LeenkContentSection
        title={title}
        place={place}
        content={content}
        date={date}
        name={name}
        createdAt={createdAt}
        profileImageUri={profileImageUri}
        participantCount={participantCount}
        allParticipants={allParticipants}
        insetBottom={insets.bottom}
        onShare={handleShare}
        onParticipants={handleParticipants}
      />

      <LeenkBottomButtonSection
        isAuthor={isAuthor}
        isParticipating={isParticipating}
        insetBottom={insets.bottom}
        onLeave={() => openModal('leenkLeave')}
        onEalryClose={() => openModal('leenkEarlyClose')}
        onClose={handleLeenkCloseModal}
        onJoin={() => setIsParticipating(true)}
        onParticipants={handleParticipants}
        isLeenkEnd={isLeenkEnd}
      />

      <MenuModal
        visible={modalType === 'menu'}
        isWrite={false}
        onClose={closeModal}
        onPressFirst={isAuthor ? handleEdit : handleReport}
        onPressSecond={isAuthor ? handleDelete : undefined}
        firstOptionText={isAuthor ? '수정하기' : '신고하기'}
        secondOptionText={isAuthor ? '삭제하기' : undefined}
        isOneOption={!isAuthor}
      />

      {renderPopupModal()}

      {modalType === 'bottomSheet' && (
        <BottomSheetModal visible={true}>
          <TitleText>{'링크가 마무리 됐어 :)'}</TitleText>
          <SubText>수고했어! 후기 남기러 가볼까?</SubText>
          <ReviewIcon
            height={200}
            width={200}
            style={{
              alignSelf: 'center',
              marginTop: 16 * height,
              marginBottom: 40 * height,
            }}
          />
          <CustomButton
            fullWidth
            onPress={() => {
              closeModal();
              router.push('/feed');
            }}
          >
            후기 쓰러갈래
          </CustomButton>
          <CustomButton
            variant="text"
            textColor="text[2]"
            fullWidth
            onPress={() => {
              closeModal();
              setIsLeenkEnd(true);
            }}
          >
            나중에 할래
          </CustomButton>
        </BottomSheetModal>
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const ImageContainer = styled.View`
  ${StyleSheet.absoluteFillObject};
  width: 100%;
  height: ${height * 375}px;
  position: relative;
`;
const CheckerWrapper = styled.View`
  ${StyleSheet.absoluteFillObject};
  justify-content: center;
  align-items: center;
  background-color: ${colors.bg[2]};
`;
