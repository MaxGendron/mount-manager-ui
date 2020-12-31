import { MountResponseDto } from './mount.response.dto';

export class GetMountsResponseDto {
  totalCount: number;
  mounts: MountResponseDto[];
}
