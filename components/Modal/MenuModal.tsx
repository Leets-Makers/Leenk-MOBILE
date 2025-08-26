import React from 'react';
import { Modal, GestureResponderEvent, Platform } from 'react-native';
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
import { LeenkIcon, FeedIcon } from '@/assets';

interface MenuModalProps {
  visible: boolean;
  isWrite?: boolean;
  onClose: () => void;
  onPressFirst: (e: GestureResponderEvent) => void;
  onPressSecond?: (e: GestureResponderEvent) => void;
  firstOptionText?: string;
  secondOptionText?: string;
  isDanger?: boolean;
  isOneOption?: boolean;
}

export default function MenuModal({
  visible,
  isWrite = true,
  onClose,
  onPressFirst,
  onPressSecond,
  firstOptionText,
  secondOptionText,
  isDanger = false,
  isOneOption = true,
}: MenuModalProps) {
  const topPositionPx = Platform.OS === 'ios' ? 95 * height : 50 * height;
  const bottomMarginPx = Platform.OS === 'ios' ? 20 * height : 0;

  const DANGER_LABELS = ['신고하기', '삭제하기', '차단하기'] as const;

  const isDangerLabel = (txt?: string) =>
    !!txt && (DANGER_LABELS as readonly string[]).includes(txt);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Overlay onPress={onClose}>
        <MenuContainer
          $isWrite={isWrite}
          $topPosition={topPositionPx}
          $bottomMargin={bottomMarginPx}
        >
          {isWrite ? (
            <>
              <MenuItemWrapper onPress={onPressFirst}>
                {({ pressed }) => (
                  <MenuItem pressed={pressed} $isWrite={isWrite}>
                    <LeenkIcon
                      width={20 * width}
                      height={20 * width}
                      stroke={colors.primary}
                    />
                    <MenuText $isWrite={isWrite}>링크 글 쓰기</MenuText>
                  </MenuItem>
                )}
              </MenuItemWrapper>

              <MenuItemWrapper onPress={onPressSecond}>
                {({ pressed }) => (
                  <MenuItem pressed={pressed} $isWrite={isWrite}>
                    <FeedIcon
                      width={20 * width}
                      height={20 * width}
                      stroke={colors.primary}
                    />
                    <MenuText $isWrite={isWrite}>피드 글 쓰기</MenuText>
                  </MenuItem>
                )}
              </MenuItemWrapper>
            </>
          ) : (
            <>
              <MenuItemWrapper onPress={onPressFirst}>
                {({ pressed }) => (
                  <MenuItem pressed={pressed} $isWrite={isWrite}>
                    <MenuText
                      $isWrite={isWrite}
                      $isDanger={isDanger || isDangerLabel(firstOptionText)}
                    >
                      {firstOptionText}
                    </MenuText>
                  </MenuItem>
                )}
              </MenuItemWrapper>

              {secondOptionText && !isOneOption && (
                <MenuItemWrapper onPress={onPressSecond}>
                  {({ pressed }) => (
                    <MenuItem pressed={pressed} $isWrite={isWrite}>
                      <MenuText
                        $isWrite={isWrite}
                        $isDanger={isDangerLabel(secondOptionText)}
                      >
                        {secondOptionText}
                      </MenuText>
                    </MenuItem>
                  )}
                </MenuItemWrapper>
              )}
            </>
          )}
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

const MenuContainer = styled.View<{
  $isWrite: boolean;
  $topPosition: number;
  $bottomMargin: number;
}>`
  position: absolute;
  ${({ $isWrite, $topPosition }) =>
    $isWrite
      ? `
        bottom: ${70 * height}px;
        align-self: center;
      `
      : `
        top: ${$topPosition}px;
        right: ${20 * width}px;
        align-items: center;
      `}
  width: ${({ $isWrite }) => ($isWrite ? 134 * width : 100 * width)}px;
  padding: ${8 * height}px ${10 * width}px;
  background-color: ${colors.white};
  border-radius: ${radius.md}px;
  gap: ${4 * height}px;
  margin-bottom: ${({ $bottomMargin }) => $bottomMargin}px;
  /* Android */
  elevation: 6;
`;

const MenuItem = styled.View<{ pressed: boolean; $isWrite: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: ${({ $isWrite }) => ($isWrite ? 'flex-start' : 'center')};
  padding: ${({ pressed }) =>
    pressed
      ? `${4 * height}px ${12 * width}px`
      : `${4 * height}px ${4 * width}px`};
  border-radius: ${({ pressed }) => (pressed ? radius.sm : 0)}px;
  gap: ${({ $isWrite }) => ($isWrite ? 6 * width : 0)}px;
  background-color: ${({ pressed }) =>
    pressed ? colors.bg[3] : 'transparent'};
`;

const MenuText = styled.Text<{ $isWrite: boolean; $isDanger?: boolean }>`
  font-family: ${({ $isWrite }) => ($isWrite ? fonts.Bold : fonts.Regular)};
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.m}px;
  color: ${({ $isDanger }) => ($isDanger ? colors.pink[500] : colors.black)};
`;

const MenuItemWrapper = styled.Pressable``;
