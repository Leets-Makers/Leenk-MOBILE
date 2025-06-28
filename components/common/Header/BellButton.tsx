import { BellIcon } from '@/assets';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

const ImgButton = styled.Image`
  cursor: pointer;
`;

export default function BellButton() {
  const router = useRouter();
  return (
    <ImgButton
      src={BellIcon}
      onClick={() => {
        router.push('/');
      }}
    />
  );
}
