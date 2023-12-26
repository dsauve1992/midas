import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { TechnicalIndicatorService } from '../technical-indicator.service';
import { CheckTechnicalSetupService } from '../check-technical-setup.service';

describe('CheckTechnicalSetupService specs', () => {
  let checkTechnicalSetupService: CheckTechnicalSetupService;
  let technicalIndicatorService: DeepMocked<TechnicalIndicatorService>;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        CheckTechnicalSetupService,
        {
          provide: TechnicalIndicatorService,
          useValue: createMock<TechnicalIndicatorService>(),
        },
      ],
    }).compile();

    checkTechnicalSetupService = app.get(CheckTechnicalSetupService);
    technicalIndicatorService = app.get(TechnicalIndicatorService);
  });

  test('it should have strong technical setup when sma50 is above sma200 and current price, ema20 and ema10 are above sma50', async () => {
    technicalIndicatorService.getTechnicalIndicators.mockResolvedValue({
      currentSma200: 178.65,
      currentSma150: 183.36,
      currentSma50: 185.4,
      currentEma20: 193.33,
      currentEma10: 194.96,
      currentPrice: 193.6,
      highRatio: 3.02,
      lowRatio: 55.92,
    });

    const strongTechnicalSetup =
      await checkTechnicalSetupService.hasStrongTechnicalSetup('AAPL');

    expect(strongTechnicalSetup).toBe(true);
  });

  test('it should not have strong technical setup when sma50 is below sma200', async () => {
    technicalIndicatorService.getTechnicalIndicators.mockResolvedValue({
      currentSma200: 178.65,
      currentSma150: 183.36,
      currentSma50: 2,
      currentEma20: 193.33,
      currentEma10: 194.96,
      currentPrice: 193.6,
      highRatio: 3.02,
      lowRatio: 55.92,
    });

    const strongTechnicalSetup =
      await checkTechnicalSetupService.hasStrongTechnicalSetup('AAPL');

    expect(strongTechnicalSetup).toBe(false);
  });

  test('it should not have strong technical setup when current price is below sma50', async () => {
    technicalIndicatorService.getTechnicalIndicators.mockResolvedValue({
      currentSma200: 178.65,
      currentSma150: 183.36,
      currentSma50: 183.36,
      currentEma20: 193.33,
      currentEma10: 194.96,
      currentPrice: 2,
      highRatio: 3.02,
      lowRatio: 55.92,
    });

    const strongTechnicalSetup =
      await checkTechnicalSetupService.hasStrongTechnicalSetup('AAPL');

    expect(strongTechnicalSetup).toBe(false);
  });

  test('it should not have strong technical setup when ema10 is below sma50', async () => {
    technicalIndicatorService.getTechnicalIndicators.mockResolvedValue({
      currentSma200: 178.65,
      currentSma150: 183.36,
      currentSma50: 185.4,
      currentEma20: 193.33,
      currentEma10: 2,
      currentPrice: 193.6,
      highRatio: 3.02,
      lowRatio: 55.92,
    });

    const strongTechnicalSetup =
      await checkTechnicalSetupService.hasStrongTechnicalSetup('AAPL');

    expect(strongTechnicalSetup).toBe(false);
  });

  test('it should not have strong technical setup when ema20 is below sma50', async () => {
    technicalIndicatorService.getTechnicalIndicators.mockResolvedValue({
      currentSma200: 178.65,
      currentSma150: 183.36,
      currentSma50: 185.4,
      currentEma20: 2,
      currentEma10: 194.96,
      currentPrice: 193.6,
      highRatio: 3.02,
      lowRatio: 55.92,
    });

    const strongTechnicalSetup =
      await checkTechnicalSetupService.hasStrongTechnicalSetup('AAPL');

    expect(strongTechnicalSetup).toBe(false);
  });
});
