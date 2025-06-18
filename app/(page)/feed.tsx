import colors from '@/theme/color';
import { View, Text } from 'react-native';
import { CustomButton } from '@/components';

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
      <CustomButton onPress={() => console.log('Primary')}>
        모집하기
      </CustomButton>
    </View>
  );
}
