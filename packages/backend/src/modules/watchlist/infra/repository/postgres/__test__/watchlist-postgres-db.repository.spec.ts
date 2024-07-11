import { Test, TestingModule } from '@nestjs/testing';
import { Watchlist } from '../../../../domain/model/Watchlist';
import { WatchlistPostgresDbRepository } from '../watchlist-postgres-db.repository';
import { v4 as uuidv4 } from 'uuid';
import { IntegrationTestModule } from '../../../../../../lib/test/integration-test.module';
import { IntegrationTestService } from '../../../../../../lib/test/intergation-test.service';

describe('WatchlistPostgresDbRepository specs', () => {
  let repository: WatchlistPostgresDbRepository;
  let integrationTestService: IntegrationTestService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [IntegrationTestModule],
      providers: [WatchlistPostgresDbRepository],
    }).compile();

    repository = app.get(WatchlistPostgresDbRepository);
    integrationTestService = app.get(IntegrationTestService);
    await integrationTestService.start();
  });

  beforeEach(async () => {
    const client = await integrationTestService.pool.connect();
    await client.query('DELETE FROM watchlist_items;');
    await client.query('DELETE FROM watchlists;');
    client.release();
  });

  afterAll(async () => integrationTestService.stop());

  test('given no watchlist for userId, when get it, it should get empty watchlist', async () => {
    const newWatchlist = await repository.getByUserId('unknownUserId');
    expect(newWatchlist.isEmpty()).toBe(true);
  });

  test('given a watchlist, when save it, it should persisted into repository', async () => {
    const expectedWatchlist = new Watchlist(
      uuidv4(),
      'aUserId',
      new Set(['CLFD']),
    );

    await repository.save(expectedWatchlist);
    const actual = await repository.getByUserId('aUserId');

    expect(actual).toEqual(expectedWatchlist);
  });

  test('given an existing watchlist, when change it then save, changes should be persisted into repository', async () => {
    const id = uuidv4();
    const aWatchlist = new Watchlist(id, 'aUserId', new Set([]));
    await repository.save(aWatchlist);

    aWatchlist.addSymbol('AAPL');
    aWatchlist.addSymbol('TSLA');
    await repository.save(aWatchlist);

    const actual = await repository.getByUserId('aUserId');
    const expected = new Watchlist(
      aWatchlist.id,
      'aUserId',
      new Set(['AAPL', 'TSLA']),
    );
    expect(actual).toEqual(expected);
  });
});
