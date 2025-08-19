import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomButton } from '@/components';
import { height } from '@/theme/globalStyles';

interface Props {
  disabled: boolean;
  isEditMode: boolean;
  onPress: () => void;
}

export default function ButtonContent({
  disabled,
  isEditMode,
  onPress,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <CustomButton
      size="lg"
      onPress={onPress}
      style={{
        marginTop: 20 * height,
        marginBottom: Platform.OS === 'android' ? insets.bottom : 8 * height,
      }}
      disabled={disabled}
    >
      {isEditMode ? '수정할래' : '업로드할래'}
    </CustomButton>
  );
}
