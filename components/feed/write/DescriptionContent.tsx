import React from 'react';
import { Platform, Animated, View } from 'react-native';
import { Textarea } from '@/components';
import useKeyboardAnimation from '@/hooks/useKeyboardAnimation';
import { height } from '@/theme/globalStyles';

interface Props {
  value: string;
  onChange: (v: string) => void;
  iosBottomGap: number; // iOS 키보드 간격 계산치
}

export default function DescriptionContent({
  value,
  onChange,
  iosBottomGap,
}: Props) {
  const androidTranslateY = useKeyboardAnimation(-300 * height);

  if (Platform.OS === 'ios') {
    return (
      <View style={{ marginBottom: iosBottomGap }}>
        <Textarea
          variant="dark"
          placeholder="텍스트를 입력해주세요"
          maxLength={100}
          value={value}
          onChangeText={onChange}
          textFontKey="Bold"
        />
      </View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ translateY: androidTranslateY }] }}>
      <Textarea
        variant="dark"
        placeholder="텍스트를 입력해주세요"
        maxLength={100}
        value={value}
        onChangeText={onChange}
      />
    </Animated.View>
  );
}
