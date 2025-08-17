import React, { useEffect, useState } from 'react';
import {
  Platform,
  Animated,
  View,
  InputAccessoryView,
  Keyboard,
} from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { Header, CustomButton, Textarea } from '@/components';
import colors from '@/theme/color';
import { width, height } from '@/theme/globalStyles';
import { postUserFeedback } from '@/api/users/postFeedback.api';
import { useToastStore } from '@/stores/toastStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useKeyboardAnimation from '@/hooks/useKeyboardAnimation';

export default function HelpPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState('');
  const { showToast } = useToastStore();
  const insets = useSafeAreaInsets();

  const isIOS = Platform.OS === 'ios';
  const androidTranslateY = useKeyboardAnimation(12);

  // iOS 키보드 상태
  const [kbVisible, setKbVisible] = useState(false);

  useEffect(() => {
    if (!isIOS) return;
    const show = Keyboard.addListener('keyboardWillShow', () =>
      setKbVisible(true),
    );
    const hide = Keyboard.addListener('keyboardWillHide', () =>
      setKbVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, [isIOS]);

  const disabled = feedback.trim() === '';
  const ACCESSORY_ID = 'help-feedback-accessory';

  const handleConfirm = async () => {
    try {
      await postUserFeedback({ feedback });
      showToast('의견이 성공적으로 제출됐어!', 'success');
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  const contentPaddingBottom = isIOS
    ? kbVisible
      ? 4
      : insets.bottom + 72
    : 120 * height;

  return (
    <Wrapper>
      <ScrollContainer
        automaticallyAdjustKeyboardInsets={false}
        keyboardDismissMode="interactive"
        contentInsetAdjustmentBehavior={isIOS ? 'never' : 'automatic'}
        contentContainerStyle={{ paddingBottom: contentPaddingBottom }}
        keyboardShouldPersistTaps="handled"
      >
        <Header>의견 남기기</Header>

        <MarginContainer>
          <Textarea
            title="LEENK에 대한 의견을 입력해줘"
            placeholder="텍스트를 입력해 주세요"
            maxLength={200}
            subMessage="불편한 점, 좋은 점 등 자유로운 의견을 적어줘"
            minHeight={30}
            value={feedback}
            onChangeText={setFeedback}
            accessoryID={isIOS ? ACCESSORY_ID : undefined}
          />
        </MarginContainer>
      </ScrollContainer>

      {isIOS ? (
        <>
          {!kbVisible && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: insets.bottom + 8,
                paddingHorizontal: 20 * width,
                backgroundColor: 'transparent',
              }}
            >
              <CustomButton
                variant="primary"
                fullWidth
                size="lg"
                onPress={handleConfirm}
                disabled={disabled}
              >
                제출하기
              </CustomButton>
            </View>
          )}

          {/* iOS: 키보드가 열리면 InputAccessoryView로 동일 버튼을 키보드 바로 위에 표시 */}
          <InputAccessoryView
            nativeID={ACCESSORY_ID}
            backgroundColor={colors.bg[2]}
          >
            <View
              style={{
                paddingHorizontal: 20 * width,
                paddingTop: 8,
                paddingBottom: insets.bottom + 8,
                backgroundColor: colors.bg[2],
                marginBottom: -25 * height,
              }}
            >
              <CustomButton
                variant="primary"
                fullWidth
                size="lg"
                onPress={handleConfirm}
                disabled={disabled}
              >
                제출하기
              </CustomButton>
            </View>
          </InputAccessoryView>
        </>
      ) : (
        // Android
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: insets.bottom + 8,
            paddingHorizontal: 20 * width,
            transform: [{ translateY: androidTranslateY }],
          }}
        >
          <CustomButton
            variant="primary"
            fullWidth
            size="lg"
            onPress={handleConfirm}
            disabled={disabled}
          >
            제출하기
          </CustomButton>
        </Animated.View>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
`;

const ScrollContainer = styled.ScrollView`
  flex: 1;
  padding: 0 ${20 * width}px;
  background-color: transparent;
`;

const MarginContainer = styled.View`
  margin-top: ${12 * height}px;
  gap: ${8 * height}px;
`;
