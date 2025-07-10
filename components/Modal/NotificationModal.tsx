import React from 'react';
import { Modal, Text, View } from 'react-native';
import styled from 'styled-components/native';
import {
  width,
  height,
  fonts,
  fontSize,
  lineHeight,
  radius,
} from '@/theme/globalStyles';
import colors from '@/theme/color';
import { FlatList } from 'react-native-gesture-handler';
import { FeedFirstReaction, ModalData } from '@/types/notification';

export default function NotificationModal({
  isOpen,
  onClose,
  data,
  isLong = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: ModalData[];
  isLong?: boolean;
}) {
  const isFirstReaction = (item: ModalData): item is FeedFirstReaction =>
    (item as FeedFirstReaction).name !== undefined;

  return (
    <Modal transparent visible={isOpen}>
      <Overlay onPress={onClose}>
        <Container $isLong={isLong}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) =>
              isFirstReaction(item) ? (
                <View>
                  <Text>{item.body}</Text>
                  <Text>{item.name}</Text>
                </View>
              ) : (
                <View>
                  <Text>{item.body}</Text>
                  <Text>{item.reactionCount}개</Text>
                </View>
              )
            }
          />
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

const Container = styled.View<{ $isLong: boolean }>`
  background-color: ${colors.white};
  align-items: center;
  padding: 0 ${16 * width}px;
  height: ${(props) => (props.$isLong ? 500 * height : 348 * height)}px;
  border-radius: ${radius.md}px;
`;
