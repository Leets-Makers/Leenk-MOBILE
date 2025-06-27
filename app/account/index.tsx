import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { Header, CustomButton, ProfileEditButton } from '@/components';
import { DefaultProfileImage, SettingIcon } from '@/assets';
import { height, width } from '@/theme/globalStyles';
import colors from '@/theme/color';
import { mockUserData } from '@/constants/mockUserData';

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
      content: mockUserData.introduction,
      type: 'introduction',
      isTextarea: true,
    },
  ];

  return (
    <Container>
      <Header
        isBack
        TitleSection="프로필 편집"
        RightSection={<SettingIcon />}
        onRightPress={() => router.push('/account/setting')}
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
  padding-horizontal: ${20 * width}px;
`;

const ProfileImageWrapper = styled.View`
  align-items: center;
  margin-top: ${20 * height}px;
`;
