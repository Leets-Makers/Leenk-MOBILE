import React from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import {
  width,
  height,
  fontSize,
  fonts,
  lineHeight,
  radius,
} from '@/theme/globalStyles';
import colors from '@/theme/color';

/* 
🦄스타일링 설명
📢 mainText: 팝업 타이틀
📢 subText: 부가 설명
📢 isWarning: 부가 설명 색 설정 true-> 붉은 경고 / false-> 검정
📢 isCancel: 버튼 색 설정 true-> 왼쪽 보라색, 오른쪽 회색 / false-> 왼쪽 회색, 오른쪽 보라색
*/

//TODO: 버튼 공용 컴포넌트로 변경

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mainText: string;
  subText?: string;
  isWarning?: boolean;
  isCancel?: boolean;
  leftBtnText?: string;
  rightBtnText: string;
}

export default function PopupModal({
  isOpen,
  onClose,
  onConfirm,
  mainText,
  subText,
  isCancel = true,
  isWarning = false,
  leftBtnText = '취소',
  rightBtnText,
}: PopupModalProps) {
  return (
    <Modal
      animationType="none"
      transparent
      visible={isOpen}
      onRequestClose={onClose}
    >
      <Overlay>
        <Container>
          <TitleText>{mainText}</TitleText>
          {subText && <SubText $isWarning={isWarning}>{subText}</SubText>}
          <ButtonRow>
            <StyledButton $isPurple={isCancel} onPress={onClose}>
              <ButtonLabel $isWhite={isCancel}>{leftBtnText}</ButtonLabel>
            </StyledButton>
            <StyledButton $isPurple={!isCancel} onPress={onConfirm}>
              <ButtonLabel $isWhite={!isCancel}>{rightBtnText}</ButtonLabel>
            </StyledButton>
          </ButtonRow>
        </Container>
      </Overlay>
    </Modal>
  );
}

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  background-color: ${colors.white};
  align-items: center;
  padding: 0 ${16 * width}px;
  width: ${302 * width}px;
  height: ${158 * height}px;
  border-radius: ${radius.lg}px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
`;

const TitleText = styled.Text`
  font-family: ${fonts.Bold};
  font-size: ${fontSize.lg}px;
  font-weight: 800;
  line-height: ${lineHeight.l}px;
  margin-top: ${26 * height}px;
  color: ${colors.text[1]};
`;

const SubText = styled.Text<{ $isWarning: boolean }>`
  font-family: ${fonts.Regular};
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.m}px;
  margin-top: ${4 * height}px;
  color: ${({ $isWarning }) =>
    $isWarning ? colors.secondary : colors.text[1]};
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${20 * height}px;
  gap: ${12 * width}px;
  width: ${145.5 * width}px;
`;

const StyledButton = styled.Pressable<{ $isPurple: boolean }>`
  flex: 1;
  height: ${44 * height}px;
  border-radius: ${radius.md}px;
  justify-content: center;
  align-items: center;
  background-color: ${({ $isPurple }) =>
    $isPurple ? colors.primary : colors.gray[300]};
`;

const ButtonLabel = styled.Text<{ $isWhite: boolean }>`
  font-family: ${fonts.Regular};
  font-size: ${fontSize.md}px;
  color: ${({ $isWhite }) => ($isWhite ? colors.white : colors.text[1])};
`;
