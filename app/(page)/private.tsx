import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import colors from '@/theme/color';
import LockIcon from '@/assets/images/ic_lock.svg';

export default function PrivatePage() {
  return (
    <View style={styles.container}>
      <LockIcon width={120} height={120} />

      <Text style={styles.text}>
        재밌는 기능들을 <br />
        준비중이야
      </Text>

      <Pressable style={styles.buttonContainer}>
        <Text style={styles.buttonText}>이런 것도 있으면 좋겠어</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg[2],
    gap: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  text: {
    fontWeight: '600',
    fontFamily: 'NanumSquareNeo-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.text[3],
    textAlign: 'center',
  },
  buttonContainer: {
    height: 32,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '700',
    fontFamily: 'NanumSquareNeo-Light',
    fontSize: 12,
    color: colors.primaryLight,
  },
});
