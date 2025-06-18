import { View, Modal, StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';
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
  mainText,
  subText,
  isCancel = true,
  isWarning = false,
  leftBtnText = '취소',
  rightBtnText,
}: PopupModalProps) {
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
            <Text style={styles.titleText}>{mainText}</Text>

            {subText && (
              <Text
                style={[
                  styles.subText,
                  { color: isWarning ? colors.secondary : colors.text[1] },
                ]}
              >
                {subText}
              </Text>
            )}

            <View style={styles.buttonContainer}>
              {/* 왼쪽 버튼 */}
              <Pressable
                onPress={onClose}
                style={[
                  styles.button,
                  isCancel ? styles.purpleButton : styles.grayButton,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: isCancel ? colors.white : colors.text[1] },
                  ]}
                >
                  {leftBtnText}
                </Text>
              </Pressable>

              {/* 오른쪽 버튼 */}
              <Pressable
                style={[
                  styles.button,
                  isCancel ? styles.grayButton : styles.purpleButton,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: isCancel ? colors.text[1] : colors.white },
                  ]}
                >
                  {rightBtnText}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: 16 * width,
    width: 302 * width,
    height: 158 * height,
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  titleText: {
    fontFamily: fonts.Bold,
    fontSize: fontSize.lg,
    fontWeight: '800',
    lineHeight: lineHeight.l,
    marginTop: 26 * height,
    color: colors.text[1],
  },
  subText: {
    fontFamily: fonts.Regular,
    fontSize: fontSize.md,
    lineHeight: lineHeight.m,
    marginTop: 4 * height,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20 * height,
    gap: 12 * width,
    width: 145.5 * width,
  },
  button: {
    flex: 1,
    height: 44 * height,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  purpleButton: {
    backgroundColor: colors.primary,
  },
  grayButton: {
    backgroundColor: colors.gray[300],
  },
  buttonText: {
    fontFamily: fonts.Regular,
    fontSize: fontSize.md,
    color: colors.white,
  },
});
