import PopupModal from '@/components/Modal/PopupModal';
import colors from '@/theme/color';
import { useState } from 'react';
import { View, Text, Button, Pressable } from 'react-native';

export default function Feed() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalClose = () => {
    setModalVisible(!modalVisible);
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bg[2],
      }}
    >
      <Text>피드</Text>
      <PopupModal
        isOpen={modalVisible}
        onClose={handleModalClose}
        mainText="태스트"
        subText="wkrdf"
        isWarning={true}
        rightBtnText="아무거나"
      />

      <Pressable onPress={() => setModalVisible(true)}>
        <Text>Show Modal</Text>
      </Pressable>
    </View>
  );
}
