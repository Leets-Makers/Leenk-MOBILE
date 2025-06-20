import { CheckBoxIcon, ToastCheckIcon } from '@/assets';

interface CheckIconProps {
  checked: boolean;
}

export default function CheckBox({ checked }: CheckIconProps) {
  return checked ? <ToastCheckIcon /> : <CheckBoxIcon />;
}

// 사용 예시
// <CheckIcon checked={isSelected} />
