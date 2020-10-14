import { ColorLocalize } from 'src/app/mounts/mount-colors/models/color-localize';
import { MountGenderEnum } from '../../enum/mount-gender.enum';
import { MountTypeEnum } from '../../enum/mount-type.enum';

export interface MountResponseDto {
  _id: string;
  name: string;
  gender: MountGenderEnum;
  color: ColorLocalize;
  userId: string;
  colorId: string;
  type: MountTypeEnum;
}
