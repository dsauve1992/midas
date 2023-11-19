import { CheckForBreakoutUseCase } from '../check-for-breakout.use-case';
import { Test } from '@nestjs/testing';
import { BreakoutService } from '../../domain/breakout.service';
import { WatchlistRepository } from '../../../watchlist/domain/repository/watchlist.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Watchlist } from '../../../watchlist/domain/model/Watchlist';

describe('CheckForBreakoutUseCase specs', () => {
  let useCase: CheckForBreakoutUseCase;
  let repository: DeepMocked<WatchlistRepository>;
  let breakoutService: DeepMocked<BreakoutService>;

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
      ],
    }).compile();

    useCase = app.get(CheckForBreakoutUseCase);
    repository = app.get(WatchlistRepository);
    breakoutService = app.get(BreakoutService);
  });

  test('given watchlist, it should check breakout for each symbol in watchlist ', async () => {
    const watchlist = new Watchlist(['AAPL', 'TSLA', 'MSFT']);

    repository.get.mockResolvedValue(watchlist);

    await useCase.execute();

    expect(breakoutService.checkFor.mock.calls).toEqual([
      ['AAPL'],
      ['TSLA'],
      ['MSFT'],
    ]);
  });
});
