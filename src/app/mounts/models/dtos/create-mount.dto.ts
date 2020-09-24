import { MountGenderEnum } from '../enum/mount-gender.enum';

export class CreateMountDto {
  name: string;
  colorId: string;
  gender: MountGenderEnum;
}
