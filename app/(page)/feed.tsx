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
      <CustomButton
        variant="primary"
        size="lg"
        rounded="md"
        onPress={() => console.log('clicked')}
      >
        확인
      </CustomButton>
    </View>
  );
}
