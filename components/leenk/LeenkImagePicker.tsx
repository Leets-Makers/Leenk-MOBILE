import { useState, useEffect, useMemo } from 'react';
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
import { LEENK_DEFAULT_IMAGE_URLS } from '@/constants/leenkDefaultImages';

export default function LeenkImagePicker() {
  const imageSize = width * 106;
  const router = useRouter();

  const { leenkImage, setLeenkImage } = useLeenkImageStore();

  // SVG 리스트(그림)와 URL 리스트(실제 전송값)를 같은 인덱스로 매핑
  const defaultSvgs = useMemo(
    () => [LeenkImg03, LeenkImg02, LeenkImg01, LeenkImg04, LeenkImg05],
    [],
  );
  const defaultUrls = LEENK_DEFAULT_IMAGE_URLS;

  // 현재 선택 상태: 0~4(기본 이미지 인덱스), 'upload'(업로드 슬롯), null(미선택)
  const [selectedIndex, setSelectedIndex] = useState<number | 'upload' | null>(
    null,
  );

  // store의 값으로 선택 상태 초기화/동기화
  useEffect(() => {
    if (!leenkImage) {
      setSelectedIndex(null);
      return;
    }
    const idx = defaultUrls.indexOf(leenkImage);
    if (idx >= 0) {
      // 기본 이미지 중 하나가 선택된 상태
      setSelectedIndex(idx);
    } else {
      setSelectedIndex('upload');
    }
  }, [leenkImage, defaultUrls]);

  const openUpload = () => {
    setSelectedIndex('upload');
    router.push({ pathname: '/(post)/leenk/select-image' });
  };

  // 기본 이미지 눌렀을 때: 선택 + store에 해당 S3 URL 저장
  const handlePickDefault = (index: number) => {
    setSelectedIndex(index);
    setLeenkImage(defaultUrls[index]);
  };

  const isDefaultSelected = leenkImage
    ? defaultUrls.includes(leenkImage)
    : false;

  return (
    <Container>
      <ImageGrid>
        {defaultSvgs.map((SvgComponent, index) => (
          <SquareImage
            key={index}
            style={{ width: imageSize, height: imageSize }}
            $selected={selectedIndex === index}
            onPress={() => handlePickDefault(index)}
          >
            <SvgComponent width="100%" height="100%" />
          </SquareImage>
        ))}

        {/* 업로드 슬롯 */}
        <ImageUploadButton
          style={{ width: imageSize, height: imageSize }}
          onPress={openUpload}
          $selected={selectedIndex === 'upload'}
        >
          {/* 기본 이미지가 선택된 상태라면 업로드 슬롯에는 미리보기 표시하지 않음 */}
          {leenkImage && !isDefaultSelected ? (
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
