import { Test, TestingModule } from '@nestjs/testing';
import { Watchlist } from '../../../../domain/model/Watchlist';
import { ConfigModule } from '@nestjs/config';
import { WatchlistPostgresDbRepository } from '../watchlist-postgres-db.repository';
import { v4 as uuidv4 } from 'uuid';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Pool } from 'pg';
import Knex from 'knex';

describe('WatchlistPostgresDbRepository specs', () => {
  let repository: WatchlistPostgresDbRepository;
  let pool: Pool;
  let postgresContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();

    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        WatchlistPostgresDbRepository,
        {
          provide: 'PG_CONNECTION_POOL',
          useValue: new Pool({
            host: postgresContainer.getHost(),
            port: postgresContainer.getPort(),
            user: postgresContainer.getUsername(),
            password: postgresContainer.getPassword(),
            database: postgresContainer.getDatabase(),
            max: 1,
          }),
        },
      ],
    }).compile();

    repository = app.get(WatchlistPostgresDbRepository);
    pool = app.get('PG_CONNECTION_POOL');

    const knex = Knex({
      client: 'pg',
      connection: {
        host: postgresContainer.getHost(),
        port: postgresContainer.getPort(),
        user: postgresContainer.getUsername(),
        password: postgresContainer.getPassword(),
        database: postgresContainer.getDatabase(),
      },
    });

    await knex.migrate.latest();
  });

  afterEach(async () => {
    const client = await pool.connect();
    await client.query('DELETE FROM watchlist_items;');
    await client.query('DELETE FROM watchlists;');
    client.release();
  });

  afterAll(() => {
    postgresContainer.stop();
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
