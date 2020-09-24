import { MountTypeEnum } from 'src/app/mounts/models/enum/mount-type.enum';


export interface AccountSettingsDto {
  _id: string;
  igUsername: string;
  serverName: string;
  mountTypes: MountTypeEnum[];
}
