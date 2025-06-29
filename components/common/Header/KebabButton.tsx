import { KebabIcon } from '@/assets';
import { TouchableOpacity } from 'react-native';

export default function KebabButton({
  handleKebab,
}: {
  handleKebab?: () => void;
}) {
  return (
    <TouchableOpacity onPress={handleKebab || (() => {})}>
      <KebabIcon />
    </TouchableOpacity>
  );
}
