import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistDynamoDbRepository } from '../watchlist-dynamo-db.repository';
import { Watchlist } from '../../../domain/model/Watchlist';
import { ConfigModule } from '@nestjs/config';
import { setupTables } from '../../../../../../test/config/database/dynamoDb-table-initializer';
import { watchlistTableParams } from '../watchlist-table.param';

describe('WatchlistDynamoDbRepository specs', () => {
  let repository: WatchlistDynamoDbRepository;

  beforeAll(async () => {
    await setupTables([watchlistTableParams]);
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [WatchlistDynamoDbRepository],
    }).compile();

    repository = app.get(WatchlistDynamoDbRepository);
  });

  test('given a watchlist, when save it, it should persisted into repository', async () => {
    const expectedWatchlist = new Watchlist('aUserId', ['AAPL']);

    await repository.save(expectedWatchlist);

    expect(await repository.getByUserId('aUserId')).toEqual(expectedWatchlist);
  });

  test('given an existing watchlist, when change it then save, chnages persisted into repository', async () => {
    const aWatchlist = new Watchlist('aUserId', ['AAPL']);
    await repository.save(aWatchlist);

    aWatchlist.addSymbol('TSLA');
    await repository.save(aWatchlist);

    const actual = await repository.getByUserId('aUserId');
    const expected = new Watchlist('aUserId', ['AAPL', 'TSLA']);
    expect(actual).toEqual(expected);
  });
});
