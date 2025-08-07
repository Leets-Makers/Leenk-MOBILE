import {
  CheckerIcon,
  ClockIcon,
  LocateIcon,
  PeopleIcon,
  RightArrowIcon,
  ShareIcon,
} from '@/assets';
import {
  CustomButton,
  Header,
  Loading,
  MenuModal,
  PopupModal,
  ProfileImageWithFallback,
} from '@/components';
import GradientOverlay from '@/components/feed/GradientOverlay';
import { CONTAINER_PADDING } from '@/constants';
import { useModalStore } from '@/stores/modalStore';
import { useToastStore } from '@/stores/toastStore';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { mockLeenkData } from '@/constants/mockUserData';
import { TimeText } from '@/components/leenk/LeenkListItem';
import { Pressable } from 'react-native';
import { formatRelativeTime } from '@/utils/format-date';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Share } from 'react-native';

export default function LeenkDetailPage() {
  const { id } = useLocalSearchParams();
  const { modalType, openModal, closeModal } = useModalStore();
  const { showToast } = useToastStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const isAuthor = false;
  const leenkData = mockLeenkData.find((item) => item.id === id);

  // 데이터 없을 때 방어처리
  if (!leenkData) {
    return <Loading />;
  }
  const handleDelete = () => {
    closeModal();
    openModal('deleteConfirm');
  };

  const handleEdit = () => {
    closeModal();
  };
  const handleReport = () => {
    closeModal();
    openModal('feedReport');
  };

  const handleParticipants = () => {
    router.push('/leenk/participants-list');
  };

  const handleConfirmDelete = async () => {
    try {
      // TODO: 링크 삭제 함수 추가
      showToast('삭제 완료!', 'success');

      setTimeout(() => {
        router.replace('/(page)/feed');
      }, 1500);
    } catch (err: any) {
      console.error('링크 삭제 오류:', err);
      showToast('삭제 실패!', 'error');
    } finally {
      closeModal();
    }
  };

  // TODO: 게시물 링크 외부 공유 및 링킹 처리
  const handleShare = async () => {
    try {
      await Share.share({ message: leenkData.title });
    } catch (error) {
      showToast('공유에 실패했어요', 'error');
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
        {leenkData.leenkImageUri ? (
          <Image
            source={{ uri: leenkData.leenkImageUri }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
        ) : (
          <CheckerWrapper>
            <CheckerIcon width="100%" height="100%" />
          </CheckerWrapper>
        )}
      </ImageContainer>
      <ContentWrapper
        $insetBottom={insets.bottom}
        showsVerticalScrollIndicator={false}
      >
        <TitleRow>
          <Title>{leenkData.title}</Title>
          <Pressable onPress={handleShare}>
            <ShareIcon width={20 * width} height={20 * width} />
          </Pressable>
        </TitleRow>

        <RowWrapper>
          <ProfileImageWithFallback uri={leenkData.profileImageUri} size={24} />
          <TimeText>{leenkData.name}</TimeText>
          <TimeText>
            ・{formatRelativeTime(leenkData.createdAt as string)}
          </TimeText>
        </RowWrapper>
        <Line />
        <RowWrapper>
          <PeopleIcon width={width * 16} />
          <TimeText>
            {leenkData.participantCount}/{leenkData.allParticipants}명
          </TimeText>
          <Pressable onPress={handleParticipants}>
            <RightArrowIcon width={width * 16} />
          </Pressable>
        </RowWrapper>
        <RowWrapper>
          <LocateIcon width={width * 16} />
          <TimeText>{leenkData.place}</TimeText>
        </RowWrapper>
        <RowWrapper>
          <ClockIcon width={width * 16} />
          <TimeText>{leenkData.date}</TimeText>
        </RowWrapper>
        <ContentText>{leenkData.cotent}</ContentText>
      </ContentWrapper>
      <ButtonContainer $insetBottom={insets.bottom}>
        {isAuthor ? (
          <>
            {' '}
            <CustomButton
              variant="secondary"
              textColor="text[2]"
              onPress={() => router.push('/leenk/participants-list')}
              rounded="md"
              size="lg"
            >
              모임원 관리
            </CustomButton>
            <CustomButton
              variant="primary"
              onPress={() => router.push('/')}
              rounded="md"
              size="lg"
              style={{ flex: 1, marginLeft: 10 * width }}
            >
              모집 종료할래
            </CustomButton>
          </>
        ) : (
          <CustomButton
            variant="primary"
            onPress={() => router.push('/')}
            rounded="md"
            size="lg"
            fullWidth
          >
            참여할래
          </CustomButton>
        )}
      </ButtonContainer>
      {isAuthor ? (
        <MenuModal
          visible={modalType === 'menu'}
          isWrite={false}
          onClose={closeModal}
          onPressFirst={handleEdit}
          onPressSecond={handleDelete}
          firstOptionText="수정하기"
          secondOptionText="삭제하기"
          isOneOption={false}
        />
      ) : (
        <MenuModal
          visible={modalType === 'menu'}
          isWrite={false}
          onClose={closeModal}
          onPressFirst={handleReport}
          firstOptionText="신고하기"
          isOneOption={true}
        />
      )}

      {modalType === 'deleteConfirm' && (
        <PopupModal
          isOpen={modalType === 'deleteConfirm'}
          onRightBtn={handleConfirmDelete}
          onLeftBtn={closeModal}
          isWarning
          mainText="모집글을 삭제할거야?"
          subText="삭제하면 복구할 수 없어."
          isCancel={true}
          leftBtnText="취소"
          rightBtnText="삭제할래"
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const ContentWrapper = styled.ScrollView<{ $insetBottom: number }>`
  flex: 1;
  padding-horizontal: ${width * CONTAINER_PADDING}px;
  padding-top: ${height * 16}px;
  padding-bottom: ${({ $insetBottom }) => $insetBottom + 120 * height}px;
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
const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-family: ${fonts.ExtraBold};
  color: ${colors.black};
  line-height: ${lineHeight.l};
  font-size: ${fontSize.lg};
`;

const RowWrapper = styled.View`
  display: flex;
  flex-direction: row;
  margin-top: ${12 * height}px;
`;

const Line = styled.View`
  height: ${height * 1}px;
  background-color: ${colors.divider[2]};
  margin-top: ${16 * height}px;
`;

const ContentText = styled.Text`
  margin-top: ${height * 20}px;
  font-family: ${fonts.Bold};
  color: ${colors.text[1]};
  line-height: ${lineHeight.m};
  font-size: ${fontSize.md};
`;

const ButtonContainer = styled.View<{ $insetBottom: number }>`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: ${height * 10}px ${width * CONTAINER_PADDING}px;
  padding-bottom: ${({ $insetBottom }) => $insetBottom + 10 * height}px;
  flex-direction: row;
  background-color: ${colors.white};
`;
