import PopupModal from '@/components/Modal/PopupModal';
import colors from '@/theme/color';
import { useState } from 'react';
import { View, Text, Button, Pressable } from 'react-native';
import { useToastStore } from '@/stores/toastStore';
export default function MyPage() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalClose = () => {
    setModalVisible(false);
  };
  const handleConfirm = () => {
    console.log('확인');
  };
  const showToast = useToastStore((s) => s.showToast);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bg[2],
      }}
    >
      <Text>mypage test</Text>
      <PopupModal
        isOpen={modalVisible}
        onClose={handleModalClose}
        onConfirm={handleConfirm}
        mainText="태스트"
        subText="wkrdf"
        isWarning={true}
        rightBtnText="아무거나"
      />

      <Pressable onPress={() => setModalVisible(true)}>
        <Text
          style={{
            color: colors.white,
            padding: 10,
            margin: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.primary,
          }}
        >
          Show Modal
        </Text>
      </Pressable>

      <Button
        title="성공 토스트"
        onPress={() => showToast('작업 성공!', 'success')}
      />
      <Button
        title="실패 토스트"
        onPress={() => showToast('작업 실패!', 'error')}
      />
    </View>
  );
}
