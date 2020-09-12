import { MountTypeEnum } from '../enum/mount-type.enum';

export class AccountSettingsDto {
  constructor(public username: string, public serverName: string, public mountType: MountTypeEnum[]) {}
}
