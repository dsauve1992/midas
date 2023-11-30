import { CheckForBreakoutUseCase } from '../check-for-breakout.use-case';
import { Test } from '@nestjs/testing';
import { BreakoutService } from '../../domain/breakout.service';
import { WatchlistRepository } from '../../../watchlist/domain/repository/watchlist.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Watchlist } from '../../../watchlist/domain/model/Watchlist';
import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';
import { StockMarketInformation } from '../../../../shared-types/financial-modeling-prep';

describe('CheckForBreakoutUseCase specs', () => {
  let useCase: CheckForBreakoutUseCase;
  let repository: DeepMocked<WatchlistRepository>;
  let breakoutService: DeepMocked<BreakoutService>;
  let fmpService: DeepMocked<FinancialModelingPrepService>;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        CheckForBreakoutUseCase,
        {
          provide: BreakoutService,
          useValue: createMock<BreakoutService>(),
        },
        {
          provide: WatchlistRepository,
          useValue: createMock<WatchlistRepository>(),
        },
        {
          provide: FinancialModelingPrepService,
          useValue: createMock<FinancialModelingPrepService>(),
        },
      ],
    }).compile();

    useCase = app.get(CheckForBreakoutUseCase);
    repository = app.get(WatchlistRepository);
    breakoutService = app.get(BreakoutService);
    fmpService = app.get(FinancialModelingPrepService);
  });

  test('given market close, it should do nothing', async () => {
    fmpService.getMarketOpeningInformation.mockResolvedValue({
      isTheStockMarketOpen: false,
    } as StockMarketInformation);

    await useCase.execute();

    expect(breakoutService.checkFor).not.toHaveBeenCalled();
  });

  test('given market open, it should check breakout for each symbol in watchlist ', async () => {
    const watchlist = new Watchlist('1', new Set(['AAPL', 'TSLA', 'MSFT']));

    repository.getByUserId.mockResolvedValue(watchlist);

    fmpService.getMarketOpeningInformation.mockResolvedValue({
      isTheStockMarketOpen: true,
    } as StockMarketInformation);

    await useCase.execute();

    expect(breakoutService.checkFor.mock.calls).toEqual([
      ['AAPL'],
      ['TSLA'],
      ['MSFT'],
    ]);
  });
});
