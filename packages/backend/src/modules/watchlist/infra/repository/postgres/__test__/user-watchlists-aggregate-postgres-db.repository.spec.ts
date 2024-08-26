import { Test, TestingModule } from '@nestjs/testing';
import { Watchlist } from '../../../../domain/model/watchlist';
import { v4 as uuidv4 } from 'uuid';
import { IntegrationTestModule } from '../../../../../../lib/test/integration-test.module';
import { IntegrationTestService } from '../../../../../../lib/test/intergation-test.service';
import { UserWatchlistsAggregatePostgresDbRepository } from '../user-watchlists-aggregate-postgres-db.repository';
import { UserWatchlistsAggregate } from '../../../../domain/model/user-watchlists-aggregate';
import { SymbolWithExchange } from '../../../../../stocks/domain/symbol-with-exchange';

const USER_ID = 'aUserId';

const AAPL = SymbolWithExchange.from('NASDAQ:AAPL');
const MSFT = SymbolWithExchange.from('NASDAQ:MSFT');
const CLFD = SymbolWithExchange.from('NASDAQ:CLFD');
const TSLA = SymbolWithExchange.from('NASDAQ:TSLA');

describe('UserWatchlistsAggregatePostgresDbRepository specs', () => {
  let repository: UserWatchlistsAggregatePostgresDbRepository;
  let integrationTestService: IntegrationTestService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [IntegrationTestModule],
      providers: [UserWatchlistsAggregatePostgresDbRepository],
    }).compile();

    repository = app.get(UserWatchlistsAggregatePostgresDbRepository);
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

  test('given an aggregate, when save it, it should persisted into repository', async () => {
    const expectedUserWatchlists = new UserWatchlistsAggregate(
      USER_ID,
      new Set([
        new Watchlist(uuidv4(), 'My Watchlist', USER_ID, 0, [AAPL, MSFT]),
        new Watchlist(uuidv4(), 'Another Watchlist', USER_ID, 1, [TSLA, CLFD]),
      ]),
    );

    await repository.save(expectedUserWatchlists);
    const actual = await repository.getById(USER_ID);

    expect(actual).toEqual(expectedUserWatchlists);
  });

  test('given an aggregate, when create a watchlist, new watchlist it should persisted into repository', async () => {
    const expectedUserWatchlists = new UserWatchlistsAggregate(USER_ID);

    expectedUserWatchlists.createWatchlist('first watchlist');
    expectedUserWatchlists.createWatchlist('second watchlist');

    await repository.save(expectedUserWatchlists);
    const actual = await repository.getById(USER_ID);

    expect(actual).toEqual(expectedUserWatchlists);
    expect(actual.watchlists.size).toEqual(2);
  });

  test('given an aggregate, when delete a watchlist, delete watchlist it should not persisted repository anymore', async () => {
    const userWatchlistsAggregate = new UserWatchlistsAggregate(USER_ID);

    const createdWatchlist =
      userWatchlistsAggregate.createWatchlist('first watchlist');
    await repository.save(userWatchlistsAggregate);

    expect((await repository.getById(USER_ID)).watchlists.size).toEqual(1);

    userWatchlistsAggregate.deleteWatchlist(createdWatchlist.id);
    await repository.save(userWatchlistsAggregate);

    expect((await repository.getById(USER_ID)).watchlists.size).toEqual(0);
  });
});
