import { SettingIcon } from '@/assets';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

const ImgButton = styled.Image`
  cursor: pointer;
`;

export default function SettingButton() {
  const router = useRouter();
  return (
    <ImgButton
      src={SettingIcon}
      onClick={() => {
        router.push('/account/setting');
      }}
    />
  );
}
