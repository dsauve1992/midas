import { Injectable } from '@nestjs/common';
import { OngoingPosition } from '../ongoing-position';

@Injectable()
export class RiskRewardRatioStrategy {
  async apply(onGoingPosition: OngoingPosition): Promise<void> {}
}
