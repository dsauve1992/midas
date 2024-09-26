import { BaseUseCase } from '../../../lib/base-use-case';
import { Inject } from '@nestjs/common';
import { ScreenerRepository } from '../domain/repository/screener.repository';
import { LabeledScreenerSymbolReadRepository } from '../domain/repository/labeled-screener-symbol.read-repository';
import { UnitOfWork } from '../../../lib/unit-of-work/unit-of-work';
import { NewScreenerEntryFrontendDto } from '../../../shared-types/new-screener-entry-frontend.dto';

export class GetScreenerUseCase extends BaseUseCase<
  void,
  NewScreenerEntryFrontendDto[]
> {
  constructor(
    @Inject('ScreenerRepository')
    private screenerRepository: ScreenerRepository,
    @Inject('LabeledScreenerSymbolReadRepository')
    private labeledScreenerSymbolReadRepository: LabeledScreenerSymbolReadRepository,
    @Inject('UNIT_OF_WORK') unitOfWork: UnitOfWork,
  ) {
    super(unitOfWork);
  }

  async executeUseCase() {
    const snapshot = await this.screenerRepository.search();
    const labeledSymbols =
      await this.labeledScreenerSymbolReadRepository.getAll();

    return snapshot.symbols.map((symbol) => {
      const labeledSymbol = labeledSymbols.find((labeledSymbol) =>
        labeledSymbol.symbol.equals(symbol),
      );

      return {
        symbol: symbol.symbol,
        exchange: symbol.exchange,
        labels: labeledSymbol?.labels ?? [],
      };
    });
  }
}
