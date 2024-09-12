import { Test, TestingModule } from '@nestjs/testing';
import { Watchlist } from '../../../../domain/model/watchlist';
import { WatchlistPostgresDbRepository } from '../watchlist-postgres-db.repository';
import { v4 as uuidv4 } from 'uuid';
import { IntegrationTestModule } from '../../../../../../lib/test/db-integration/integration-test.module';
import { IntegrationTestService } from '../../../../../../lib/test/db-integration/integration-test.service';
import { SymbolWithExchange } from '../../../../../stocks/domain/symbol-with-exchange';
import { NonEmptyString } from '../../../../../../lib/domain/NonEmptyString';

const AAPL = SymbolWithExchange.from('NASDAQ:AAPL');
const MSFT = SymbolWithExchange.from('NASDAQ:MSFT');
const CLFD = SymbolWithExchange.from('NASDAQ:CLFD');
const TSLA = SymbolWithExchange.from('NASDAQ:TSLA');

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

  test('given a watchlist, when save it, it should persisted into repository', async () => {
    const expectedWatchlist = new Watchlist(
      uuidv4(),
      NonEmptyString.from('My Watchlist'),
      'aUserId',
      0,
      [CLFD],
    );

    await repository.save(expectedWatchlist);
    const actual = await repository.getById('aUserId', expectedWatchlist.id);

    expect(actual).toEqual(expectedWatchlist);
  });

  test('given an existing watchlist, when change it then save, changes should be persisted into repository', async () => {
    const id = uuidv4();
    const aWatchlist = new Watchlist(
      id,
      NonEmptyString.from('My Watchlist'),
      'aUserId',
      0,
      [],
    );
    await repository.save(aWatchlist);

    aWatchlist.addSymbol(AAPL);
    aWatchlist.addSymbol(TSLA);
    await repository.save(aWatchlist);

    const actual = await repository.getById('aUserId', aWatchlist.id);
    const expected = new Watchlist(
      aWatchlist.id,
      NonEmptyString.from('My Watchlist'),
      'aUserId',
      0,
      [AAPL, TSLA],
    );
    expect(actual).toEqual(expected);
  });

  test('given an existing watchlist, when flag it as deleted then save, it should be able to get it anymore', async () => {
    const id = uuidv4();
    const aWatchlist = new Watchlist(
      id,
      NonEmptyString.from('My Watchlist'),
      'aUserId',
      0,
      [],
    );
    await repository.save(aWatchlist);

    expect(await repository.getById('aUserId', aWatchlist.id)).toEqual(
      aWatchlist,
    );

    aWatchlist.flagAsDeleted();
    await repository.save(aWatchlist);

    await expect(() =>
      repository.getById('aUserId', aWatchlist.id),
    ).rejects.toThrow(
      `Cannot get watchlist with id: ${aWatchlist.id} for user: aUserId`,
    );
  });

  test('given multiple watchlist for a user, when get all by user id, it should return all watchlists', async () => {
    const aWatchlist = new Watchlist(
      uuidv4(),
      NonEmptyString.from('My Watchlist'),
      'aUserId',
      0,
      [AAPL, MSFT],
    );
    const anotherWatchlist = new Watchlist(
      uuidv4(),
      NonEmptyString.from('Another Watchlist'),
      'aUserId',
      1,
      [AAPL, MSFT],
    );

    await repository.save(aWatchlist);
    await repository.save(anotherWatchlist);

    const actual = await repository.getAllByUserId('aUserId');

    expect(actual).toContainEqual(aWatchlist);
    expect(actual).toContainEqual(anotherWatchlist);
  });
});
