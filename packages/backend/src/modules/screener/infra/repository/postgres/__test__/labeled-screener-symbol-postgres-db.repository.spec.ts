import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationTestModule } from '../../../../../../lib/test/db-integration/integration-test.module';
import { IntegrationTestService } from '../../../../../../lib/test/db-integration/integration-test.service';
import { SymbolWithExchange } from '../../../../../stocks/domain/symbol-with-exchange';
import { LabeledScreenerSymbolPostgresDbRepository } from '../labeled-screener-symbol-postgres-db.repository';
import { LabeledScreenerSymbol } from '../../../../domain/model/labeled-screener.symbol';

const AAPL = SymbolWithExchange.from('NASDAQ:AAPL');
const CLFD = SymbolWithExchange.from('NASDAQ:CLFD');

describe('WatchlistPostgresDbRepository specs', () => {
  let repository: LabeledScreenerSymbolPostgresDbRepository;
  let integrationTestService: IntegrationTestService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [IntegrationTestModule],
      providers: [LabeledScreenerSymbolPostgresDbRepository],
    }).compile();

    repository = app.get(LabeledScreenerSymbolPostgresDbRepository);
    integrationTestService = app.get(IntegrationTestService);
    await integrationTestService.start();
  });

  beforeEach(async () => {
    const client = await integrationTestService.pool.connect();
    await client.query('DELETE FROM symbol_label;');
    client.release();
  });

  afterAll(async () => integrationTestService.stop());

  test('given a LabeledScreenerSymbol, when save it, it should persisted into repository', async () => {
    const expectedAppleLabeledScreenerSymbol = new LabeledScreenerSymbol(AAPL, [
      { title: 'title', description: 'description' },
      { title: 'title2', description: 'description2' },
    ]);

    const expectedClearfieldLabeledScreenerSymbol = new LabeledScreenerSymbol(
      CLFD,
      [
        { title: 'title', description: 'description' },
        { title: 'title2', description: 'description2' },
      ],
    );

    await repository.save(expectedAppleLabeledScreenerSymbol);
    await repository.save(expectedClearfieldLabeledScreenerSymbol);

    const actualApple = await repository.getBySymbol(AAPL);
    const actualClearfield = await repository.getBySymbol(CLFD);

    expect(actualApple).toEqual(expectedAppleLabeledScreenerSymbol);
    expect(actualClearfield).toEqual(expectedClearfieldLabeledScreenerSymbol);
  });
});
