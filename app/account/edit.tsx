import { CustomButton, Header, Input, Textarea } from '@/components';
import colors from '@/theme/color';
import { height, width } from '@/theme/globalStyles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Platform,
  Animated,
  View,
  InputAccessoryView,
  Keyboard,
} from 'react-native';
import styled from 'styled-components/native';
import {
  updateKakaoTalkId,
  updateMbti,
  updateBirthday,
  updateIntroduction,
} from '@/api/users/patchUserEachInfo.api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useKeyboardAnimation from '@/hooks/useKeyboardAnimation';
import { useProfileStore } from '@/stores/profileStore';
import { useToastStore } from '@/stores/toastStore';
import CalendarButton from '@/components/leenk/CalendarButton';

export default function AccountEdit() {
  const { type } = useLocalSearchParams<{
    type?: 'kakaoTalkId' | 'mbti' | 'birthday' | 'introduction';
  }>();
  const [edituserInfo, setEdituserInfo] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToastStore();

  const {
    kakaoTalkId,
    setkakaoTalkId,
    introduction,
    setintroduction,
    mbti,
    setMbti,
    birthday,
    setBirthday,
  } = useProfileStore();

  const isIOS = Platform.OS === 'ios';
  const ACCESSORY_ID = 'account-edit-accessory';

  // AND: 기존 훅 유지
  const androidTranslateY = useKeyboardAnimation(12);

  // iOS: 키보드 표시 상태
  const [kbVisible, setKbVisible] = useState(false);
  useEffect(() => {
    if (!isIOS) return;
    const s = Keyboard.addListener('keyboardWillShow', () =>
      setKbVisible(true),
    );
    const h = Keyboard.addListener('keyboardWillHide', () =>
      setKbVisible(false),
    );
    return () => {
      s.remove();
      h.remove();
    };
  }, [isIOS]);

  const headerText =
    type === 'kakaoTalkId'
      ? '카톡 ID'
      : type === 'mbti'
        ? 'MBTI'
        : type === 'introduction'
          ? '자기소개'
          : type === 'birthday'
            ? '생일'
            : '프로필 수정';

  useEffect(() => {
    // 화면 진입 시 프로필에 이미 저장된 birthday(문자열)가 있으면 selectedDate 초기화
    if (birthday) {
      const parsed = dayjs(birthday, 'YYYY-MM-DD');
      if (parsed.isValid()) {
        setSelectedDate(parsed.toDate());
      }
    }
  }, [birthday]);

  const handleSubmit = async () => {
    try {
      if (type === 'kakaoTalkId') {
        setkakaoTalkId(edituserInfo);
        await updateKakaoTalkId({ kakaoTalkId: edituserInfo });
        showToast('카카오톡 아이디가 수정됐어!', 'success');
      } else if (type === 'mbti') {
        setMbti(edituserInfo);
        await updateMbti({ mbti: edituserInfo });
        showToast('MBTI가 수정됐어!', 'success');
      } else if (type === 'birthday') {
        if (!selectedDate) {
          showToast('생일을 선택해줘', 'error');
          return;
        }
        const formatted = dayjs(selectedDate).format('YYYY-MM-DD');
        setBirthday(formatted);
        await updateBirthday({ birthday: formatted });
        showToast('생일이 수정됐어!', 'success');
      } else if (type === 'introduction') {
        setintroduction(edituserInfo);
        await updateIntroduction({ introduction: edituserInfo });
        showToast('자기소개가 수정됐어!', 'success');
      }
      router.back();
    } catch (error) {
      console.error('[AccountEdit] 수정 실패:', error);
    }
  };

  const disabled =
    (type === 'kakaoTalkId' &&
      (edituserInfo.trim() === '' ||
        edituserInfo.length < 4 ||
        edituserInfo.length > 20)) ||
    (type === 'mbti' &&
      (edituserInfo.trim() === '' || edituserInfo.length !== 4)) ||
    (type === 'birthday' && !selectedDate); // 생일은 selectedDate 필요

  const contentPaddingBottom = isIOS
    ? kbVisible
      ? 4
      : insets.bottom + 72
    : 120 * height;

  return (
    <Wrapper>
      <Container
        automaticallyAdjustKeyboardInsets={false}
        contentInsetAdjustmentBehavior={isIOS ? 'never' : 'automatic'}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: contentPaddingBottom }}
      >
        <Header>{headerText}</Header>

        <MarginContainer>
          {type === 'kakaoTalkId' && (
            <Input
              title="카카오톡 ID를 입력해줘"
              subMessage="모임원들과의 연락을 위해 필요해."
              value={edituserInfo}
              placeholder={kakaoTalkId}
              onChangeText={(text) => {
                const filtered = text.replace(/[^a-zA-Z0-9]/g, '');
                setEdituserInfo(filtered);
              }}
              maxLength={20}
              {...(isIOS ? { accessoryID: ACCESSORY_ID } : {})}
            />
          )}

          {type === 'mbti' && (
            <Input
              title="MBTI를 입력해줘"
              placeholder={mbti}
              maxLength={4}
              value={edituserInfo}
              autoCapitalize="characters"
              autoCorrect={false}
              spellCheck={false}
              textContentType="none"
              onChangeText={(text) => {
                const filtered = text.replace(/[^a-zA-Z]/g, '').toUpperCase();
                setEdituserInfo(filtered);
              }}
              {...(isIOS ? { accessoryID: ACCESSORY_ID } : {})}
            />
          )}

          {type === 'birthday' && (
            <View>
              <CalendarButton
                value={selectedDate}
                onDateChange={(d) => setSelectedDate(d)}
                mode="birthday"
              />
            </View>
          )}

          {type === 'introduction' && (
            <Textarea
              title="자기소개를 입력해줘"
              placeholder={introduction}
              maxLength={200}
              minHeight={30}
              value={edituserInfo}
              onChangeText={setEdituserInfo}
              {...(isIOS ? { accessoryID: ACCESSORY_ID } : {})}
            />
          )}
        </MarginContainer>
      </Container>

      {isIOS ? (
        <>
          {/* 키보드 닫힘: 화면 하단 고정 푸터 */}
          {!kbVisible && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: insets.bottom + 8,
                paddingHorizontal: 20 * width,
              }}
            >
              <CustomButton
                style={{ marginBottom: 10 * height }}
                variant="primary"
                fullWidth
                size="lg"
                onPress={handleSubmit}
                disabled={!!disabled}
              >
                완료할래
              </CustomButton>
            </View>
          )}

          {/* 키보드 열림: 키보드 바로 위(InputAccessoryView) */}
          <InputAccessoryView
            nativeID={ACCESSORY_ID}
            backgroundColor={colors.bg[2]}
          >
            <View
              style={{
                paddingHorizontal: 20 * width,
                paddingTop: 0,
                paddingBottom: 2, // 최소 여백 (필요 시 0~4로 조정)
                backgroundColor: colors.bg[2],
                // marginBottom: -2,    // 1~2px 더 붙이고 싶으면 사용
              }}
            >
              <CustomButton
                style={{ marginBottom: 10 * height }}
                variant="primary"
                fullWidth
                size="lg"
                onPress={handleSubmit}
                disabled={!!disabled}
              >
                완료할래
              </CustomButton>
            </View>
          </InputAccessoryView>
        </>
      ) : (
        // Android: 기존 훅으로 버튼을 키보드에 맞춰 올림
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
            style={{ marginBottom: 10 * height }}
            variant="primary"
            fullWidth
            size="lg"
            onPress={handleSubmit}
            disabled={!!disabled}
          >
            완료할래
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

const Container = styled.ScrollView`
  flex: 1;
  padding-horizontal: ${20 * width}px;
`;

const MarginContainer = styled.View`
  margin-top: ${28 * height}px;
`;
