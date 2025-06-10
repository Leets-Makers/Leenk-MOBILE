// app/(tabs)/write.tsx
import colors from '@/theme/color';
import { View, Text } from 'react-native';

export default function Leenk() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bg[2],
      }}
    >
      <Text>링크 페이지</Text>
    </View>
  );
}
