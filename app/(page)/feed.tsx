import { Badge, CustomButton, Input, Textarea } from '@/components';
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
      <Input placeholder="안녕하세요" />
      <Badge label={'3기'} />
      <Badge
        variant="gray"
        label={'이강혁'}
        iconType="plus"
        onRemove={() => console.log()}
      />
      <Badge variant="white" label={'1,230'} />
    </View>
  );
}
