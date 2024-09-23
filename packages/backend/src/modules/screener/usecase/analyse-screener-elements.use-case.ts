import { Inject, Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../lib/base-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';
import { LabeledScreenerSymbolRepository } from '../domain/repository/labeled-screener-symbol.repository';
import { StockTechnicalLabeler } from '../domain/service/stock-technical-labeler';
import { ScreenerRepository } from '../domain/repository/screener.repository';

@Injectable()
export class AnalyseScreenerElementsUseCase extends BaseUseCase<void, void> {
  constructor(
    @Inject('ScreenerRepository')
    private screenerRepository: ScreenerRepository,
    @Inject('LabeledScreenerSymbolRepository')
    private labeledScreenerSymbolRepository: LabeledScreenerSymbolRepository,
    private stockTechnicalLabeler: StockTechnicalLabeler,
    unitOfWork: TransactionalUnitOfWork,
  ) {
    super(unitOfWork);
  }

  async executeUseCase(): Promise<void> {
    const snapshot = await this.screenerRepository.search();

    for (const symbol of snapshot) {
      const labeledSymbol =
        await this.labeledScreenerSymbolRepository.getBySymbol(symbol);

      const labels = await this.stockTechnicalLabeler.for(symbol);

      labeledSymbol.updateLabels(labels);

      await this.labeledScreenerSymbolRepository.save(labeledSymbol);
    }
  }
}
