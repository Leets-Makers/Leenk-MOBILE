import styled from 'styled-components/native';
import { Image } from 'expo-image';
import { height, width } from '@/theme/globalStyles';
import colors from '@/theme/color';

export default function Splash() {
  return (
    <Container>
      <LogoImage
        source={require('@/assets/images/gif/ic_loading_loop.gif')}
        contentFit="cover"
        transition={300}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.bg[2]};
`;

const LogoImage = styled(Image)`
  width: ${300 * width}px;
  height: ${171 * height}px;
`;
