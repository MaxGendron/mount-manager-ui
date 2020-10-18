import { MountResponseDto } from './../../../../models/dtos/responses/mounts.response.dto';

export interface CouplingResponseDto {
  _id: string;
  dad: MountResponseDto;
  mom: MountResponseDto;
  childName: string;
  userId: string;
}