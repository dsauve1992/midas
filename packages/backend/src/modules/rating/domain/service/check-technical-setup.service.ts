import { ScreenerEntryResponse } from '../../../screener/service/screener.service';

export class CheckTechnicalSetupService {
  static async hasStrongTechnicalSetup(entry: ScreenerEntryResponse) {
    const { price, ema10, ema20, sma50, sma200 } = entry;

    return sma50 > sma200 && ema10 > sma50 && ema20 > sma50 && price > sma50;
  }
}
