import { MountResponseDto } from './../../../../models/dtos/responses/mounts.response.dto';

export interface CouplingResponseDto {
  _id: string;
  father: MountResponseDto;
  mother: MountResponseDto;
  childName: string;
  userId: string;
}
