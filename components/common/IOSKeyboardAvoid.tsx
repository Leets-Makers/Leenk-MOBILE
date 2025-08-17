// components/KeyBoardAvoid.tsx
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, NativeModules } from 'react-native';

const { StatusBarManager } = NativeModules as {
  StatusBarManager: {
    getHeight: (cb: (d: { height: number }) => void) => void;
  };
};

type Props = {
  children: React.ReactNode;
  aosOffset?: number; // Android에서 KAV를 쓸 일이 있으면 사용
};

export default function KeyBoardAvoid({ children, aosOffset = 0 }: Props) {
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'ios' && StatusBarManager?.getHeight) {
      StatusBarManager.getHeight((d) => setStatusBarHeight(d.height ?? 0));
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? 20 + statusBarHeight : aosOffset
      }
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
