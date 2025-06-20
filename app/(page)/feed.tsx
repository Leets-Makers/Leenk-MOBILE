import {
  Badge,
  CustomButton,
  Header,
  Input,
  Textarea,
  Toggle,
} from '@/components';
import ButtonExamples from '@/components/examples/ButtonExamples';
import InputExamples from '@/components/examples/InputExamples';
import colors from '@/theme/color';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { BellIcon, LogoText, BackArrowIcon, KebabIcon } from '@/assets';

export default function FeedPage() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bg[2],
      }}
    >
      <Header
        LeftSection={<LogoText width={66} height={30} />}
        RightSection={<BellIcon />}
      />
      <Header LeftSection={<BackArrowIcon />} />
      <Header LeftSection={<BackArrowIcon />} RightSection={<KebabIcon />} />
      <Header
        LeftSection={<BackArrowIcon />}
        TitleSection={
          <Text style={{ fontWeight: 600, fontSize: 16 }}>프로필 편집</Text>
        }
        RightSection={<KebabIcon />}
      />

      <Textarea placeholder="안녕하세요 " />
      <CustomButton variant="primary" onPress={() => console.log('pressed')}>
        확인
      </CustomButton>
      <Input placeholder="안녕하세요" />
      <Badge label={'3기'} />
      <Badge
        variant="gray"
        label={'이강혁'}
        iconType="plus"
        onRemove={() => console.log()}
      />
      <Badge variant="white" label={'1,230'} />
      <Badge
        variant="primary"
        iconType="x"
        onRemove={() => console.log()}
        label={'이강혁'}
      />
      <Toggle isOn={isEnabled} onToggle={() => setIsEnabled((prev) => !prev)} />
    </View>
  );
}
