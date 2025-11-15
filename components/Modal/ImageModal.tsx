import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import { width, height, radius } from '@/theme/globalStyles';
import { TitleText, SubText, Overlay as PopupOverlay } from './PopupModal';
import { BirthdayLogoIcon } from '@/assets';
import { useModalStore } from '@/stores/modalStore';
import colors from '@/theme/color';

interface ImageModalProps {
  titleText: string;
  subText?: string;
  ImageComponent?: React.ReactNode;
  imageSize?: {
    width: number;
    height: number;
  };
  onClose?: () => void;
}

export default function ImageModal({
  titleText,
  subText,
  ImageComponent,
  imageSize = { width: 134, height: 134 },
  onClose,
}: ImageModalProps) {
  const { modalType, closeModal } = useModalStore();
  const isOpen = modalType === 'birthdayLetterFinish';

  // 자동 닫힘 (3초)
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      onClose?.();
    }, 3000);
    return () => clearTimeout(t);
  }, [isOpen, onClose]);

  return (
    <Modal animationType="none" transparent visible={isOpen}>
      {/* 배경 전체를 터치하면 닫힘 */}
      <TouchableWithoutFeedback onPress={closeModal}>
        <Overlay>
          <TouchableWithoutFeedback>
            <Container>
              <ImageWrapper
                style={{
                  width: imageSize.width,
                  height: imageSize.height,
                }}
              >
                {/*  ImageComponent 없으면 BirthdayLogoIcon */}
                {ImageComponent ?? (
                  <BirthdayLogoIcon
                    width={imageSize.width}
                    height={imageSize.height}
                  />
                )}
              </ImageWrapper>
              <TitleText>{titleText}</TitleText>
              {!!subText && <SubText>{subText}</SubText>}
            </Container>
          </TouchableWithoutFeedback>
        </Overlay>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  padding: 0 ${16 * width}px;
`;

export const Container = styled.View`
  background-color: ${colors.white};
  align-items: center;
  padding: ${40 * height}px ${16 * width}px;
  width: ${335 * width}px;
  border-radius: ${radius.lg}px;
  overflow: hidden;
  shadow-color: #7c7c7c;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
  elevation: 4;
`;

const ImageWrapper = styled.View`
  margin-bottom: ${24 * height}px;
  justify-content: center;
  align-items: center;
`;
