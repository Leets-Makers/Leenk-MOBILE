import { useState } from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import {
  GalleryIcon,
  LeenkImg01,
  LeenkImg02,
  LeenkImg03,
  LeenkImg04,
  LeenkImg05,
} from '@/assets';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import { useRouter } from 'expo-router';
import { useLeenkImageStore } from '@/stores/leenkStore';

export default function LeenkImagePicker() {
  const imageSize = width * 106;
  const router = useRouter();

  const { leenkImage } = useLeenkImageStore();
  const [selectedIndex, setSelectedIndex] = useState<number | 'upload' | null>(
    null,
  );

  const defaultImages = [
    LeenkImg01,
    LeenkImg02,
    LeenkImg03,
    LeenkImg04,
    LeenkImg05,
  ];

  const openUpload = () => {
    router.push({
      pathname: '/(post)/leenk/select-image',
    });
  };

  return (
    <Container>
      <ImageGrid>
        {defaultImages.map((SvgComponent, index) => (
          <SquareImage
            key={index}
            style={{ width: imageSize, height: imageSize }}
            $selected={selectedIndex === index}
            onPress={() => setSelectedIndex(index)}
          >
            <SvgComponent width="100%" height="100%" />
          </SquareImage>
        ))}
        <ImageUploadButton
          style={{ width: imageSize, height: imageSize }}
          onPress={() => {
            setSelectedIndex('upload');
            openUpload();
          }}
          $selected={selectedIndex === 'upload'}
        >
          {leenkImage ? (
            <UploadedImg source={{ uri: leenkImage }} />
          ) : (
            <>
              <GalleryIcon />
              <BtnText>업로드</BtnText>
            </>
          )}
        </ImageUploadButton>
      </ImageGrid>
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
  margin-top: ${height * 8}px;
`;

const ImageGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${width * 4}px;
`;

const SquareImage = styled.Pressable<{ $selected: boolean }>`
  background-color: ${colors.gray[10]};
  border-radius: ${radius.md}px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-width: 2px;
  border-color: ${({ $selected }) =>
    $selected ? colors.primary : 'transparent'};
`;

const ImageUploadButton = styled.Pressable<{ $selected: boolean }>`
  background-color: ${colors.bg[4]};
  border-radius: ${radius.md}px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-width: 2px;
  border-color: ${({ $selected }) =>
    $selected ? colors.primary : 'transparent'};
`;

const UploadedImg = styled.Image`
  width: 100%;
  height: 100%;
`;

const BtnText = styled.Text`
  color: ${colors.text[3]};
  font-family: ${fonts.Regular};
  font-size: ${fontSize.sm}px;
  line-height: ${lineHeight.s}px;
  margin-top: ${height * 4}px;
`;
