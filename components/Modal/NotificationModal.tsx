import React from 'react';
import { Modal } from 'react-native';
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

  console.log(data.length);

  const isScrollable = data.length > 6;

  // TODO: Time Text에 시간 추가
  return (
    <Modal transparent visible={isOpen}>
      <Overlay onPress={onClose}>
        <Container>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) =>
              isFirstReaction(item) ? (
                <Item>
                  <Row>
                    <LeftSection>
                      <FeedIcon width={16} stroke={colors.primary} />
                      <TypeText>피드</TypeText>
                    </LeftSection>
                    <TimeText> </TimeText>
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
                    <TimeText> </TimeText>
                  </Row>
                  <ContentContainer>
                    <Title>{item.body}</Title>
                  </ContentContainer>
                </Item>
              )
            }
            scrollEnabled={isScrollable}
            showsVerticalScrollIndicator={false}
          />

          {isScrollable && (
            <GradientOverlay colors={['rgba(255,255,255,0)', colors.white]} />
          )}
        </Container>
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

const Container = styled.View`
  background-color: ${colors.white};
  align-items: center;
  width: 100%;
  max-height: ${400 * height};
  border-radius: ${radius.md}px;
  overflow: hidden;
  padding: 0 ${16 * height}px;
`;

const Item = styled.View`
  padding: ${12 * height}px ${16 * width}px;
  width: 100%;
`;

const ContentContainer = styled.View`
  margin-left: ${28 * width};
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
