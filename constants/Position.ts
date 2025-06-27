import { BEIcon, DEIcon, FEIcon, PMIcon } from '@/assets';

export const POSITION_ICON_MAP: Record<Position, React.FC<any>> = {
  FE: FEIcon,
  BE: BEIcon,
  D: DEIcon,
  PM: PMIcon,
};

export const POSITIONS = ['FE', 'BE', 'D', 'PM'] as const;

export type Position = (typeof POSITIONS)[number];
