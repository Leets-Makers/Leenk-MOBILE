import { Modal, Pressable, Platform, KeyboardAvoidingView } from 'react-native';
import styled from 'styled-components/native';
import { BlurView } from 'expo-blur';
import colors from '@/theme/color';
import { fonts, fontSize, radius, height, width } from '@/theme/globalStyles';
import { FeedReactedUser, FeedConnectedUser } from '@/types/feed';
import UserListModalContent from '../feed/UserListModalContent';
import { useEffect, useState } from 'react';
import { getFeedReactions } from '@/api/feed/feed.api';

interface Props {
  visible: boolean;
  title: string;
  list: (FeedConnectedUser | FeedReactedUser)[];
  onClose: () => void;
}

export default function UserListModal({
  visible,
  title,
  list,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Backdrop>
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <SheetContainer>
            <SheetBox>
              <BlurBackground intensity={20} tint="light">
                {Platform.OS === 'android' ? (
                  <FallbackBackground /> // 안드로이드용 fallback
                ) : null}
                <HandleBar />
                <Title>{title}</Title>

                {/* FlatList 요소 */}
                <UserListModalContent list={list} />
              </BlurBackground>
            </SheetBox>
          </SheetContainer>
        </KeyboardAvoidingView>
      </Backdrop>
    </Modal>
  );
}

const Backdrop = styled.Pressable`
  flex: 1;
  justify-content: flex-end;
`;

const SheetContainer = styled.View`
  padding-horizontal: ${16 * width}px;
  margin-bottom: ${30 * height}px;
  height: ${425 * height}px;
`;

const SheetBox = styled.View`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: ${radius.md}px;
  overflow: hidden;
`;

const BlurBackground = styled(BlurView)`
  background-color: rgba(255, 255, 255, 0.1);
  padding: ${8 * height}px ${16 * width}px;
  flex: 1;
`;

const FallbackBackground = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: -1;
`;

const HandleBar = styled.View`
  width: ${40 * width}px;
  height: ${4 * height}px;
  background-color: ${colors.gray[300]};
  border-radius: ${radius.xs}px;
  align-self: center;
  margin-bottom: 12px;
`;

const Title = styled.Text`
  font-size: ${fontSize.xl};
  font-family: ${fonts.ExtraBold};
  color: ${colors.text[1]};
  margin-bottom: ${16 * height}px;
  padding-top: ${10 * height}px;
`;
