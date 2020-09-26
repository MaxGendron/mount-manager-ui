import { ColorLocalize } from './../../color-localize';
import { MountTypeEnum } from '../../../../models/enum/mount-type.enum';

export interface MountColorResponseDto {
  _id: string;
  color: ColorLocalize;
  mountType: MountTypeEnum;
}
