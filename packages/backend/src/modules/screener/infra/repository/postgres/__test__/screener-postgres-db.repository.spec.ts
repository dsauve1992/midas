import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Pool } from 'pg';
import Knex from 'knex';
import { AutoCommitUnitOfWork } from '../../../../../../lib/auto-commit-unit-of-work.service';
import { ScreenerPostgresDbRepository } from '../screener-postgres-db.repository';
import { ScreenerEntryEntity } from '../../../../domain/screener-entry.entity';

describe('ScreenerPostgresDbRepository specs', () => {
  let repository: ScreenerPostgresDbRepository;
  let unitOfWork: AutoCommitUnitOfWork;
  let pool: Pool;
  let postgresContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();

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

    repository = app.get(ScreenerPostgresDbRepository);
    unitOfWork = app.get('UNIT_OF_WORK');
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
    await client.query('DELETE FROM screener;');
    client.release();
  });

  afterAll(() => {
    postgresContainer.stop();
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
