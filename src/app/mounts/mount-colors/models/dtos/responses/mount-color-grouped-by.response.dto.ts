import { ColorLocalize } from './../../color-localize';
import { MountTypeEnum } from './../../../../models/enum/mount-type.enum';

export interface MountColorGroupedByResponseDto {
  type: MountTypeEnum;
  colors: MountColorDto[];
}

export interface MountColorDto {
  _id: string;
  color: ColorLocalize;
  mountType: MountTypeEnum;
}
