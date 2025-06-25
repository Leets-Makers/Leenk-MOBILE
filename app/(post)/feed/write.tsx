import { BackArrowIcon } from '@/assets';
import { Header, BackgroundImageSlider } from '@/components';
import colors from '@/theme/color';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function FeedWritePage() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <BackgroundImageSlider />
      <Header
        LeftSection={
          <TouchableOpacity onPress={() => router.back()}>
            <BackArrowIcon color={colors.white} />
          </TouchableOpacity>
        }
        style={{ position: 'absolute', top: 0, width: '100%', zIndex: 20 }}
      />
    </View>
  );
}
