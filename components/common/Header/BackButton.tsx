import { BackArrowIcon } from '@/assets';
import colors from '@/theme/color';
import { useRouter } from 'expo-router';
import { Pressable, TouchableOpacity } from 'react-native';

const BackButton = ({
  isBackWhite = false,
  signUpBackPress,
}: {
  isBackWhite?: boolean;
  signUpBackPress?: () => void;
}) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={signUpBackPress ? signUpBackPress : () => router.back()}
      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    >
      <BackArrowIcon
        color={isBackWhite ? colors.white : colors.black}
        width={18}
        height={18}
      />
    </Pressable>
  );
};

export default BackButton;
