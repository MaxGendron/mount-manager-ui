import { MountTypeEnum } from '../../../../models/enum/mount-type.enum';

export interface MountColorResponseDto {
  _id: string;
  color : string;
  mountType: MountTypeEnum;
}