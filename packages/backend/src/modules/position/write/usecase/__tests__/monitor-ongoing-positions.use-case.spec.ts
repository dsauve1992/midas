import { Test, TestingModule } from '@nestjs/testing';
import { UseCaseTestModule } from '../../../../../lib/test/use-case/use-case-test.module';
import { MonitorOngoingPositionsUseCase } from '../monitor-ongoing-positions.use-case';
import { createMock } from '@golevelup/ts-jest';
import { OngoingPositionRepository } from '../../domain/repository/ongoing-position.repository';
import { when } from 'jest-when';
import { givenOngoingPosition } from '../../domain/model/__tests__/__fixtures__/ongoing-position.fixture';
import { StrategyName } from '../../domain/model/strategy/strategy-name';
import { RiskRewardRatioStrategy } from '../../domain/model/strategy/risk-reward-ratio-strategy';
import { HoldStrategy } from '../../domain/model/strategy/hold-strategy';

jest.mock('../../../../../lib/domain/IdGenerator');

describe('MonitorPendingPositionWishesUseCase specs', () => {
  let useCase: MonitorOngoingPositionsUseCase;
  let ongoingPositionRepository: OngoingPositionRepository;
  let holdStrategy: HoldStrategy;
  let riskRewardRatioStrategy: RiskRewardRatioStrategy;

  beforeEach(() => jest.clearAllMocks());

  afterAll(() => jest.useRealTimers());

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [UseCaseTestModule],
      providers: [
        MonitorOngoingPositionsUseCase,
        {
          provide: HoldStrategy,
          useValue: createMock<HoldStrategy>(),
        },
        {
          provide: RiskRewardRatioStrategy,
          useValue: createMock<RiskRewardRatioStrategy>(),
        },
        {
          provide: 'OngoingPositionRepository',
          useValue: createMock<OngoingPositionRepository>(),
        },
      ],
    }).compile();

    useCase = app.get(MonitorOngoingPositionsUseCase);
    holdStrategy = app.get(HoldStrategy);
    riskRewardRatioStrategy = app.get(RiskRewardRatioStrategy);
    ongoingPositionRepository = app.get('OngoingPositionRepository');
  });

  it('should execute well', async () => {
    expect(useCase).toBeDefined();
    await useCase.execute();
  });

  test('given ongoing positions, when monitor them, it should follow related strategy', async () => {
    const positionWithBuyAndHoldStrategy = givenOngoingPosition({
      strategyName: StrategyName.HOLD,
    });
    const positionWithRiskRewardRatioStrategy = givenOngoingPosition({
      strategyName: StrategyName.RISK_REWARD_RATIO,
    });

    when(ongoingPositionRepository.getAll).mockResolvedValue([
      positionWithBuyAndHoldStrategy,
      positionWithRiskRewardRatioStrategy,
    ]);

    await useCase.execute();

    expect(holdStrategy.apply).toHaveBeenNthCalledWith(
      1,
      positionWithBuyAndHoldStrategy,
    );
    expect(riskRewardRatioStrategy.apply).toHaveBeenNthCalledWith(
      1,
      positionWithRiskRewardRatioStrategy,
    );
  });
});
