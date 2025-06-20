import styled from 'styled-components/native';
import { useProfileStore } from '@/stores/profileStore';
import { CustomButton, Header, Input, Textarea } from '@/components';
import TitleText from '@/components/signup/TitleText';
import colors from '@/theme/color';
import { fontSize, height, width, fonts } from '@/theme/globalStyles';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { TouchableOpacity } from 'react-native';
import { BackArrowIcon, DefaultProfileImage } from '@/assets';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import PopupModal from '@/components/Modal/PopupModal';

export default function ProfilePage() {
  const {
    step,
    setStep,
    kakaoId,
    setKakaoId,
    intro,
    setIntro,
    mbti,
    setMbti,
    profileImage,
    setProfileImage,
  } = useProfileStore();
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalClose = () => {
    setModalVisible(false);
  };
  const handleConfirm = () => {
    setStep('photo');
    setModalVisible(false);
  };

  const router = useRouter();

  const handleNext = () => {
    if (step === 'id') setModalVisible(true);
    else if (step === 'photo') setStep('intro');
    else if (step === 'intro') setStep('mbti');
    else {
      console.log('제출: ', { kakaoId, intro, mbti, profileImage });
      router.push('/(page)/feed');
    }
  };
  const handlePrevStep = () => {
    if (step === 'photo') setStep('id');
    else if (step === 'intro') setStep('photo');
    else if (step === 'mbti') setStep('intro');
    else router.back();
  };

  const handleSkip = () => {
    router.push('/(page)/feed');
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

  return (
    <Container>
      <Header
        LeftSection={
          <TouchableOpacity onPress={handlePrevStep}>
            <BackArrowIcon />
          </TouchableOpacity>
        }
      />

      <TitleText>프로필을 만들어보자</TitleText>

      <PopupModal
        isOpen={modalVisible}
        onClose={handleModalClose}
        onConfirm={handleConfirm}
        mainText={kakaoId}
        subText="카톡 아이디가 맞는지 확인해 줘."
        leftBtnText="아니야"
        rightBtnText="맞아"
        isCancel={false}
      />

      {step === 'id' && (
        <Input
          title="카카오톡 ID를 입력해줘"
          value={kakaoId}
          onChangeText={setKakaoId}
          placeholder="모임원들과의 연락을 위해 필요해"
          subMessage="ID는 카카오톡 > 친구 추가 > 카카오톡 ID 에서 볼 수 있어."
        />
      )}

      {step === 'intro' && (
        <Textarea
          value={intro}
          onChangeText={setIntro}
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
          onChangeText={setMbti}
          placeholder="ENFP"
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
          >
            프로필 사진 선택하기
          </CustomButton>
        </>
      )}

      <ButtonContainer>
        {step !== 'id' && (
          <CustomButton
            variant="text"
            textColor="text[2]"
            onPress={handleSkip}
            rounded="md"
            size="lg"
            style={{
              width: 303 * width,
              height: 48 * height,
              marginBottom: 10 * height,
            }}
          >
            지금은 넘어갈래
          </CustomButton>
        )}

        <CustomButton
          variant="primary"
          onPress={handleNext}
          rounded="md"
          size="lg"
          disabled={
            (step === 'id' && kakaoId.trim() === '') ||
            (step === 'intro' && intro.trim() === '') ||
            (step === 'mbti' && mbti.trim() === '')
          }
          style={{
            width: 303 * width,
            height: 48 * height,
          }}
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
  padding: ${29 * height}px ${20 * width}px;
`;

const StyledText = styled.Text`
  font-size: ${fontSize.md}px;
  color: ${colors.text[2]};
  font-weight: 500;
  font-family: ${fonts.Regular};
  margin-bottom: ${12 * height}px;
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: ${44 * height}px;
  align-self: center;
`;

const ImagePreview = styled.View`
  align-items: center;
`;
