import { BackArrowIcon } from '@/assets';
import { Header } from '@/components';
import colors from '@/theme/color';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import BackgroundImageSlider from '@/components/feed/BackgroundImageSlider';

export default function FeedWritePage() {
  const router = useRouter();

  return (
    <View>
      <BackgroundImageSlider />
      <Header
        LeftSection={
          <TouchableOpacity onPress={() => router.back()}>
            <BackArrowIcon color={colors.white} />
          </TouchableOpacity>
        }
      />
    </View>
  );
}
