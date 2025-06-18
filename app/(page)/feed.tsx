import colors from '@/theme/color';
import { View, Text } from 'react-native';
import { CustomButton } from '@/components';
import ButtonExamples from '@/components/examples/ButtonExamples';

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
      <ButtonExamples />
    </View>
  );
}
