import { useEffect, useState } from 'react';
import { useRef } from 'react';
import {
  Platform,
  Animated,
  View,
  InputAccessoryView,
  Keyboard,
} from 'react-native';
import styled from 'styled-components/native';
import { useProfileStore } from '@/stores/profileStore';
import { CustomButton, Header, Input, Textarea } from '@/components';
import colors from '@/theme/color';
import { fontSize, height, width, fonts } from '@/theme/globalStyles';
// import { Image } from 'expo-image';
// import { Image } from 'react-native';

import { DefaultProfileImage } from '@/assets';
import { useRouter } from 'expo-router';
import PopupModal from '@/components/Modal/PopupModal';
import {
  UpdateProfilePayload,
  updateUserProfile,
} from '@/api/login/patchUsersInfo.api';
// import { getPresignedUrl, uploadImageToS3 } from '@/api/file/s3Upload';
import useRandomMbti from '@/hooks/useRandomMbti';
import ProfileTitleText from '@/components/signup/ProfileTitleText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useKeyboardAnimation from '@/hooks/useKeyboardAnimation';
import { useToastStore } from '@/stores/toastStore';
import { registerFcmToken } from '@/components/LandingPage';
import { saveAuthStatus } from '@/utils/tokenStorage';
import CalendarButton from '@/components/leenk/CalendarButton';
// import { setJustSignedUp } from '@/utils/authFlagStorage';
import { useAuthFlagStore } from '@/stores/authFlagStore';
import { Loading } from '@/components';
import dayjs from 'dayjs';

export default function ProfilePage() {
  const {
    // step,
    // setStep,
    kakaoTalkId,
    setkakaoTalkId,
    // introduction,
    // setintroduction,
    // birthday,
    // setBirthday,
    // mbti,
    // setMbti,
    // profileImage,
  } = useProfileStore();

  const [kakaoModalVisible, setKakaoModalVisible] = useState(false);
  // const [skipModalVisible, setSkipModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  // const randomMbti = useRandomMbti(2000);
  const insets = useSafeAreaInsets();
  const { showToast } = useToastStore();
  const [isKakaoConfirmed, setIsKakaoConfirmed] = useState(false);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const isIOS = Platform.OS === 'ios';
  const androidTranslateY = useKeyboardAnimation(12);

  // iOS: 키보드 열림 여부
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

  const ACCESSORY_ID = 'profile-accessory';

  // 타임 아웃 처리
  const withTimeout = <T,>(promise: Promise<T>, ms = 3000) => {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('FCM_TIMEOUT')), ms),
      ),
    ]);
  };

  // ----- 저장 -----
  const saveProfile = async () => {
    const payload: UpdateProfilePayload = {};
    if (kakaoTalkId) payload.kakaoTalkId = kakaoTalkId;
    // if (introduction) payload.introduction = introduction;
    // if (mbti) payload.mbti = mbti;
    // if (birthday) payload.birthday = birthday;

    // if (profileImage) {

    //   const fileName = `profile_${Date.now()}.jpg`;
    //   try {
    //     const presignedUrls = await getPresignedUrl(fileName, 'PROFILE');
    //     if (!presignedUrls || presignedUrls.length === 0) {
    //       throw new Error('presigned URL 생성에 실패했습니다.');
    //     }
    //     const mediaUrl = presignedUrls[0].mediaUrl;

    //     await uploadImageToS3(mediaUrl, profileImage);

    //     try {
    //       const url = new URL(mediaUrl);
    //       payload.profileImage = `${url.protocol}//${url.host}${url.pathname}`;
    //     } catch {
    //       payload.profileImage = mediaUrl.split('?')[0];
    //     }

    //   } catch (error) {
    //     console.error('[saveProfile] 프로필 이미지 업로드 실패:', error);
    //     showToast('프로필 이미지 업로드에 실패했어.', 'error');
    //     throw error;
    //   }
    // }

    try {
      await updateUserProfile(payload);
    } catch (error) {
      console.error('[saveProfile] 프로필 저장 실패:', error);
      showToast('프로필 저장에 실패했어.', 'error');
      throw error;
    }
  };

  // ----- 다음 -----
  const handleNext = async () => {
    if (isSubmitting) return;
    setKakaoModalVisible(true);

    // if (step === 'id') {
    //   setKakaoModalVisible(true);
    //   // } else if (step === 'photo') {
    //   //   setStep('introduction');
    // } else if (step === 'introduction') {
    //   setStep('birthday');
    // } else if (step === 'birthday') {
    //   setStep('mbti');
    // } else {
    //   try {
    //     setIsSubmitting(true);
    //
    //     await saveProfile();
    //
    //     try {
    //       await withTimeout(registerFcmToken(), 3000);
    //     } catch (e) {
    //       console.warn('[handleNext] registerFcmToken failed or timeout', e);
    //     }
    //
    //     await saveAuthStatus('AUTHENTICATED');
    //     await useAuthFlagStore.getState().setJustSignedUp();
    //
    //     router.replace('/(page)/leenk');
    //
    //     // iOS replace 실패 대비
    //     setTimeout(() => {
    //       if (mountedRef.current) {
    //         setIsSubmitting(false);
    //       }
    //     }, 500);
    //   } catch (e) {
    //     console.error('[handleNext] 실패:', e);
    //   } finally {
    //     if (mountedRef.current) setIsSubmitting(false);
    //   }
    // }
  };

  // 카카오톡 ID 확인 후 회원가입 완료
  const handleConfirmAndComplete = async () => {
    if (isSubmitting) return;

    setIsKakaoConfirmed(true);
    setKakaoModalVisible(false);

    try {
      setIsSubmitting(true);

      await saveProfile();

      try {
        await withTimeout(registerFcmToken(), 3000);
      } catch (e) {
        console.warn('[handleNext] registerFcmToken failed or timeout', e);
      }

      await saveAuthStatus('AUTHENTICATED');
      await useAuthFlagStore.getState().setJustSignedUp();

      router.replace('/(page)/leenk');

      setTimeout(() => {
        if (mountedRef.current) {
          setIsSubmitting(false);
        }
      }, 500);
    } catch (e) {
      console.error('[handleNext] 실패:', e);
    } finally {
      if (mountedRef.current) setIsSubmitting(false);
    }
  };

  const handlePrevStep = () => {
    // if (step === 'introduction') setStep('id');
    // // if (step === 'photo') setStep('id');
    // // else if (step === 'introduction') setStep('photo');
    // else if (step === 'birthday') setStep('introduction');
    // else if (step === 'mbti') setStep('birthday');
    // else router.back();
    router.back();
  };

  // const handleSkip = async () => {
  //   if (isSubmitting) return;
  //
  //   setSkipModalVisible(false);
  //   try {
  //     setIsSubmitting(true);
  //
  //     await saveProfile();
  //
  //     try {
  //       await withTimeout(registerFcmToken(), 3000);
  //     } catch (e) {
  //       console.warn('[handleSkip] registerFcmToken failed or timeout', e);
  //     }
  //
  //     await saveAuthStatus('AUTHENTICATED');
  //     await setJustSignedUp(true);
  //     await useAuthFlagStore.getState().setJustSignedUp();
  //
  //     router.replace('/(page)/leenk');
  //   } catch (error) {
  //     console.error('[handleSkip] 실패:', error);
  //   } finally {
  //     if (mountedRef.current) setIsSubmitting(false);
  //   }
  // };

  // const handleImagePick = () => {
  //   router.push('/signup/select-image');
  // };

  // ----- 버튼 묶음 -----
  const NormalButtons = () => (
    <View style={{ width: '100%' }}>
      {/* {step !== 'id' && (
        <>
          <CustomButton
            variant="text"
            textColor="text[2]"
            onPress={() => setSkipModalVisible(true)}
            rounded="md"
            size="lg"
            fullWidth
            style={{ marginBottom: 10 * height }}
          >
            지금은 넘어갈래
          </CustomButton>
        </>
      )} */}

      <CustomButton
        variant="primary"
        onPress={handleNext}
        fullWidth
        rounded="md"
        size="lg"
        style={{ marginBottom: 10 * height }}
        disabled={
          kakaoTalkId.trim() === '' ||
          kakaoTalkId.length < 4 ||
          kakaoTalkId.length > 20 ||
          !isKakaoConfirmed
          // (step === 'id' &&
          //   (kakaoTalkId.trim() === '' ||
          //     kakaoTalkId.length < 4 ||
          //     kakaoTalkId.length > 20 ||
          //     !isKakaoConfirmed)) ||
          // (step === 'introduction' && introduction.trim() === '') ||
          // (step === 'mbti' && (mbti.trim() === '' || mbti.length !== 4))
        }
      >
        {/* {step === 'mbti' ? '시작하자' : '다음으로'} */}
        다음으로
      </CustomButton>
    </View>
  );

  // 액세서리에는 주버튼만(높이 최소화)
  const AccessoryButtons = () => (
    <View style={{ width: '100%' }}>
      <CustomButton
        variant="primary"
        onPress={handleNext}
        fullWidth
        rounded="md"
        size="lg"
        style={{ marginBottom: 0 }}
        disabled={
          kakaoTalkId.trim() === '' ||
          kakaoTalkId.length < 4 ||
          kakaoTalkId.length > 20
          // (step === 'id' &&
          //   (kakaoTalkId.trim() === '' ||
          //     kakaoTalkId.length < 4 ||
          //     kakaoTalkId.length > 20)) ||
          // (step === 'introduction' && introduction.trim() === '') ||
          // (step === 'mbti' && (mbti.trim() === '' || mbti.length !== 4))
        }
      >
        {/* {step === 'mbti' ? '시작하자' : '다음으로'} */}
        다음으로
      </CustomButton>
    </View>
  );

  const contentPaddingBottom = isIOS
    ? kbVisible
      ? 4
      : insets.bottom + 72
    : 120 * height;

  return (
    <Container>
      {/* <PopupModal
        isOpen={skipModalVisible}
        onLeftBtn={() => setSkipModalVisible(false)}
        onRightBtn={handleSkip}
        mainText="프로필을 나중에 만들래?"
        subText="마이페이지에서 마저 설정할 수 있어."
        leftBtnText="취소"
        rightBtnText="나중에 할래"
        isCancel={false}
      /> */}
      <Scroll
        automaticallyAdjustKeyboardInsets={false}
        keyboardDismissMode="interactive"
        contentInsetAdjustmentBehavior={isIOS ? 'never' : 'automatic'}
        contentContainerStyle={{ paddingBottom: contentPaddingBottom }}
        keyboardShouldPersistTaps="handled"
      >
        <Header signUpBackPress={handlePrevStep} />
        <ProfileTitleText>프로필을 만들어보자</ProfileTitleText>

        {/* {step === 'id' && ( */}
          <>
            <Input
              title="카카오톡 ID를 입력해줘"
              value={kakaoTalkId}
              onChangeText={(text) => {
                setkakaoTalkId(text.replace(/[^a-zA-Z0-9._-]/g, ''));
                setIsKakaoConfirmed(false);
              }}
              placeholder="모임원들과의 연락을 위해 필요해"
              subMessage="ID는 카카오톡 > 친구 추가 > 카카오톡 ID 에서 볼 수 있어."
              accessoryID={isIOS ? ACCESSORY_ID : undefined}
              autoCorrect={false}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
              textContentType="none"
            />
            <PopupModal
              isOpen={kakaoModalVisible}
              onLeftBtn={() => {
                setIsKakaoConfirmed(false);
                setKakaoModalVisible(false);
              }}
              onRightBtn={handleConfirmAndComplete}
              mainText={kakaoTalkId}
              subText="카톡 아이디가 맞는지 확인해 줘."
              leftBtnText="아니야"
              rightBtnText="맞아"
              isCancel={false}
            />
          </>
        {/* )} */}

        {/* {step === 'introduction' && (
          <Textarea
            value={introduction}
            onChangeText={setintroduction}
            title="자기소개를 입력해줘"
            placeholder="안녕 나는 프론트 개발자 김링크야"
            maxLength={60}
            minHeight={1}
            accessoryID={isIOS ? ACCESSORY_ID : undefined}
          />
        )} */}

        {/* {step === 'birthday' && (
          <>
            <StyledSubText>생일을 알려줘</StyledSubText>
            <CalendarButton
              value={birthday ? new Date(birthday) : null}
              mode="birthday"
              onDateChange={(date) => {
                if (date) {
                  // YYYY-MM-DD 형식으로 저장
                  const formatted = dayjs(date).format('YYYY-MM-DD');
                  setBirthday(formatted);
                }
              }}
              placeholder="생일 축하를 받을 수 있어"
            />
          </>
        )} */}

        {/* {step === 'mbti' && (
          <Input
            title="MBTI를 입력해줘"
            value={mbti}
            autoCapitalize="characters"
            autoCorrect={false}
            textContentType="none"
            onChangeText={(text) => setMbti(text.replace(/[^a-zA-Z]/g, ''))}
            placeholder={randomMbti}
            maxLength={4}
            accessoryID={isIOS ? ACCESSORY_ID : undefined}
          />
        )} */}

        {/* {step === 'photo' && (
          <>
            <StyledSubText>프로필 사진을 설정해줘</StyledSubText>
            <ImagePreview>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
              ) : (
                <DefaultProfileImage width={80 * width} height={80 * height} />
              )}
            </ImagePreview>

            <CustomButton
              onPress={handleImagePick}
              variant="text"
              rounded="md"
              textColor="primary"
              fullWidth
            >
              프로필 사진 선택하기
            </CustomButton>
          </>
        )} */}
      </Scroll>

      {/* ===== 하단 액션 영역 ===== */}
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
              }}
            >
              <NormalButtons />
            </View>
          )}

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
                // 높이 과도 방지(HelpPage와 동일 보정)
                marginBottom: -25 * height,
              }}
            >
              <AccessoryButtons />
            </View>
          </InputAccessoryView>
        </>
      ) : (
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
          <NormalButtons />
        </Animated.View>
      )}

      {isSubmitting && <Loading />}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
`;

const Scroll = styled.ScrollView`
  flex: 1;
  padding: 0 ${20 * width}px;
  background-color: transparent;
`;

export const StyledSubText = styled.Text`
  font-size: ${fontSize.md}px;
  color: ${colors.text[2]};
  font-family: ${fonts.Regular};
  margin-bottom: ${12 * height}px;
`;

const ImagePreview = styled.View`
  align-items: center;
`;
