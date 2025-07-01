import React from 'react';
import styled from 'styled-components/native';
import DefaultProfileImage from '@/assets/images/ic_default_profile.svg';

interface Props {
  uri?: string | null;
  size?: number;
}

export default function ProfileImageWithFallback({ uri, size = 40 }: Props) {
  if (!uri) {
    return <StyledFallback width={size} height={size} />;
  }

  return <StyledImage source={{ uri }} width={size} height={size} />;
}

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
