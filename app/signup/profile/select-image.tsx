import { CustomButton, Header, ImagePicker } from '@/components';
import colors from '@/theme/color';
import { height, width } from '@/theme/globalStyles';
import { AspectRatio } from '@/types/aspect-ratio';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { useProfileStore } from '@/stores/profileStore';
import { useState } from 'react';
import { Platform } from 'react-native';

export default function SelectProfileImage() {
  const router = useRouter();
  const { setProfileImage } = useProfileStore();

  const [selectedUri, setSelectedUri] = useState<string | null>(null);

  return (
    <Container>
      <Header>프로필 사진 선택</Header>

      <ImagePicker
        maxSelect={1}
        aspectRatio={AspectRatio.SQUARE}
        mode="profile"
        onSelect={(uris) => {
          setSelectedUri(uris[0]);
        }}
      />

      <ButtonContainer>
        <CustomButton
          variant="primary"
          size="lg"
          disabled={!selectedUri}
          onPress={() => {
            if (selectedUri) {
              setProfileImage(selectedUri);
              router.back();
            }
          }}
        >
          선택완료
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
const ButtonContainer = styled.View`
  position: absolute;
  bottom: ${44 * height}px;
  align-self: center;
  width: 100%;
  ${Platform.OS === 'web' ? `padding-horizontal: ${20 * width}px;` : ''}
`;
