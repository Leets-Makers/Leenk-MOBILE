import { View, Modal, StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';
import colors from '@/theme/color';

/* 
🦄스타일링 설명
📢 mainText: 팝업 타이틀
📢 subText: 부가 설명
📢 isWarning: 부가 설명 색 설정 true-> 붉은 경고 / false-> 검정
📢 isCancel: 버튼 색 설정 true-> 왼쪽 보라색, 오른쪽 회색 / false-> 왼쪽 회색, 오른쪽 보라색
*/

//TODO: 버튼 공용 컴포넌트로 변경

interface BaseModalProps {
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
}: BaseModalProps) {
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
            <Text
              style={[
                styles.subText,
                { color: isWarning ? colors.secondary : colors.black },
              ]}
            >
              {subText}
            </Text>
            <Pressable style={styles.buttonContainer}>
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
                    { color: isCancel ? colors.white : colors.black },
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
                    { color: isCancel ? colors.black : colors.white },
                  ]}
                >
                  {rightBtnText}
                </Text>
              </Pressable>
            </Pressable>
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
    fontFamily: 'NanumSquareNeo-Regular',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: 302,
    height: 158,
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },

  button: {
    flex: 1,
    height: 44,
    borderRadius: 12,
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
    fontFamily: 'NanumSquareNeo-Regular',
    fontSize: 14,
    fontWeight: 700,
    color: colors.white,
  },

  titleText: {
    fontFamily: 'NanumSquareNeo-Bold',
    fontSize: 16,
    fontWeight: 800,
    lineHeight: 24,
    marginTop: 26,
  },
  subText: {
    fontFamily: 'NanumSquareNeo-Regular',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },
});
