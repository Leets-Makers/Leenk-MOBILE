import React from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { width, height, radius } from '@/theme/globalStyles';
import colors from '@/theme/color';
import { FlatList } from 'react-native-gesture-handler';
import { FeedFirstReaction, ModalData } from '@/types/notification';
import LinearGradient from 'react-native-linear-gradient';
import { LeftSection, Row, TimeText, TypeText } from '../NotificationListItem';
import { FeedIcon } from '@/assets';
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
  const isFirstReaction = (item: ModalData): item is FeedFirstReaction =>
    (item as FeedFirstReaction).name !== undefined;

  const isScrollable = data.length > 5;

  return (
    <Modal transparent visible={isOpen}>
      <Overlay>
        <TouchableWithoutFeedback onPress={onClose}>
          <Background />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => {}}>
          <ContainerWrapper isScrollable={isScrollable}>
            <Container isScrollable={isScrollable}>
              <FlatList
                data={data}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) =>
                  isFirstReaction(item) ? (
                    <Item>
                      <Row>
                        <LeftSection>
                          <FeedIcon width={16} stroke={colors.primary} />
                          <TypeText>피드</TypeText>
                        </LeftSection>
                        <TimeText>방금</TimeText>
                      </Row>
                      <ContentContainer>
                        <Title>{item.body}</Title>
                        <SubText>{item.name}</SubText>
                      </ContentContainer>
                    </Item>
                  ) : (
                    <Item>
                      <Row>
                        <LeftSection>
                          <FeedIcon width={16} stroke={colors.primary} />
                          <TypeText>피드</TypeText>
                        </LeftSection>
                        <TimeText>방금</TimeText>
                      </Row>
                      <ContentContainer>
                        <Title>{item.body}</Title>
                      </ContentContainer>
                    </Item>
                  )
                }
                ItemSeparatorComponent={() => <ItemGap />}
                scrollEnabled={isScrollable}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
              />

              {isScrollable && (
                <GradientOverlay
                  colors={['rgba(255,255,255,0)', colors.white]}
                />
              )}
            </Container>
          </ContainerWrapper>
        </TouchableWithoutFeedback>
      </Overlay>
    </Modal>
  );
}

const Overlay = styled.Pressable`
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
`;

const GradientOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${60 * height}px;
  z-index: 1;
  pointer-events: none;
`;
