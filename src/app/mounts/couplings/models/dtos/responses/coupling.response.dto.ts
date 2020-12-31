import { MountResponseDto } from '../../../../models/dtos/responses/mount.response.dto';

export interface CouplingResponseDto {
  _id: string;
  father: MountResponseDto;
  mother: MountResponseDto;
  childName: string;
  userId: string;
}
