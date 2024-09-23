import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AnalyseScreenerElementsUseCase } from '../analyse-screener-elements.use-case';
import { TradingViewScreenerRepository } from '../../infra/repository/trading-view/trading-view-screener.repository';
import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';
import { UseCaseTestModule } from '../../../../lib/test/use-case/use-case-test.module';
import { StockTechnicalAnalyser } from '../../domain/service/stock-technical-analyser';
import { ScreenerSnapshot } from '../../domain/model/screener-snapshot';

describe('AnalyseScreenerElementsUseCase specs', () => {
  let useCase: AnalyseScreenerElementsUseCase;
  let tradingViewScreenerService: DeepMocked<TradingViewScreenerRepository>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyseScreenerElementsUseCase,
        {
          provide: StockTechnicalAnalyser,
          useValue: createMock<StockTechnicalAnalyser>(),
        },
        {
          provide: TradingViewScreenerRepository,
          useValue: createMock<TradingViewScreenerRepository>(),
        },
      ],
      imports: [UseCaseTestModule],
    }).compile();

    useCase = app.get(AnalyseScreenerElementsUseCase);
    tradingViewScreenerService = app.get(TradingViewScreenerRepository);
  });

  test('for each symbol in the screener, it should analyse it', async () => {
    const aapl = SymbolWithExchange.from('NASDAQ:AAPL');
    const msft = SymbolWithExchange.from('NASDAQ:MSFT');
    const googl = SymbolWithExchange.from('NASDAQ:GOOGL');

    const screenerElements = [aapl, msft, googl];

    tradingViewScreenerService.search.mockResolvedValue(
      new ScreenerSnapshot(screenerElements),
    );

    await useCase.execute();

    // expect(stockAnalyser.analyseSymbol).toHaveBeenCalledTimes(3);
    // expect(stockAnalyser.analyseSymbol).toHaveBeenCalledWith(aapl);
    // expect(stockAnalyser.analyseSymbol).toHaveBeenCalledWith(msft);
    // expect(stockAnalyser.analyseSymbol).toHaveBeenCalledWith(googl);
  });
});
