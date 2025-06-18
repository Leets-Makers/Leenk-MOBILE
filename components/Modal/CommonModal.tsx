import React from 'react';
import { Modal } from 'react-native';
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

interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
}

export default function CommonModal({
  isOpen,
  onClose,
  title,
  children,
}: CommonModalProps) {
  return (
    <Modal
      animationType="none"
      transparent
      visible={isOpen}
      onRequestClose={onClose}
    >
      <Overlay onPress={onClose}>
        <Container>
          <Title>{title}</Title>
          {children}
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
`;

const Container = styled.View`
  background-color: ${colors.white};
  align-items: center;
  padding: 0 ${16 * width}px;
  width: ${355 * width}px;
  height: ${448 * height}px;
  border-radius: ${radius.md}px;
`;

const Title = styled.Text`
  font-family: ${fonts.Bold};
  font-size: ${fontSize.xl}px;
  font-weight: 800;
  line-height: ${lineHeight.l}px;
  margin-top: ${22 * height}px;
  color: ${colors.black};
`;
