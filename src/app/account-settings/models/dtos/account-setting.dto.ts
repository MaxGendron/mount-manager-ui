import { MountTypeEnum } from '../enum/mount-type.enum';

export class AccountSettingDto {
  constructor(
    public username: string,
    public serverName: string,
    public mountType: MountTypeEnum[]
  ) {}
}
