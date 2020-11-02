import { MountGenderEnum } from '../enum/mount-gender.enum';

export class UpdateMountDto {
  name?: string;
  colorId?: string;
  gender?: MountGenderEnum;
  maxNumberOfChild?: number;
}
