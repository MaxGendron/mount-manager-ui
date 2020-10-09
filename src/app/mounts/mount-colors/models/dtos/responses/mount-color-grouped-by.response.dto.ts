import { ColorLocalize } from './../../color-localize';
import { MountTypeEnum } from './../../../../models/enum/mount-type.enum';

export interface MountColorGroupedByResponseDto {
  type: MountTypeEnum;
  colors: MountColor[];
}

export interface MountColor {
  _id: string;
  color: ColorLocalize;
  mountType: MountTypeEnum;
}