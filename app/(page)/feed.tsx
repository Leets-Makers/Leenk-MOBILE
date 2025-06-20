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
import HeaderExamples from '@/components/examples/HeaderExamples';
import ToggleExample from '@/components/examples/ToggleExample';

export default function FeedPage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bg[2],
      }}
    >
      <HeaderExamples />

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
      <ToggleExample />
      <ToggleExample />
    </View>
  );
}
