import { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { DefaultProfileImage, BirthdayIcon } from '@/assets';

interface ProfileImageProps {
  uri?: string | null;
  size?: number;
  isBirthday?: boolean; // 생일자 여부
}

export default function ProfileImageWithFallback({
  uri,
  size = 40,
  isBirthday = false,
}: ProfileImageProps) {
  const [error, setError] = useState(false);
  useEffect(() => {
    setError(false);
  }, [uri]);
  const showFallback = !uri || error;
  return (
    <Wrapper width={size}>
      <ImageContainer width={size}>
        {showFallback ? (
          <StyledFallback width={size} height={size} />
        ) : (
          <StyledImage
            source={{ uri }}
            width={size}
            height={size}
            onError={(error) => {
              console.warn('이미지 로딩 실패', error.nativeEvent.error);
              setError(true);
            }}
            accessible={true}
            accessibilityLabel="프로필이미지"
            accessibilityRole="image"
          />
        )}
      </ImageContainer>
      {isBirthday && (
        <BirthdayOverlay>
          <BirthdayIcon width={24} height={24} />
        </BirthdayOverlay>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.View<{ width: number }>`
  width: ${({ width }) => width}px;
  height: ${({ width }) => width}px;
  position: relative;
  overflow: visible;
`;
// 프로필 이미지 원형 클리핑
const ImageContainer = styled.View<{ width: number }>`
  width: ${({ width }) => width}px;
  height: ${({ width }) => width}px;
  border-radius: ${({ width }) => width / 2}px;
  overflow: hidden;
  position: relative;
`;

const StyledFallback = styled(DefaultProfileImage)<{
  width: number;
  height: number;
}>`
  border-radius: ${({ width }) => width / 2}px;
`;

const StyledImage = styled.Image<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  border-radius: ${({ width }) => width / 2}px;
`;

const BirthdayOverlay = styled.View`
  position: absolute;
  top: -10px;
  left: 6px;
  z-index: 10;
  elevation: 10;
`;
