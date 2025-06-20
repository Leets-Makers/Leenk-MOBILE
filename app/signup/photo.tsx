import React, { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import {
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Text,
} from 'react-native';
import styled from 'styled-components/native';
import { Image } from 'expo-image';
import { BackArrowIcon, CheckBoxIcon } from '@/assets';
import { CustomButton, Header } from '@/components';
import colors from '@/theme/color';
import { useRouter } from 'expo-router';
import { height, width } from '@/theme/globalStyles';

const imageSize = width / 3;

export default function ProfileImageSelect() {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [selectedUri, setSelectedUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const { assets } = await MediaLibrary.getAssetsAsync({
          mediaType: 'photo',
          first: 60,
        });
        setPhotos(assets);
      }
    })();
  }, []);

  const handleSelect = (uri: string) => {
    setSelectedUri(uri);
  };

  const handleNext = () => {
    if (selectedUri) {
      console.log('선택된 사진:', selectedUri);
      // → 상태 저장 또는 다음 단계 이동
    }
  };
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
          <Text style={{ fontWeight: 600, fontSize: 16 }}>
            프로필 사진 선택
          </Text>
        }
      />
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item.uri)}>
            <ImageBox>
              <StyledImage source={item.uri} />
              {selectedUri === item.uri && (
                <Overlay>
                  <CheckBoxIcon width={20} height={20} fill={colors.primary} />
                </Overlay>
              )}
            </ImageBox>
          </TouchableOpacity>
        )}
      />
      <ButtonContainer>
        <CustomButton
          variant="primary"
          onPress={handleNext}
          disabled={!selectedUri}
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
`;

const ImageBox = styled.View`
  width: ${imageSize}px;
  height: ${imageSize}px;
  position: relative;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: ${44 * height}px;
  align-self: center;
`;
