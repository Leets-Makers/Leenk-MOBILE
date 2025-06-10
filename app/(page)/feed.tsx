import colors from '@/theme/color';
import { View, Text } from 'react-native';

export default function Feed() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bg[2],
      }}
    >
      <Text>피드</Text>
    </View>
  );
}
