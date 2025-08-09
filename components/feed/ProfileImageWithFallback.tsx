import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { DefaultProfileImage } from '@/assets';

interface Props {
  uri?: string | null;
  size?: number;
  isDark?: boolean;
}

export default function ProfileImageWithFallback({
  uri,
  size = 40,
  isDark = true,
}: Props) {
  const [error, setError] = useState(false);
  useEffect(() => {
    setError(false);
  }, [uri]);
  const showFallback = !uri || error;
  return (
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
  );
}

const ImageContainer = styled.View<{ width: number }>`
  width: ${({ width }) => width}px;
  height: ${({ width }) => width}px;
  border-radius: ${({ width }) => width / 2}px;
  overflow: hidden;
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
