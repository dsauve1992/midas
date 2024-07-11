import { Test, TestingModule } from '@nestjs/testing';
import { Watchlist } from '../../../../domain/model/Watchlist';
import { ConfigModule } from '@nestjs/config';
import { WatchlistPostgresDbRepository } from '../watchlist-postgres-db.repository';
import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'pg';
import Knex from 'knex';
import { AutoCommitUnitOfWork } from '../../../../../../lib/auto-commit-unit-of-work.service';

describe('WatchlistPostgresDbRepository specs', () => {
  let repository: WatchlistPostgresDbRepository;
  let unitOfWork: AutoCommitUnitOfWork;
  let pool: Pool;
  let knex: Knex.Knex;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        {
          provide: 'UNIT_OF_WORK',
          useClass: AutoCommitUnitOfWork,
        },
        WatchlistPostgresDbRepository,
        {
          provide: 'PG_CONNECTION_POOL',
          useValue: new Pool({
            host: global.__dbConfig__.host,
            port: global.__dbConfig__.port,
            user: global.__dbConfig__.user,
            password: global.__dbConfig__.password,
            database: global.__dbConfig__.database,
          }),
        },
      ],
    }).compile();

    repository = app.get(WatchlistPostgresDbRepository);
    unitOfWork = app.get('UNIT_OF_WORK');
    pool = app.get('PG_CONNECTION_POOL');

    knex = Knex({
      client: 'pg',
      connection: {
        host: global.__dbConfig__.host,
        port: global.__dbConfig__.port,
        user: global.__dbConfig__.user,
        password: global.__dbConfig__.password,
        database: global.__dbConfig__.database,
      },
    });

    await knex.migrate.latest();
    await unitOfWork.connect();
  });

  beforeEach(async () => {
    const client = await pool.connect();
    await client.query('DELETE FROM watchlist_items;');
    await client.query('DELETE FROM watchlists;');
    client.release();
  });

  afterAll(async () => {
    await unitOfWork.release();
    await pool.end();
    await knex.destroy();
  });

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
