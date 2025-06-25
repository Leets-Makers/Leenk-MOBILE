import { BackArrowIcon } from '@/assets';
import {
  Header,
  BackgroundImageSlider,
  CustomButton,
  Textarea,
  Badge,
} from '@/components';
import colors from '@/theme/color';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { generateMockFeeds } from '@/__mocks__/mockFeed';
import { Author } from '@/types/feed';
import { fonts, fontSize, height } from '@/theme/globalStyles';

const mockFeed = generateMockFeeds();
const { userId, name, profileImage } = mockFeed[0].author;

const mockProfile: Author = {
  userId,
  name: '계다현',
  profileImage,
};

export default function FeedWritePage() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <BackgroundImageSlider />
      <Header
        LeftSection={
          <TouchableOpacity onPress={() => router.back()}>
            <BackArrowIcon color={colors.white} width={18} height={18} />
          </TouchableOpacity>
        }
        style={{ position: 'absolute', top: 0, width: '100%', zIndex: 20 }}
      />
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Image
            source={{ uri: mockProfile.profileImage }}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 8 }}
          />
          <Text
            style={{
              color: colors.white,
              fontWeight: 800,
              fontSize: fontSize.lg,
              marginRight: 12,
            }}
          >
            {mockProfile.name}
          </Text>
          <Badge variant="gray" iconType="plus" label={'함께한 사람 추가'} />
        </View>
        <Textarea
          variant="dark"
          placeholder="텍스트를 입력해주세요"
          maxLength={100}
        />
        <CustomButton
          size="lg"
          onPress={() => console.log('pressed')}
          style={{ marginTop: 16 * height, marginBottom: 8 * height }}
        >
          업로드할래
        </CustomButton>
      </View>
    </View>
  );
}
