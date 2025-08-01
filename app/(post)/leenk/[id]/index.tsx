import {
  CheckerIcon,
  ClockIcon,
  LocateIcon,
  PeopleIcon,
  RightArrowIcon,
} from '@/assets';
import {
  CustomButton,
  Header,
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

export default function LeenkDetailPage() {
  const { id } = useLocalSearchParams();
  const { modalType, openModal, closeModal } = useModalStore();
  const { showToast } = useToastStore();
  const router = useRouter();

  const isAuthor = true;
  const leenkData = mockLeenkData[1];

  const handleDelete = () => {
    closeModal();
    openModal('deleteConfirm');
  };

  const handleReport = () => {
    closeModal();
    openModal('feedReport');
  };

  const handleParticipants = () => {
    router.push('/');
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
  return (
    <Container>
      <GradientOverlay type="top" heightValue={120 * height} />
      <Header
        isBackWhite
        RightSection="KEBAB"
        kebabPress={() => openModal('menu')}
        style={{
          position: 'absolute',
          top: 35,
          width: '100%',
          zIndex: 9999,
          paddingHorizontal: width * CONTAINER_PADDING,
        }}
      />
      <ImageContainer>
        {leenkData.leenkImageUri ? (
          <Image source={{ uri: leenkData.leenkImageUri }} />
        ) : (
          <CheckerIcon width={width * 80} />
        )}
      </ImageContainer>
      <CheckerIcon />
      <ContentWrapper>
        <Title>{leenkData.title}</Title>
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
        <ButtonContainer>
          <CustomButton
            variant="secondary"
            textColor="text[2]"
            onPress={() => router.push('/')}
            rounded="md"
            size="lg"
            style={{ width: 48 * width }}
          >
            참여자 관리
          </CustomButton>
          <CustomButton
            variant="primary"
            onPress={() => router.push('/')}
            rounded="md"
            size="lg"
            fullWidth
            style={{ marginLeft: 10 * width }}
          >
            모집 종료할래
          </CustomButton>
        </ButtonContainer>
      </ContentWrapper>
      <MenuModal
        visible={modalType === 'menu'}
        isWrite={false}
        onClose={closeModal}
        onPressFirst={() => {}}
        secondOptionText={isAuthor ? '삭제하기' : '신고하기'}
        onPressSecond={isAuthor ? handleDelete : handleReport}
      />
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
`;

const ContentWrapper = styled.View`
  padding-horizontal: ${width * CONTAINER_PADDING};
`;

const ImageContainer = styled.View`
  width: 100$
  height: ${height * 375}px;
`;

const Title = styled.Text`
  font-family: ${fonts.ExtraBold};
  color: ${colors.black};
  line-height: ${lineHeight.l};
  font-size: ${fontSize.lg};
`;

const RowWrapper = styled.View`
  diplay: flex;
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

const ButtonContainer = styled.View`
  diplay: flex;
  flex-direction: row;
  width: 100%;
  position: fix;
  padding-vertical: ${height * 10}px;
  z-index: 999;
`;
