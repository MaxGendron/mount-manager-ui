import { MountTypeEnum } from '../enum/mount-type.enum';

export class UpdateAccountSettingsDto {
  igUsername?: string;
  serverName?: string;
  mountTypes?: MountTypeEnum[];
}
