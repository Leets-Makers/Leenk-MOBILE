import { Input, Textarea } from '@/components';
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
      <InputExamples />
    </View>
  );
}
