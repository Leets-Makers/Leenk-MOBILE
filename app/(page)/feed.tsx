import { Input, Textarea } from '@/components';
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
      <Text>피드</Text>
      <Input
        title="주제"
        placeholder="텍스트를 입력해주세요"
        subMessage="메세지에 마침표를 찍어요."
      />
      <Textarea variant="dark" placeholder="텍스트입력ㄱㄱㄱㄱㄱㄱㄱ" />
      <Textarea placeholder="텍스트입력ㄱㄱㄱㄱㄱㄱㄱ" maxLength={100} />
    </View>
  );
}
