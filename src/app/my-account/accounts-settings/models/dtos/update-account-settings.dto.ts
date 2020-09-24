import { MountTypeEnum } from 'src/app/mounts/models/enum/mount-type.enum';


export class UpdateAccountSettingsDto {
  igUsername?: string;
  serverName?: string;
  mountTypes?: MountTypeEnum[];
}
