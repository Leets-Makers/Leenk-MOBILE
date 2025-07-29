import { CheckerIcon, GalleryIcon } from '@/assets';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import styled from 'styled-components/native';

export default function LeenkImagePicker() {
  // 3열 기준 너비 계산
  const imageSize = (width * 100 - 2 * 8) / 3;
  // TODO: 실제 이미지로 변경
  const images = [1, 2, 3, 4, 5];

  return (
    <Container>
      <ImageGrid>
        {images.map((_, index) => (
          <SquareImage
            key={index}
            style={{ width: imageSize, height: imageSize }}
          >
            <CheckerIcon />
          </SquareImage>
        ))}
        <ImageUploadButton style={{ width: imageSize, height: imageSize }}>
          <GalleryIcon />
          <BtnText>업로드</BtnText>
        </ImageUploadButton>
      </ImageGrid>
    </Container>
  );
}
const Container = styled.View`
  width: 100%;
`;

const ImageGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${width * 4}px;
`;

const SquareImage = styled.View`
  background-color: ${colors.gray[10]};
  border-radius: ${radius.sm}px;
  align-items: center;
  justify-content: center;
`;

const ImageUploadButton = styled.Pressable`
  background-color: ${colors.bg[4]};
  border-radius: ${radius.sm}px;
  align-items: center;
  justify-content: center;
`;

const BtnText = styled.Text`
  color: ${colors.text[3]};
  font-family: ${fonts.Regular};
  font-size: ${fontSize.sm}px;
  line-height: ${lineHeight.s}px;
  margin-top: ${height * 4}px;
`;
