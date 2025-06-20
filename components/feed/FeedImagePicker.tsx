import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import styled from 'styled-components/native';

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const imageSize = screenWidth / numColumns;

export default function GallerySelectScreen() {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [selected, setSelected] = useState<MediaLibrary.Asset[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        const album = await MediaLibrary.getAlbumAsync('Camera');
        const { assets } = await MediaLibrary.getAssetsAsync({
          album: album ?? undefined,
          mediaType: 'photo',
          sortBy: [['creationTime', false]],
          first: 50,
        });
        setPhotos(assets);
      } else {
        setHasPermission(false);
      }
    })();
  }, []);

  const toggleSelect = (photo: MediaLibrary.Asset) => {
    const isSelected = selected.find((item) => item.id === photo.id);
    if (isSelected) {
      setSelected((prev) => prev.filter((item) => item.id !== photo.id));
    } else if (selected.length < 3) {
      setSelected((prev) => [...prev, photo]);
    }
  };

  const getSelectionNumber = (photoId: string) => {
    const index = selected.findIndex((item) => item.id === photoId);
    return index >= 0 ? index + 1 : null;
  };

  const renderItem = ({ item }: { item: MediaLibrary.Asset }) => {
    const number = getSelectionNumber(item.id);
    return (
      <TouchableOpacity onPress={() => toggleSelect(item)}>
        <ImageBox source={{ uri: item.uri }} />
        {number && (
          <Badge>
            <BadgeText>{number}</BadgeText>
          </Badge>
        )}
      </TouchableOpacity>
    );
  };

  if (hasPermission === false) return <Text>권한이 필요합니다.</Text>;

  return (
    <Container>
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
      />
      <BottomBar>
        <SelectedCount>{selected.length} </SelectedCount>
        <NextButton disabled={selected.length === 0}>
          <NextText>다음</NextText>
        </NextButton>
      </BottomBar>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const ImageBox = styled.Image`
  width: ${imageSize}px;
  height: ${(imageSize * 4) / 3}px;
`;

const Badge = styled.View`
  position: absolute;
  top: 6px;
  right: 6px;
  background-color: #7b42ff;
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
`;

const BadgeText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 12px;
`;

const BottomBar = styled.View`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const SelectedCount = styled.Text`
  font-size: 14px;
  margin-right: 12px;
`;

const NextButton = styled.TouchableOpacity<{ disabled: boolean }>`
  background-color: ${({ disabled }) => (disabled ? '#eee' : '#7b42ff')};
  padding: 10px 24px;
  border-radius: 20px;
`;

const NextText = styled.Text`
  color: white;
  font-weight: bold;
`;
