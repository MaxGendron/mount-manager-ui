import { MountTypeEnum } from '../../enum/mount-type.enum';

export interface MountGenderCountResponseDto {
  male: number;
  female: number;
  type: MountTypeEnum;
}
