import { View, Modal, StyleSheet, Text } from 'react-native';
import React from 'react';

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
    backgroundColor: '#D1D1D1',
    fontFamily: 'NanumSquareNeo-Regular',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: 355,
    height: 448,
    borderRadius: 16,
  },

  titleText: {
    fontFamily: 'NanumSquareNeo-Bold',
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 22,
    marginTop: 22,
  },
});
