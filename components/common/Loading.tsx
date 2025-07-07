import LottieAnimation from 'lottie-react-native';
import loadingAnimation from '@/assets/lotties/Loading.json';
import { View } from 'react-native';
import styled from 'styled-components/native';

interface LoadingProps {
  fullScreen?: boolean; // 피드업로드 시 로딩 모달 내부의 로딩로티 레이아웃이 깨져서 추가함
}

export default function Loading({ fullScreen = true }: LoadingProps) {
  const animation = (
    <StyledLottie
      source={loadingAnimation}
      autoPlay
      loop
      fullScreen={fullScreen}
    />
  );
  if (fullScreen) {
    return <Overlay>{animation}</Overlay>;
  }

  return animation;
}

const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const StyledLottie = styled(LottieAnimation)<{ fullScreen: boolean }>`
  width: ${({ fullScreen }) => (fullScreen ? 74 : 54)}px;
  height: ${({ fullScreen }) => (fullScreen ? 40 : 20)}px;
`;
