import styled from 'styled-components/native';
import { useProfileStore } from '@/stores/profileStore';
import { CustomButton } from '@/components';
import TitleText from '@/components/signup/TitleText';
import colors from '@/theme/color';
import {
  fontSize,
  height,
  width,
  fonts,
  lineHeight,
} from '@/theme/globalStyles';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

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

  const handleNext = () => {
    if (step === 'id') setStep('intro');
    else if (step === 'intro') setStep('mbti');
    else if (step === 'mbti') setStep('photo');
    else console.log('제출: ', { kakaoId, intro, mbti, profileImage });
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
      <TitleText>프로필을 만들어보자</TitleText>

      {step === 'id' && (
        <>
          <StyledText>카카오톡 ID를 입력해줘</StyledText>
          <StyledInput
            value={kakaoId}
            onChangeText={setKakaoId}
            placeholder="예: abc123"
          />
        </>
      )}

      {step === 'intro' && (
        <>
          <StyledText>자기소개를 입력해줘</StyledText>
          <StyledTextarea
            value={intro}
            onChangeText={setIntro}
            placeholder="20자 이내로 입력"
            multiline
            maxLength={20}
          />
        </>
      )}

      {step === 'mbti' && (
        <>
          <StyledText>MBTI를 입력해줘</StyledText>
          <StyledInput
            value={mbti}
            onChangeText={setMbti}
            placeholder="예: ENFP"
          />
        </>
      )}

      {step === 'photo' && (
        <>
          <StyledText>프로필 사진을 선택해줘</StyledText>
          <ImagePreview>
            {profileImage ? (
              <Image
                source={profileImage}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <EmptyImage />
            )}
          </ImagePreview>
          <CustomButton
            onPress={handleImagePick}
            variant="primary"
            rounded="md"
          >
            사진 선택하기
          </CustomButton>
        </>
      )}

      <ButtonContainer>
        <CustomButton
          variant="secondary"
          onPress={() => setStep('id')}
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

        <CustomButton
          variant="primary"
          onPress={handleNext}
          rounded="md"
          size="lg"
          style={{
            width: 303 * width,
            height: 48 * height,
          }}
        >
          {step === 'photo' ? '완료하기' : '다음으로'}
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

const StyledInput = styled.TextInput`
  width: 100%;
  height: 48px;
  background-color: white;
  border-radius: 8px;
  padding: 0 12px;
  font-size: ${fontSize.md}px;
  margin-bottom: ${20 * height}px;
`;

const StyledTextarea = styled.TextInput`
  width: 100%;
  height: 100px;
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  font-size: ${fontSize.md}px;
  margin-bottom: ${20 * height}px;
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: ${44 * height}px;
  align-self: center;
`;

const ImagePreview = styled.View`
  margin-bottom: ${20 * height}px;
  align-items: center;
`;

const EmptyImage = styled.View`
  width: 100px;
  height: 100px;
  background-color: ${colors.gray[200]};
  border-radius: 50px;
`;
