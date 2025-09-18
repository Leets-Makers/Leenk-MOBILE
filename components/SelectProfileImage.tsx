import { CustomButton, Header, ImagePicker } from '@/components';
import colors from '@/theme/color';
import { height, width } from '@/theme/globalStyles';
import { AspectRatio } from '@/types/aspect-ratio';
import styled from 'styled-components/native';

import { useRouter } from 'expo-router';
import { useProfileStore } from '@/stores/profileStore';

import { useState } from 'react';
import { Platform, View } from 'react-native';
import { updateProfileImage } from '@/api/users/patchUserEachInfo.api';
import { getPresignedUrl, uploadImageToS3 } from '@/api/file/s3Upload';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLeenkImageStore } from '@/stores/leenkStore';
import { CONTAINER_PADDING } from '@/constants';

export default function SelectProfileImage({
  mode,
}: {
  mode: 'profile' | 'edit' | 'leenk';
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { setProfileImage } = useProfileStore();

  const [selectedUri, setSelectedUri] = useState<string | null>(null);

  const { setLeenkImage } = useLeenkImageStore();

  const handleSelectComplete = async () => {
    if (!selectedUri) return;

    if (mode === 'leenk') {
      setLeenkImage(selectedUri);
    } else {
      setProfileImage(selectedUri);
    }

    if (mode === 'edit') {
      try {
        const fileName = `profile_${Date.now()}.jpg`;
        const presignedUrls = await getPresignedUrl(fileName);
        if (!presignedUrls || presignedUrls.length === 0) {
          throw new Error('Presigned URL을 받아올 수 없습니다.');
        }
        const mediaUrl = presignedUrls[0].mediaUrl;
        await uploadImageToS3(mediaUrl, selectedUri);
        await updateProfileImage({ profileImage: mediaUrl.split('?')[0] });
      } catch (error) {
        console.error('[SelectProfileImage] 이미지 업로드 실패:', error);
      }
    }

    router.back();
  };
  return (
    <Container>
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: CONTAINER_PADDING * width,
            marginTop: 35,
            marginBottom: 12 * height,
          }}
        >
          <Header>
            {mode === 'leenk' ? '링크 이미지 선택' : '프로필 사진 선택'}
          </Header>
        </View>
        <View style={{ flex: 1 }}>
          <ImagePicker
            maxSelect={1}
            aspectRatio={AspectRatio.SQUARE}
            mode="profile"
            onSelect={(uris) => {
              setSelectedUri(uris[0]);
            }}
          />
        </View>
      </View>

      <View
        style={{
          paddingBottom: 10 * height + insets.bottom,
          paddingTop: 16 * height,
          paddingHorizontal: CONTAINER_PADDING * width,
        }}
      >
        <ButtonContainer $bottomInset={insets.bottom}>
          <CustomButton
            variant="primary"
            size="lg"
            disabled={!selectedUri}
            onPress={handleSelectComplete}
          >
            {mode === 'profile' || mode === 'leenk' ? '선택완료' : '다음'}
          </CustomButton>
        </ButtonContainer>
      </View>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
  position: relative;
`;

const ButtonContainer = styled.View<{ $bottomInset: number }>`
  position: absolute;
  bottom: ${(props) => props.$bottomInset + 10 * height}px;
  align-self: center;
  width: 100%;
  padding: 0 ${CONTAINER_PADDING * width}px;
  /* ${Platform.OS === 'web' ? `padding-horizontal: ${20 * width}px;` : ''} */
`;
