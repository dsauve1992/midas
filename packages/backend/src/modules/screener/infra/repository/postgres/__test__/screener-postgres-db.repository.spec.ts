import { Test, TestingModule } from '@nestjs/testing';
import { ScreenerPostgresDbRepository } from '../screener-postgres-db.repository';
import { ScreenerEntryEntity } from '../../../../domain/screener-entry.entity';
import { IntegrationTestModule } from '../../../../../../lib/test/integration-test.module';
import { IntegrationTestService } from '../../../../../../lib/test/intergation-test.service';

describe('ScreenerPostgresDbRepository specs', () => {
  let repository: ScreenerPostgresDbRepository;
  let integrationTestService: IntegrationTestService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [IntegrationTestModule],
      providers: [ScreenerPostgresDbRepository],
    }).compile();

    repository = app.get(ScreenerPostgresDbRepository);
    integrationTestService = app.get(IntegrationTestService);
    await integrationTestService.start();
  });

  beforeEach(async () => {
    const client = await integrationTestService.pool.connect();
    await client.query('DELETE FROM screener;');
    client.release();
  });

  afterAll(async () => integrationTestService.stop());

  test('given empty screener, when get all, it should return empty list', async () => {
    const screenerEntities = await repository.getAll();
    expect(screenerEntities).toHaveLength(0);
  });

  test('given a screener entity, when save it, it should persisted into repository', async () => {
    const newEntity = new ScreenerEntryEntity(
      'AAPL',
      'NASDAQ',
      'Technology',
      'Software',
      56,
      67,
      54,
      56,
      54,
      4,
      [],
      [],
      34,
    );

    await repository.save(newEntity);
    const entities = await repository.getAll();

    expect(entities).toEqual([newEntity]);
  });
});
