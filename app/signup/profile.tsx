import styled from 'styled-components/native';
import { useProfileStore } from '@/stores/profileStore';
import { CustomButton, Header, Input, Textarea } from '@/components';
import colors from '@/theme/color';
import { fontSize, height, width, fonts } from '@/theme/globalStyles';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { DefaultProfileImage } from '@/assets';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import PopupModal from '@/components/Modal/PopupModal';
import { MBTI_LIST } from '@/constants/MbtiList';
import ProfileTitleText from '@/components/signup/ProfileTitleText';

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
    setProfileImage,
  } = useProfileStore();
  const [kakaoModalVisible, setKakaoModalVisible] = useState(false);
  const [skipModalVisible, setSkipModalVisible] = useState(false);

  const handleModalClose = () => {
    setKakaoModalVisible(false);
  };
  const handleConfirm = () => {
    setKakaoModalVisible(false);
    setTimeout(() => {
      setStep('photo');
    }, 100);
  };

  const router = useRouter();

  const handleNext = () => {
    if (step === 'id') setKakaoModalVisible(true);
    else if (step === 'photo') setStep('introduction');
    else if (step === 'introduction') setStep('mbti');
    else {
      console.log('제출: ', { kakaoTalkId, introduction, mbti, profileImage });
      router.push('/(page)/feed');
    }
  };
  const handlePrevStep = () => {
    if (step === 'photo') setStep('id');
    else if (step === 'introduction') setStep('photo');
    else if (step === 'mbti') setStep('introduction');
    else router.back();
  };

  const handleSkip = () => {
    setSkipModalVisible(false);
    setTimeout(() => {
      router.push('/(page)/feed');
    }, 200);
  };
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const [randomMbti, setRandomMbti] = useState('ENFP');

  useEffect(() => {
    const interval = setInterval(() => {
      const random = MBTI_LIST[Math.floor(Math.random() * MBTI_LIST.length)];
      setRandomMbti(random);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
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
            onClose={handleModalClose}
            onConfirm={handleConfirm}
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
          onChangeText={(text) => {
            const filtered = text.replace(/[^a-zA-Z]/g, '').toUpperCase();
            setMbti(filtered);
          }}
          placeholder={randomMbti}
          maxLength={4}
        />
      )}

      {step === 'photo' && (
        <>
          <StyledText>프로필 사진을 설정해줘</StyledText>
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

      <ButtonContainer>
        {step !== 'id' && (
          <>
            <CustomButton
              variant="text"
              textColor="text[2]"
              onPress={() => setSkipModalVisible(true)}
              rounded="md"
              size="lg"
              fullWidth
              style={{
                marginBottom: 10 * height,
              }}
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
          disabled={
            (step === 'id' && kakaoTalkId.trim() === '') ||
            (step === 'introduction' && introduction.trim() === '') ||
            (step === 'mbti' && (mbti.trim() === '' || mbti.length !== 4))
          }
        >
          {step === 'mbti' ? '시작하자' : '다음으로'}
        </CustomButton>
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
  padding-horizontal: ${20 * width}px;
`;

const StyledText = styled.Text`
  font-size: ${fontSize.md}px;
  color: ${colors.text[2]};
  font-family: ${fonts.Regular};
  margin-bottom: ${12 * height}px;
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: ${44 * height}px;
  align-self: center;
  width: 100%;
  padding-horizontal: ${20 * width}px;
`;

const ImagePreview = styled.View`
  align-items: center;
`;
