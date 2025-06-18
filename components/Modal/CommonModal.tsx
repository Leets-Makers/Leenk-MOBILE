import { View, Modal, StyleSheet, Text } from 'react-native';
import React from 'react';
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
    <View>
      <Modal
        animationType="none"
        transparent={true}
        visible={isOpen}
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.titleText}>{title}</Text>
            {children}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: 16 * width,
    width: 355 * width,
    height: 448 * height,
    borderRadius: radius.md,
  },
  titleText: {
    fontFamily: fonts.Bold,
    fontSize: fontSize.xl,
    fontWeight: '800',
    lineHeight: lineHeight.l,
    marginTop: 22 * height,
    color: colors.black,
  },
});
