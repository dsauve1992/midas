import { Injectable } from '@nestjs/common';
import { TechnicalIndicatorService } from './technical-indicator.service';

@Injectable()
export class CheckTechnicalSetupService {
  constructor(private technicalIndicatorService: TechnicalIndicatorService) {}

  async hasStrongTechnicalSetup(symbol: string) {
    const {
      currentPrice,
      currentSma200,
      currentSma50,
      currentEma20,
      currentEma10,
    } = await this.technicalIndicatorService.getTechnicalIndicators(symbol);

    return (
      currentSma50 > currentSma200 &&
      currentPrice > currentSma50 &&
      currentEma10 > currentSma50 &&
      currentEma20 > currentSma50
    );
  }
}
