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
  const topPosition = Platform.OS === 'ios' ? 95 * height : 50 * height;

  const DANGER_LABELS = ['신고하기', '삭제하기', '차단하기'] as const;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Overlay onPress={onClose}>
        <MenuContainer $isWrite={isWrite} $topPosition={topPosition}>
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
                      $isDanger={
                        isDanger ||
                        DANGER_LABELS.includes(
                          firstOptionText as
                            | '신고하기'
                            | '삭제하기'
                            | '차단하기',
                        )
                      }
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
                        $isDanger={DANGER_LABELS.includes(
                          secondOptionText as
                            | '신고하기'
                            | '삭제하기'
                            | '차단하기',
                        )}
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

const Overlay = styled.Pressable<{ $isWrite: boolean }>`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.3);
  align-items: center;
`;

const MenuContainer = styled.View<{ $isWrite: boolean; $topPosition: number }>`
  position: absolute;
  ${({ $isWrite, $topPosition }) =>
    $isWrite
      ? `bottom: ${70 * height}px; left: 50%; transform: translateX(-${(134 * width) / 2}px);`
      : `top: ${$topPosition * height}px; right: 20px; align-items: center;`}
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
  justify-content: center;
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
