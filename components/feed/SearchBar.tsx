import { SearchIcon, XIcon } from '@/assets';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import styled from 'styled-components/native';
import { useState } from 'react';

export default function SearchBar() {
  const [value, setValue] = useState('');

  const handleClear = () => {
    setValue('');
  };

  return (
    <SearchBarWrapper>
      <SearchIcon style={{ marginRight: 8 * width, marginLeft: 6 * width }} />
      <StyledInput
        value={value}
        onChangeText={setValue}
        placeholder="이름 검색"
        placeholderTextColor={colors.text[4]}
      />
      {value.length > 0 && (
        <XButton onPress={handleClear}>
          <XIcon color={colors.gray[900]} />
        </XButton>
      )}
    </SearchBarWrapper>
  );
}

const SearchBarWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${335 * width}px;
  height: ${32 * height}px;
  background-color: ${colors.gray[100]};
  border-radius: ${radius.xs}px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  font-family: ${fonts.Bold};
  font-size: ${fontSize.md}px;
  color: ${colors.text[2]};
  text-align: left;
`;

const XButton = styled.TouchableOpacity`
  width: ${14 * width}px;
  height: ${14 * height}px;
  margin-right: ${12 * width}px;
  justify-content: center;
  align-items: center;
`;
