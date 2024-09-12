import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AnalyseScreenerElementsUseCase } from '../analyse-screener-elements.use-case';
import { TradingViewScreenerService } from '../../infra/trading-view/trading-view-screener.service';
import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';
import { UseCaseTestModule } from '../../../../lib/test/use-case/use-case-test.module';
import { StockAnalyser } from '../../domain/stock-analyser';

describe('AnalyseScreenerElementsUseCase specs', () => {
  let useCase: AnalyseScreenerElementsUseCase;
  let tradingViewScreenerService: DeepMocked<TradingViewScreenerService>;
  let stockAnalyser: DeepMocked<StockAnalyser>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyseScreenerElementsUseCase,
        {
          provide: StockAnalyser,
          useValue: createMock<StockAnalyser>(),
        },
        {
          provide: TradingViewScreenerService,
          useValue: createMock<TradingViewScreenerService>(),
        },
      ],
      imports: [UseCaseTestModule],
    }).compile();

    useCase = app.get(AnalyseScreenerElementsUseCase);
    tradingViewScreenerService = app.get(TradingViewScreenerService);
    stockAnalyser = app.get(StockAnalyser);
  });

  test('for each symbol in the screener, it should analyse it', async () => {
    const aapl = SymbolWithExchange.from('NASDAQ:AAPL');
    const msft = SymbolWithExchange.from('NASDAQ:MSFT');
    const googl = SymbolWithExchange.from('NASDAQ:GOOGL');

    const screenerElements = [aapl, msft, googl];

    tradingViewScreenerService.search.mockResolvedValue(screenerElements);

    await useCase.execute();

    expect(stockAnalyser.analyseSymbol).toHaveBeenCalledTimes(3);
    expect(stockAnalyser.analyseSymbol).toHaveBeenCalledWith(aapl);
    expect(stockAnalyser.analyseSymbol).toHaveBeenCalledWith(msft);
    expect(stockAnalyser.analyseSymbol).toHaveBeenCalledWith(googl);
  });
});
