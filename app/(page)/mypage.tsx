// app/(tabs)/write.tsx
import colors from '@/theme/color';
import { View, Text } from 'react-native';

export default function MyPage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bg[2],
      }}
    >
      <Text>마이 페이지</Text>
    </View>
  );
}
