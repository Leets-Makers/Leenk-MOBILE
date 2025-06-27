import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function FeedDetail() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>피드 ID는 {id} 입니다</Text>
    </View>
  );
}
