import { Header } from '@/components';
import colors from '@/theme/color';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { LogoText, BellIcon } from '@/assets';

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
      <Header
        LeftSection={<LogoText width={65} height={24} />}
        RightSection={<BellIcon />}
      />
    </View>
  );
}
