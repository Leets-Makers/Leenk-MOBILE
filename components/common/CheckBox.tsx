import { CheckBoxIcon, ToastCheckIcon, CheckIcon, NoCheckIcon } from '@/assets';
import { Pressable } from 'react-native';

interface CheckBoxProps {
  checked: boolean;
  onPress?: () => void;
  noBox?: boolean; // 박스 없는 체크 표시 여부
}

export default function CheckBox({
  checked,
  onPress,
  noBox = false,
}: CheckBoxProps) {
  return (
    <Pressable onPress={onPress} hitSlop={10}>
      {noBox ? (
        checked ? (
          <CheckIcon />
        ) : (
          <NoCheckIcon />
        )
      ) : checked ? (
        <ToastCheckIcon />
      ) : (
        <CheckBoxIcon />
      )}
    </Pressable>
  );
}

// 사용 예시
// <CheckIcon checked={isSelected} />
