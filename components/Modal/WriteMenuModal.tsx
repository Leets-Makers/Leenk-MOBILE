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

interface WriteMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onPressLink: (e: GestureResponderEvent) => void;
  onPressFeed: (e: GestureResponderEvent) => void;
}

export default function WriteMenuModal({
  visible,
  onClose,
  onPressLink,
  onPressFeed,
}: WriteMenuModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Overlay onPress={onClose}>
        <MenuContainer>
          <MenuItem onPress={onPressLink}>
            <LeenkIcon width={20 * width} height={20 * width} />
            <MenuText>링크 글 쓰기</MenuText>
          </MenuItem>
          <MenuItem onPress={onPressFeed}>
            <FeedIcon width={20 * width} height={20 * width} />
            <MenuText>피드 글 쓰기</MenuText>
          </MenuItem>
        </MenuContainer>
      </Overlay>
    </Modal>
  );
}

const Overlay = styled.Pressable`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.3);
  align-items: center;
`;

const MenuContainer = styled.View`
  position: absolute;
  bottom: ${105 * height}px;
  width: ${134 * width}px;
  padding: ${8 * height}px ${10 * width}px;
  background-color: ${colors.white};
  border-radius: ${radius.md}px;
  gap: ${8 * height}px;
  elevation: 6;

  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
`;

const MenuItem = styled.Pressable.attrs(() => ({
  android_ripple: { color: colors.bg[2], borderless: false },
}))`
  flex-direction: row;
  align-items: center;
  padding: ${4 * height}px ${4 * width}px;
  border-radius: ${radius.sm}px;
  gap: ${6 * width}px;
`;

const MenuText = styled.Text`
  font-family: ${fonts.Regular};
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.m}px;
  font-weight: 700;
  color: ${colors.text[1]};
`;
