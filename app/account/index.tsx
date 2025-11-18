import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { Header, CustomButton, ProfileEditButton } from '@/components';
import { height, width } from '@/theme/globalStyles';
import colors from '@/theme/color';
import { useProfileStore } from '@/stores/profileStore';
import ProfileImageWithFallback from '@/components/feed/ProfileImageWithFallback';
export default function ProfileEdit() {
  const router = useRouter();

  const { kakaoTalkId, introduction, mbti, birthday, profileImage } =
    useProfileStore();

  const editFields = [
    {
      title: '카톡 아이디',
      content: kakaoTalkId,
      type: 'kakaoTalkId',
    },
    { title: 'MBTI', content: mbti, type: 'mbti' },
    { title: '생일', content: birthday, type: 'birthday' },
    {
      title: '자기소개',
      content: introduction,
      type: 'introduction',
      isTextarea: true,
    },
  ];

  return (
    <Container>
      <Header RightSection="SETTING">프로필 편집</Header>
      <ProfileImageWrapper>
        <ProfileImageWithFallback uri={profileImage} size={80} />
      </ProfileImageWrapper>

      <CustomButton
        onPress={() =>
          router.push({
            pathname: '/account/select-image',
            params: { mode: 'edit' },
          })
        }
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
          content={content ?? ''}
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
