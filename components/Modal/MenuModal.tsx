import React from 'react';
import { Modal, GestureResponderEvent } from 'react-native';
import styled from 'styled-components/native';
import {
  fonts,
  fontSize,
  lineHeight,
  radius,
  width,
  height,
} from '@/theme/globalStyles';
import colors from '@/theme/color';

import LeenkIcon from '@/assets/images/ic_menu_leenk.svg';
import FeedIcon from '@/assets/images/ic_menu_feed.svg';

interface MenuModalProps {
  visible: boolean;
  isWrite?: boolean;
  onClose: () => void;
  onPressFirst: (e: GestureResponderEvent) => void;
  onPressSecond: (e: GestureResponderEvent) => void;
}

export default function MenuModal({
  visible,
  isWrite = true,
  onClose,
  onPressFirst,
  onPressSecond,
}: MenuModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Overlay onPress={onClose}>
        <MenuContainer $isWrite={isWrite}>
          <MenuItemWrapper onPress={onPressFirst}>
            {({ pressed }) => (
              <MenuItem pressed={pressed} $isWrite={isWrite}>
                {isWrite ? (
                  <>
                    <LeenkIcon width={20 * width} height={20 * width} />
                    <MenuText $isWrite={isWrite}>링크 글 쓰기</MenuText>
                  </>
                ) : (
                  <MenuText $isWrite={isWrite}>수정하기</MenuText>
                )}
              </MenuItem>
            )}
          </MenuItemWrapper>

          <MenuItemWrapper onPress={onPressSecond}>
            {({ pressed }) => (
              <MenuItem pressed={pressed} $isWrite={isWrite}>
                {isWrite ? (
                  <>
                    <FeedIcon width={20 * width} height={20 * width} />
                    <MenuText $isWrite={isWrite}>피드 글 쓰기</MenuText>
                  </>
                ) : (
                  <MenuText $isWrite={isWrite}>삭제하기</MenuText>
                )}
              </MenuItem>
            )}
          </MenuItemWrapper>
        </MenuContainer>
      </Overlay>
    </Modal>
  );
}

const Overlay = styled.Pressable<{ $isWrite: boolean }>`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.3);
  align-items: 'center';
`;

const MenuContainer = styled.View<{ $isWrite: boolean }>`
  position: absolute;
  ${({ $isWrite }) =>
    $isWrite
      ? `bottom: ${105 * height}px; left: 50%; transform: translateX(-${(134 * width) / 2}px);`
      : ''}
  ${({ $isWrite }) => (!$isWrite ? `top: 88px; right: 20px;` : '')}
  width: ${({ $isWrite }) => ($isWrite ? 134 * width : 100 * width)}px;
  padding: ${8 * height}px ${10 * width}px;
  background-color: ${colors.white};
  border-radius: ${radius.md}px;
  gap: ${4 * height}px;
  elevation: 6;

  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
`;

const MenuItem = styled.View<{ pressed: boolean; $isWrite: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: ${({ $isWrite }) => ($isWrite ? 'flex-start' : 'center')};
  padding: ${4 * height}px ${4 * width}px;
  border-radius: ${radius.xs}px;
  gap: ${({ $isWrite }) => ($isWrite ? 6 * width : 0)}px;
  background-color: ${({ pressed }) =>
    pressed ? colors.bg[3] : 'transparent'};
`;

const MenuText = styled.Text<{ $isWrite: boolean }>`
  font-family: ${({ $isWrite }) => ($isWrite ? fonts.Bold : fonts.Regular)};
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.m}px;
`;

const MenuItemWrapper = styled.Pressable``;
