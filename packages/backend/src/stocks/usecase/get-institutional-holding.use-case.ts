import { Injectable } from '@nestjs/common';
import { OwnershipService } from '../../ownership/ownership.service';

@Injectable()
export class GetInstitutionalHoldingUseCase {
  constructor(private ownershipService: OwnershipService) {}

  async execute(symbol: string) {
    const [history, topShareholders] = await Promise.all([
      this.ownershipService.getHistory(symbol),
      this.ownershipService.getTopShareHolders(symbol),
    ]);

    return {
      history,
      topShareholders,
    };
  }
}
