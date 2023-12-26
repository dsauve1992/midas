import { Injectable } from '@nestjs/common';
import { TechnicalIndicatorService } from '../domain/service/technical-indicator.service';

@Injectable()
export class ComputeTechnicalRatingUseCase {
  constructor(
    private getTechnicalIndicatorsUseCase: TechnicalIndicatorService,
  ) {}

  async execute(symbol: string) {
    try {
      let ratio = 0;
      const {
        currentSma200,
        currentSma150,
        currentSma50,
        highRatio,
        lowRatio,
        currentPrice,
      } =
        await this.getTechnicalIndicatorsUseCase.getTechnicalIndicators(symbol);

      if (currentSma150 > currentSma200) {
        ratio += 30;
      }

      if (currentSma50 > currentSma150) {
        ratio += 30;
      }

      if (currentPrice > currentSma50) {
        ratio += 20;
      }

      if (highRatio < 25) {
        ratio += 10;
      }

      if (lowRatio > 30) {
        ratio += 10;
      }

      return ratio;
    } catch (e) {
      return -1;
    }
  }
}
