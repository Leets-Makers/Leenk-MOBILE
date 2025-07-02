import { KebabIcon } from '@/assets';
import colors from '@/theme/color';
import { TouchableOpacity } from 'react-native';

export default function KebabButton({
  handleKebab,
}: {
  handleKebab?: () => void;
}) {
  return (
    <TouchableOpacity onPress={handleKebab || (() => {})}>
      <KebabIcon color={colors.white} width={18} height={18} />
    </TouchableOpacity>
  );
}
