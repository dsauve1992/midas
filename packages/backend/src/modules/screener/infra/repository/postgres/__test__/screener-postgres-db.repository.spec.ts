import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { Pool } from 'pg';
import Knex from 'knex';
import { AutoCommitUnitOfWork } from '../../../../../../lib/auto-commit-unit-of-work.service';
import { ScreenerPostgresDbRepository } from '../screener-postgres-db.repository';
import { ScreenerEntryEntity } from '../../../../domain/screener-entry.entity';

describe('ScreenerPostgresDbRepository specs', () => {
  let repository: ScreenerPostgresDbRepository;
  let unitOfWork: AutoCommitUnitOfWork;
  let pool: Pool;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        {
          provide: 'UNIT_OF_WORK',
          useClass: AutoCommitUnitOfWork,
        },
        ScreenerPostgresDbRepository,
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

    repository = app.get(ScreenerPostgresDbRepository);
    unitOfWork = app.get('UNIT_OF_WORK');
    pool = app.get('PG_CONNECTION_POOL');

    const knex = Knex({
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
  });

  beforeEach(async () => {
    const client = await pool.connect();
    await client.query('DELETE FROM screener;');
    client.release();
  });

  afterAll(async () => {
    await pool.end();
  });

  test('given empty screener, when get all, it should return empty list', async () => {
    await unitOfWork.execute(async () => {
      const screenerEntities = await repository.getAll();
      expect(screenerEntities).toHaveLength(0);
    });
  });

  test('given a screener entity, when save it, it should persisted into repository', async () => {
    await unitOfWork.execute(async () => {
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
});
