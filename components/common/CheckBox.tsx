import { CheckBoxIcon, ToastCheckIcon } from '@/assets';

interface CheckIconProps {
  checked: boolean;
}

export default function CheckIcon({ checked }: CheckIconProps) {
  return checked ? <ToastCheckIcon /> : <CheckBoxIcon />;
}

// 사용 예시
// <CheckIcon checked={isSelected} />
