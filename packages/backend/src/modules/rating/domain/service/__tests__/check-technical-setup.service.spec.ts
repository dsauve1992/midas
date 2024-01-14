import { CheckTechnicalSetupService } from '../check-technical-setup.service';
import { TradingViewScreenerEntry } from '../../../../screener/service/screener.service';

describe('CheckTechnicalSetupService specs', () => {
  test('it should have strong technical setup when sma50 is above sma200, current price, ema20 and ema10 are above sma50 and ema10 is above ema20', async () => {
    const strongTechnicalSetup =
      await CheckTechnicalSetupService.hasStrongTechnicalSetup({
        sma200: 178.65,
        sma50: 185.4,
        ema20: 193.33,
        ema10: 194.96,
        price: 193.6,
      } as TradingViewScreenerEntry);

    expect(strongTechnicalSetup).toBe(true);
  });

  test('it should not have strong technical setup when sma50 is below sma200', async () => {
    const strongTechnicalSetup =
      await CheckTechnicalSetupService.hasStrongTechnicalSetup({
        sma200: 178.65,
        sma50: 2,
        ema20: 193.33,
        ema10: 194.96,
        price: 193.6,
      } as TradingViewScreenerEntry);

    expect(strongTechnicalSetup).toBe(false);
  });

  test('it should not have strong technical setup when current price is below sma50', async () => {
    const strongTechnicalSetup =
      await CheckTechnicalSetupService.hasStrongTechnicalSetup({
        sma200: 178.65,
        sma50: 183.36,
        ema20: 193.33,
        ema10: 194.96,
        price: 2,
      } as TradingViewScreenerEntry);

    expect(strongTechnicalSetup).toBe(false);
  });

  test('it should not have strong technical setup when ema10 is below sma50', async () => {
    const strongTechnicalSetup =
      await CheckTechnicalSetupService.hasStrongTechnicalSetup({
        sma200: 178.65,
        sma50: 185.4,
        ema20: 193.33,
        ema10: 2,
        price: 193.6,
      } as TradingViewScreenerEntry);

    expect(strongTechnicalSetup).toBe(false);
  });

  test('it should not have strong technical setup when ema20 is below sma50', async () => {
    const strongTechnicalSetup =
      await CheckTechnicalSetupService.hasStrongTechnicalSetup({
        sma200: 178.65,
        sma50: 185.4,
        ema20: 2,
        ema10: 194.96,
        price: 193.6,
      } as TradingViewScreenerEntry);

    expect(strongTechnicalSetup).toBe(false);
  });
});
