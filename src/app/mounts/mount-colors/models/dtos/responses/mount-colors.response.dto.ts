import { MountTypeEnum } from 'src/app/mounts/models/enum/mount-type.enum';

export interface MountColorsResponseDto {
  _id: string;
  color : string;
  mountType: MountTypeEnum;
}