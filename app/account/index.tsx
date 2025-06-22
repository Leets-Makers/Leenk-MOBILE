// 프로필 편집 메인 화면
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { Text, TouchableOpacity } from 'react-native';
import { Header } from '@/components';
import { BackArrowIcon, DefaultProfileImage, SettingIcon } from '@/assets';
import CustomButton from '@/components/common/Button/CustomButton';
import {
  fontSize,
  fonts,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import colors from '@/theme/color';

const mockUserData = {
  name: '이한별',
  intro:
    '안녕하세요 디자이너ㅇㅇㅇㅇㅇㅇㅇㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ 이ㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ한별입니다. 이한별입니다람쥐렁이렁ㅇ얼어러어어얼',
  kakaoId: 'hanbyeol1234',
  mbti: 'ENTJ',
  profileImage: null,
};

const EditButton = ({
  title,
  content,
  onPress,
  isTextarea = false,
}: {
  title: string;
  content: string;
  onPress: () => void;
  isTextarea?: boolean;
}) => (
  <EditWrapper>
    <Title>{title}</Title>
    {isTextarea ? (
      <TextareaWrapper onPress={onPress}>
        <ScrollableTextContainer>
          <TextareaText>{content}</TextareaText>
        </ScrollableTextContainer>
        <CharCount>{content.length}/200</CharCount>
      </TextareaWrapper>
    ) : (
      <Box onPress={onPress}>
        <BoxText numberOfLines={1}>{content}</BoxText>
      </Box>
    )}
  </EditWrapper>
);

export default function ProfileEdit() {
  const router = useRouter();

  return (
    <Container>
      <Header
        LeftSection={
          <TouchableOpacity onPress={() => router.back()}>
            <BackArrowIcon />
          </TouchableOpacity>
        }
        TitleSection={
          <Text
            style={{
              fontWeight: 700,
              fontSize: fontSize.lg,
              fontFamily: fonts.Regular,
              lineHeight: lineHeight.l,
            }}
          >
            프로필 편집
          </Text>
        }
        RightSection={
          <TouchableOpacity onPress={() => router.push('/')}>
            <SettingIcon />
          </TouchableOpacity>
        }
      />
      <ProfileImageWrapper>
        <DefaultProfileImage width={80 * width} height={80 * height} />
      </ProfileImageWrapper>

      <CustomButton
        onPress={() => console.log('사진 변경')}
        variant="text"
        rounded="md"
        textColor="primary"
      >
        프로필 사진 바꾸기
      </CustomButton>

      <EditButton
        title="카톡 아이디"
        content={mockUserData.kakaoId}
        onPress={() => router.push('/')}
      />
      <EditButton
        title="MBTI"
        content={mockUserData.mbti}
        onPress={() => router.push('/')}
      />
      <EditButton
        title="자기소개"
        content={mockUserData.intro}
        onPress={() => router.push('/')}
        isTextarea
      />
    </Container>
  );
}

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${colors.bg[2]};
  padding: ${28 * height}px ${20 * width}px;
`;

const ProfileImageWrapper = styled.View`
  align-items: center;
  margin-top: ${20 * height}px;
`;

const EditWrapper = styled.View`
  margin-top: ${20 * height}px;
`;

const Title = styled.Text`
  font-size: ${fontSize.sm}px;
  color: ${colors.text[1]};
  font-family: ${fonts.Regular};
  margin-bottom: ${6 * height}px;
`;

const Box = styled.Pressable`
  width: 100%;
  border-radius: 8px;
  padding: ${12 * height}px ${14 * width}px;
  background-color: transparent;
  border: 1px solid ${colors.gray[300]};
`;

const BoxText = styled.Text`
  font-size: ${fontSize.md}px;
  color: ${colors.text[2]};
  font-family: ${fonts.Regular};
`;
const TextareaWrapper = styled.Pressable`
  width: 100%;
  height: ${76 * height}px;
  border-radius: 8px;
  padding: ${12 * height}px ${14 * width}px;
  border: 1px solid ${colors.gray[300]};
  position: relative;
  background-color: transparent;
`;

const ScrollableTextContainer = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})`
  max-height: ${24 * height}px;
`;

const TextareaText = styled.Text`
  font-size: ${fontSize.md}px;
  color: ${colors.text[2]};
  font-family: ${fonts.Regular};
  line-height: ${lineHeight.l}px;
`;

const CharCount = styled.Text`
  position: absolute;
  bottom: ${12 * height}px;
  right: ${12 * width}px;
  font-size: ${fontSize.xs}px;
  color: ${colors.gray[500]};
  margin-top: ${12 * height}px;
`;
