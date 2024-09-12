import { Inject, Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../lib/base-use-case';
import { TradingViewScreenerService } from '../infra/trading-view/trading-view-screener.service';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';
import { StockAnalyser } from '../domain/stock-analyser';

@Injectable()
export class AnalyseScreenerElementsUseCase extends BaseUseCase<void, void> {
  constructor(
    private tradingViewScreenerService: TradingViewScreenerService,
    private stockAnalyser: StockAnalyser,
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
  ) {
    super(unitOfWork);
  }

  async executeUseCase(): Promise<void> {
    const results = await this.tradingViewScreenerService.search();

    for (const result of results) {
      this.stockAnalyser.analyseSymbol(result);
    }
  }
}
