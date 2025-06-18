import { View, Text, Pressable, StyleSheet } from 'react-native';
import colors from '@/theme/color';
import LockIcon from '@/assets/images/ic_lock.svg';
import {
  fontSize,
  lineHeight,
  radius,
  fonts,
  width,
  height,
} from '@/theme/globalStyles';

export default function PrivatePage() {
  return (
    <View style={styles.container}>
      <LockIcon width={120 * width} height={120 * width} />

      <Text style={styles.text}>
        재밌는 기능들을 {'\n'}
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
    gap: 20 * height,
  },
  text: {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.l,
    fontFamily: fonts.Regular,
    fontWeight: '600',
    color: colors.text[3],
    textAlign: 'center',
  },
  buttonContainer: {
    height: 32 * height,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: 12 * width,
    paddingVertical: 8 * height,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.Light,
    fontWeight: '700',
    color: colors.primaryLight,
  },
});
