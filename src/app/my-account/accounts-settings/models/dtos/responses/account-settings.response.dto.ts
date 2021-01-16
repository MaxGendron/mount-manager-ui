import { MountTypeEnum } from 'src/app/mounts/models/enum/mount-type.enum';

export interface AccountSettingsResponseDto {
  _id: string;
  igUsername: string;
  serverName: string;
  mountTypes: MountTypeEnum[];
  autoFillChildName: boolean;
}
