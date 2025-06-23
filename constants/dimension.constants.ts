// constants/dimension.constants.ts
import { Dimensions } from 'react-native';

export const NUM_COLUMNS = 3;
export const ITEM_MARGIN = 4;
export const CONTAINER_PADDING = 16;

const SCREEN_WIDTH = Dimensions.get('window').width;

export const IMAGE_SIZE =
  (SCREEN_WIDTH - CONTAINER_PADDING * 2 - ITEM_MARGIN * (NUM_COLUMNS - 1)) /
  NUM_COLUMNS;
