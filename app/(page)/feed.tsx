import { CustomButton, Input, Textarea } from '@/components';
import ButtonExamples from '@/components/examples/ButtonExamples';
import InputExamples from '@/components/examples/InputExamples';
import colors from '@/theme/color';
import { View, Text } from 'react-native';

export default function FeedPage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bg[2],
      }}
    >
      <Textarea placeholder="안녕하세요 " />
      <CustomButton variant="primary" onPress={() => console.log('pressed')}>
        확인
      </CustomButton>
    </View>
  );
}
