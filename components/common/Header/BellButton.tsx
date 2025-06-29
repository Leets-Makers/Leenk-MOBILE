import { BellIcon } from '@/assets';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function BellButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.push('/');
      }}
    >
      <BellIcon />
    </TouchableOpacity>
  );
}
