import { SettingIcon } from '@/assets';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function SettingButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        router.push('/account/setting');
      }}
    >
      <SettingIcon />
    </TouchableOpacity>
  );
}
