import { CouplingResponseDto } from './coupling.response.dto';

export class GetCouplingsReponseDto {
  totalCount: number;
  couplings: CouplingResponseDto[];
}
