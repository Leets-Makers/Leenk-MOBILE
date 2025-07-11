import { KebabIcon } from '@/assets';
import colors from '@/theme/color';
import { TouchableOpacity } from 'react-native';

interface KebabButtonProps {
  handleKebab?: () => void;
  color?: 'white' | 'black';
}

export default function KebabButton({
  handleKebab,
  color = 'white',
}: KebabButtonProps) {
  const iconColor = color === 'white' ? colors.white : colors.black;

  return (
    <TouchableOpacity onPress={handleKebab || (() => {})}>
      <KebabIcon color={iconColor} width={18} height={18} />
    </TouchableOpacity>
  );
}
