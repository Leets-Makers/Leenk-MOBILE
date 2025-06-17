import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import colors from '@/theme/color';

import LeenkIcon from '@/assets/images/ic_menu_leenk.svg';
import FeedIcon from '@/assets/images/ic_nebu_feed.svg';

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
          <Pressable style={styles.menuItem} onPress={onPressLink}>
            <LeenkIcon width={20} height={20} />
            <Text style={styles.menuText}>링크 글 쓰기</Text>
          </Pressable>
          <Pressable style={styles.menuItem} onPress={onPressFeed}>
            <FeedIcon width={20} height={20} />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContainer: {
    width: 130,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 4,
    gap: 10,
  },
  menuText: {
    fontFamily: 'NanumSquareNeo-Regular',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: 700,
    color: colors.black,
  },
});
