import { MountGenderEnum } from '../../enum/mount-gender.enum'
import { MountTypeEnum } from '../../enum/mount-type.enum'

export interface MountResponseDto {
  _id: string;
  name: string;
  gender: MountGenderEnum;
  color: string;
  userId: string;
  type: MountTypeEnum;
}