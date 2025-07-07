import { useState } from 'react';
import { Animated, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useProfileStore } from '@/stores/profileStore';
import { CustomButton, Header, Input, Textarea } from '@/components';
import colors from '@/theme/color';
import { fontSize, height, width, fonts } from '@/theme/globalStyles';
import { Image } from 'expo-image';
import { DefaultProfileImage } from '@/assets';
import { useRouter } from 'expo-router';
import PopupModal from '@/components/Modal/PopupModal';
import {
  UpdateProfilePayload,
  updateUserProfile,
} from '@/api/login/patchUsersInfo.api';
import { getPresignedUrl, uploadImageToS3 } from '@/api/file/s3Upload';
import useRandomMbti from '@/hooks/useRandomMbti';
import ProfileTitleText from '@/components/signup/ProfileTitleText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useKeyboardAnimation from '@/hooks/useKeyboardAnimation';
import { useToastStore } from '@/stores/toastStore';

export default function ProfilePage() {
  const {
    step,
    setStep,
    kakaoTalkId,
    setkakaoTalkId,
    introduction,
    setintroduction,
    mbti,
    setMbti,
    profileImage,
  } = useProfileStore();

  const [kakaoModalVisible, setKakaoModalVisible] = useState(false);
  const [skipModalVisible, setSkipModalVisible] = useState(false);
  const router = useRouter();
  const randomMbti = useRandomMbti(2000);
  const insets = useSafeAreaInsets();

  const buttonTranslateY = useKeyboardAnimation(10);

  const { showToast } = useToastStore();

  // 프로필 저장 함수
  const saveProfile = async () => {
    const payload: UpdateProfilePayload = {};

    if (kakaoTalkId) payload.kakaoTalkId = kakaoTalkId;
    if (introduction) payload.introduction = introduction;
    if (mbti) payload.mbti = mbti;

    if (profileImage) {
      const fileName = `profile_${Date.now()}.jpg`;
      try {
        const presignedUrls = await getPresignedUrl(fileName);
        if (!presignedUrls || presignedUrls.length === 0) {
          throw new Error('presigned URL 생성에 실패했습니다.');
        }
        const mediaUrl = presignedUrls[0].mediaUrl;
        await uploadImageToS3(mediaUrl, profileImage);

        // URL에서 쿼리 파라미터 제거
        try {
          const url = new URL(mediaUrl);
          payload.profileImage = `${url.protocol}//${url.host}${url.pathname}`;
        } catch (urlError) {
          // URL 파싱 실패 시 기존 방식 사용
          payload.profileImage = mediaUrl.split('?')[0];
        }
      } catch (error) {
        console.error('[saveProfile] 프로필 이미지 업로드 실패:', error);
        showToast('프로필 이미지 업로드에 실패했어.', 'error');
        throw error;
      }
    }

    try {
      await updateUserProfile(payload);
    } catch (error) {
      console.error('[saveProfile] 프로필 저장 실패:', error);
      showToast('프로필 저장에 실패했어.', 'error');
      throw error;
    }
  };

  // 다음 단계
  const handleNext = async () => {
    if (step === 'id') {
      setKakaoModalVisible(true);
    } else if (step === 'photo') {
      setStep('introduction');
    } else if (step === 'introduction') {
      setStep('mbti');
    } else {
      try {
        await saveProfile();
        router.replace('/(page)/feed');
      } catch (e) {
        console.error('[handleNext] 실패:', e);
      }
    }
  };

  const handlePrevStep = () => {
    if (step === 'photo') setStep('id');
    else if (step === 'introduction') setStep('photo');
    else if (step === 'mbti') setStep('introduction');
    else router.back();
  };

  const handleSkip = async () => {
    setSkipModalVisible(false);
    try {
      await saveProfile();
    } catch (error) {
      console.error('[handleSkip] 실패:', error);
    }
    router.replace('/(page)/feed');
  };

  const handleImagePick = () => {
    router.push('/signup/select-image');
  };

  return (
    <Container>
      <ContentArea>
        <Header signUpBackPress={handlePrevStep} />
        <ProfileTitleText>프로필을 만들어보자</ProfileTitleText>

        {step === 'id' && (
          <>
            <Input
              title="카카오톡 ID를 입력해줘"
              value={kakaoTalkId}
              onChangeText={(text) => {
                const filtered = text.replace(/[^a-zA-Z0-9]/g, '');
                setkakaoTalkId(filtered);
              }}
              placeholder="모임원들과의 연락을 위해 필요해"
              subMessage="ID는 카카오톡 > 친구 추가 > 카카오톡 ID 에서 볼 수 있어."
            />
            <PopupModal
              isOpen={kakaoModalVisible}
              onClose={() => setKakaoModalVisible(false)}
              onConfirm={() => {
                setKakaoModalVisible(false);
                setTimeout(() => {
                  setStep('photo');
                }, 100);
              }}
              mainText={kakaoTalkId}
              subText="카톡 아이디가 맞는지 확인해 줘."
              leftBtnText="아니야"
              rightBtnText="맞아"
              isCancel={false}
            />
          </>
        )}

        {step === 'introduction' && (
          <Textarea
            value={introduction}
            onChangeText={setintroduction}
            title="자기소개를 입력해줘"
            placeholder="안녕 나는 프론트 개발자 김링크야"
            maxLength={60}
            minHeight={1}
          />
        )}
        {step === 'mbti' && (
          <Input
            title="MBTI를 입력해줘"
            value={mbti}
            autoCapitalize="characters"
            autoCorrect={false}
            textContentType="none"
            onChangeText={(text) => {
              const filtered = text.replace(/[^a-zA-Z]/g, '');
              setMbti(filtered);
            }}
            placeholder={randomMbti}
            maxLength={4}
          />
        )}

        {step === 'photo' && (
          <>
            <StyledSubText>프로필 사진을 설정해줘</StyledSubText>
            <ImagePreview>
              {profileImage ? (
                <Image
                  source={profileImage}
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
        )}
      </ContentArea>

      <Animated.View style={{ transform: [{ translateY: buttonTranslateY }] }}>
        <ButtonContainer $paddingBottom={insets.bottom}>
          {step !== 'id' && (
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
              <PopupModal
                isOpen={skipModalVisible}
                onClose={() => setSkipModalVisible(false)}
                onConfirm={handleSkip}
                mainText="프로필을 나중에 만들래?"
                subText="마이페이지에서 마저 설정할 수 있어."
                leftBtnText="취소"
                rightBtnText="나중에 할래"
                isCancel={false}
              />
            </>
          )}

          <CustomButton
            variant="primary"
            onPress={handleNext}
            fullWidth
            rounded="md"
            size="lg"
            style={{ marginBottom: 10 * height }}
            disabled={
              (step === 'id' &&
                (kakaoTalkId.trim() === '' ||
                  kakaoTalkId.length < 4 ||
                  kakaoTalkId.length > 20)) ||
              (step === 'introduction' && introduction.trim() === '') ||
              (step === 'mbti' && (mbti.trim() === '' || mbti.length !== 4))
            }
          >
            {step === 'mbti' ? '시작하자' : '다음으로'}
          </CustomButton>
        </ButtonContainer>
      </Animated.View>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: space-between;
  background-color: ${colors.bg[2]};
  padding-horizontal: ${20 * width}px;
`;
const ContentArea = styled.View``;

export const StyledSubText = styled.Text`
  font-size: ${fontSize.md}px;
  color: ${colors.text[2]};
  font-family: ${fonts.Regular};
  margin-bottom: ${12 * height}px;
`;

const ButtonContainer = styled.View<{ $paddingBottom: string }>`
  align-self: center;
  width: 100%;
  padding-bottom: ${(props) => props.$paddingBottom}px;
  ${Platform.OS === 'web' ? `padding-horizontal: ${20 * width}px;` : ''}
`;

const ImagePreview = styled.View`
  align-items: center;
`;
