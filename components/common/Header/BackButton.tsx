import { BackArrowIcon } from '@/assets';
import colors from '@/theme/color';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const BackButton = ({
  isBackWhite = false,
  signUpBackPress,
}: {
  isBackWhite?: boolean;
  signUpBackPress?: () => void;
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={signUpBackPress ? signUpBackPress : () => router.back()}
    >
      <BackArrowIcon
        color={isBackWhite ? colors.white : colors.black}
        width={18}
        height={18}
      />
    </TouchableOpacity>
  );
};

export default BackButton;
