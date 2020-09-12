import { MountTypeEnum } from '../../enum/mount-type.enum';

export interface AccountSettingsDto {
  _id: string;
  igUsername: string;
  serverName: string;
  mountTypes: MountTypeEnum[];
}
