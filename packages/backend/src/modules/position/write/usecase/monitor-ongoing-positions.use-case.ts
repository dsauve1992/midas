import { Inject, Injectable } from '@nestjs/common';
import { OngoingPositionRepository } from '../domain/repository/ongoing-position.repository';
import { HoldStrategy } from '../domain/model/strategy/hold-strategy';
import { RiskRewardRatioStrategy } from '../domain/model/strategy/risk-reward-ratio-strategy';
import { StrategyName } from '../domain/model/strategy/strategy-name';

@Injectable()
export class MonitorOngoingPositionsUseCase {
  constructor(
    @Inject('OngoingPositionRepository')
    private readonly ongoingPositionRepository: OngoingPositionRepository,
    private readonly holdStrategy: HoldStrategy,
    private readonly riskRewardRatioStrategy: RiskRewardRatioStrategy,
  ) {}

  async execute() {
    const ongoingPositions = await this.ongoingPositionRepository.getAll();

    await Promise.all(
      ongoingPositions.map(async (ongoingPosition) => {
        switch (ongoingPosition.strategyName) {
          case StrategyName.HOLD:
            await this.holdStrategy.apply(ongoingPosition);
            break;
          case StrategyName.RISK_REWARD_RATIO:
            await this.riskRewardRatioStrategy.apply(ongoingPosition);
            break;
        }
      }),
    );
  }
}
