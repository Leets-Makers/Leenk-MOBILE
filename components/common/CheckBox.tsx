import { CheckBoxIcon, ToastCheckIcon, CheckIcon, NoCheckIcon } from '@/assets';
import { GestureResponderEvent, Pressable } from 'react-native';

interface CheckBoxProps {
  checked: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  noBox?: boolean; // 박스 없는 체크 표시 여부
}

export default function CheckBox({
  checked,
  onPress,
  noBox = false,
}: CheckBoxProps) {
  return (
    <Pressable
      hitSlop={10}
      onPress={(e) => {
        e.stopPropagation(); // 부모 Wrapper onPress로 전파 방지
        onPress?.(e);
      }}
    >
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
