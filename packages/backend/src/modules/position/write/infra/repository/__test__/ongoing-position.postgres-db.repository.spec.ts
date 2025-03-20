import { OngoingPositionRepository } from '../../../domain/repository/ongoing-position.repository';
import { IntegrationTestService } from '../../../../../../lib/test/db-integration/integration-test.service';
import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationTestModule } from '../../../../../../lib/test/db-integration/integration-test.module';
import { OngoingPositionPostgresDbRepository } from '../ongoing-position.postgres-db.repository';
import { givenOngoingPosition } from '../../../domain/model/__tests__/__fixtures__/ongoing-position.fixture';
import { PositionId } from '../../../domain/model/position-id';
import { PositionWishRepository } from '../../../domain/repository/position-wish.repository';
import { PositionWishPostgresDbRepository } from '../position-wish.postgres-db.repository';
import { givenPositionWish } from '../../../domain/model/__tests__/__fixtures__/position-wish.fixture';

describe('OngoingPositionPostgresDbRepository specs', () => {
  let repository: OngoingPositionRepository;
  let positionWishRepository: PositionWishRepository;

  let integrationTestService: IntegrationTestService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [IntegrationTestModule],
      providers: [
        OngoingPositionPostgresDbRepository,
        PositionWishPostgresDbRepository,
      ],
    }).compile();

    repository = app.get(OngoingPositionPostgresDbRepository);
    positionWishRepository = app.get(PositionWishPostgresDbRepository);
    integrationTestService = app.get(IntegrationTestService);
    await integrationTestService.start();
  });

  beforeEach(async () => {
    const client = await integrationTestService.pool.connect();
    await client.query('DELETE FROM position;');
    await client.query('DELETE FROM position_wishes;');
    client.release();
  });

  afterAll(async () => integrationTestService.stop());

  test('given a new ongoing position not related to a position wish, when save it, it should persisted into repository', async () => {
    const ongoingPosition = givenOngoingPosition({ positionWishId: null });

    await repository.save(ongoingPosition);

    const persistedOngoingPosition = await repository.getById(
      ongoingPosition.id,
    );

    expect(persistedOngoingPosition).toEqual(ongoingPosition);
  });

  test('given a new ongoing position related to a position wish not persisted, when save it, it throw an error', async () => {
    const positionWishId = PositionId.new();
    const ongoingPosition = givenOngoingPosition({ positionWishId });

    await expect(() => repository.save(ongoingPosition)).rejects.toThrow();
  });

  test('given a new ongoing position related to a position wish persisted, when save it, it should be persisted', async () => {
    const aPositionWish = givenPositionWish();
    await positionWishRepository.save(aPositionWish);

    const ongoingPosition = givenOngoingPosition({
      positionWishId: aPositionWish.id,
    });

    await repository.save(ongoingPosition);

    const persistedOngoingPosition = await repository.getById(
      ongoingPosition.id,
    );

    expect(persistedOngoingPosition).toEqual(ongoingPosition);
  });
});
