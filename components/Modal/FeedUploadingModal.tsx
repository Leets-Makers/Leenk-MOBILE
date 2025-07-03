import React from 'react';
import styled from 'styled-components/native';
import { Modal } from 'react-native';
import { width, height, radius } from '@/theme/globalStyles';
import { TitleText, SubText, Overlay } from './PopupModal';
import Loading from '@/components/common/Loading';
import colors from '@/theme/color';

interface FeedUploadModalProps {
  isOpen: boolean;
}

export default function FeedUploadModal({ isOpen }: FeedUploadModalProps) {
  return (
    <Modal
      animationType="none"
      transparent
      visible={isOpen}
      onRequestClose={() => {}}
    >
      <Overlay>
        <Container>
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
          <TitleText>게시물을 올리는 중이야</TitleText>
          <SubText>조금만 기다려줘!</SubText>
        </Container>
      </Overlay>
    </Modal>
  );
}

const Container = styled.View`
  background-color: ${colors.white};
  align-items: center;
  padding: 0 ${16 * width}px;
  width: ${335 * width}px;
  height: ${150 * height}px;
  border-radius: ${radius.md}px;
  justify-content: center;
`;

const LoadingWrapper = styled.View`
  margin-bottom: ${24 * height}px;
`;
