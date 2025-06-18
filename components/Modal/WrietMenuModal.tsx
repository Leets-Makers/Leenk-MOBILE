import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import {
  fonts,
  fontSize,
  lineHeight,
  radius,
  width,
  height,
} from '@/theme/globalStyles';

import LeenkIcon from '@/assets/images/ic_menu_leenk.svg';
import FeedIcon from '@/assets/images/ic_menu_feed.svg';
import colors from '@/theme/color';

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
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menuContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
            onPress={onPressLink}
          >
            <LeenkIcon width={20 * width} height={20 * width} />
            <Text style={styles.menuText}>링크 글 쓰기</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
            onPress={onPressFeed}
          >
            <FeedIcon width={20 * width} height={20 * width} />
            <Text style={styles.menuText}>피드 글 쓰기</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 105 * height,
    width: 134 * width,
    paddingVertical: 8 * height,
    paddingHorizontal: 10 * width,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    gap: 8 * height,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4 * height,
    paddingHorizontal: 4 * width,
    borderRadius: radius.sm,
    gap: 6 * width,
  },
  menuItemPressed: {
    backgroundColor: colors.bg[2],
  },
  menuText: {
    fontFamily: fonts.Regular,
    fontSize: fontSize.md,
    lineHeight: lineHeight.m,
    fontWeight: '700',
    color: colors.text[1],
  },
});
