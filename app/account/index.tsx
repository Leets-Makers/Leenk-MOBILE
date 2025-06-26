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
import { mockUserData } from '@/constants/mockUserData';
import { ProfileEditButton } from '@/components/common/Button/ProfileEditButton';

export default function ProfileEdit() {
  const router = useRouter();

  const editFields = [
    {
      title: '카톡 아이디',
      content: mockUserData.kakaoTalkId,
      type: 'kakaoTalkId',
    },
    { title: 'MBTI', content: mockUserData.mbti, type: 'mbti' },
    {
      title: '자기소개',
      content: mockUserData.introductionduction,
      type: 'introduction',
      isTextarea: true,
    },
  ];

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
          <TouchableOpacity onPress={() => router.push('/account/setting')}>
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

      {editFields.map(({ title, content, type, isTextarea }) => (
        <ProfileEditButton
          key={type}
          title={title}
          content={content}
          isTextarea={isTextarea}
          onPress={() =>
            router.push({ pathname: '/account/edit', params: { type } })
          }
        />
      ))}
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
