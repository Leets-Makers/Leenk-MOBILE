import { Modal, Platform, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { width, height, radius, fonts } from '@/theme/globalStyles';
import colors from '@/theme/color';
import { FlatList } from 'react-native-gesture-handler';
import {
  FeedFirstReaction,
  FeedReactionCount,
  NewLeenkParticipantDetails,
  ModalData,
} from '@/types/notification';
import LinearGradient from 'react-native-linear-gradient';
import { LeftSection, Row, TypeText } from '../NotificationListItem';
import { FeedIcon, LeenkIcon } from '@/assets';
import { Title } from '../common/Input';
import { SubText } from './PopupModal';

export default function NotificationModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: ModalData[];
}) {
  // 타입 가드
  const isFirstReaction = (item: ModalData): item is FeedFirstReaction =>
    (item as FeedFirstReaction).name !== undefined;

  const isReactionCount = (item: ModalData): item is FeedReactionCount =>
    (item as FeedReactionCount).body !== undefined &&
    (item as any).name === undefined;

  const isNewParticipant = (
    item: ModalData,
  ): item is NewLeenkParticipantDetails =>
    (item as NewLeenkParticipantDetails).participantName !== undefined;

  const isScrollable = data.length >= 4;

  return (
    <Modal
      transparent={Platform.OS !== 'ios'}
      visible={isOpen}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'overFullScreen'}
    >
      <Overlay>
        <TouchableWithoutFeedback onPress={onClose}>
          <Background />
        </TouchableWithoutFeedback>

        <ContainerWrapper isScrollable={isScrollable}>
          <Container isScrollable={isScrollable}>
            <FlatList
              data={data}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => {
                // FeedFirstReaction
                if (isFirstReaction(item)) {
                  return (
                    <Item>
                      <Row>
                        <LeftSection>
                          <FeedIcon width={16} stroke={colors.primary} />
                          <TypeText>피드</TypeText>
                        </LeftSection>
                      </Row>
                      <ContentContainer>
                        <SubText>{item.body}</SubText>
                        <Title>{item.name}</Title>
                      </ContentContainer>
                    </Item>
                  );
                }

                // FeedReactionCount
                if (isReactionCount(item)) {
                  return (
                    <Item>
                      <Row>
                        <LeftSection>
                          <FeedIcon width={16} stroke={colors.primary} />
                          <TypeText>피드</TypeText>
                        </LeftSection>
                      </Row>
                      <ContentContainer>
                        <Title>{item.body}</Title>
                      </ContentContainer>
                    </Item>
                  );
                }

                // NewLeenkParticipantDetails
                if (isNewParticipant(item)) {
                  return (
                    <Item>
                      <Row>
                        <LeftSection>
                          <LeenkIcon width={16} stroke={colors.primary} />
                          <TypeText>링크</TypeText>
                        </LeftSection>
                      </Row>
                      <ContentContainer>
                        <StyledTitle>{item.participantName}</StyledTitle>
                      </ContentContainer>
                    </Item>
                  );
                }

                return null;
              }}
              ItemSeparatorComponent={() => <ItemGap />}
              scrollEnabled={isScrollable}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
            />

            {isScrollable && (
              <GradientOverlay colors={['rgba(255,255,255,0)', colors.white]} />
            )}
          </Container>
        </ContainerWrapper>
      </Overlay>
    </Modal>
  );
}

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 0 ${10 * width}px;
`;

const Background = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ContainerWrapper = styled.View<{ isScrollable: boolean }>`
  width: 100%;
  max-height: ${400 * height}px;
  justify-content: ${({ isScrollable }) =>
    isScrollable ? 'flex-start' : 'center'};
  align-items: center;
`;

const Container = styled.View<{ isScrollable: boolean }>`
  width: 100%;
  background-color: ${colors.white};
  border-radius: ${radius.md}px;
  overflow: hidden;
  padding: ${16 * height}px ${16 * width}px;
`;

const ItemGap = styled.View`
  height: ${24 * height}px;
`;

const Item = styled.View`
  width: 100%;
`;

const ContentContainer = styled.View`
  margin-left: ${28 * width}px;
  display: flex;
  gap: ${6 * height}px;
  align-items: flex-start;
`;

const GradientOverlay = styled(LinearGradient).attrs({
  pointerEvents: 'none',
})`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${60 * height}px;
  z-index: 1;
`;

const StyledTitle = styled(SubText)`
  color: ${colors.text[1]};
`;
