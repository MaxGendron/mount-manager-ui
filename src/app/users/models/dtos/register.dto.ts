import { MountTypeEnum } from 'src/app/mounts/models/enum/mount-type.enum';

export class RegisterDto {
  constructor(
    public username: string,
    public email: string,
    public password: string,
    public mountTypes: MountTypeEnum[],
  ) {}
}
