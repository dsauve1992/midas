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

  test('given no watchlist for userId, when get it, it should get empty watchlist', async () => {
    const newWatchlist = await repository.getByUserId('unknownUserId');
    expect(newWatchlist.isEmpty()).toEqual(0);
  });

  test('given a watchlist, when save it, it should persisted into repository', async () => {
    const expectedWatchlist = new Watchlist('aUserId', new Set(['AAPL']));

    await repository.save(expectedWatchlist);

    expect(await repository.getByUserId('aUserId')).toEqual(expectedWatchlist);
  });

  test('given an existing watchlist, when change it then save, chnages persisted into repository', async () => {
    const aWatchlist = new Watchlist('aUserId', new Set(['AAPL']));
    await repository.save(aWatchlist);

    aWatchlist.addSymbol('TSLA');
    await repository.save(aWatchlist);

    const actual = await repository.getByUserId('aUserId');
    const expected = new Watchlist('aUserId', new Set(['AAPL', 'TSLA']));
    expect(actual).toEqual(expected);
  });
});
