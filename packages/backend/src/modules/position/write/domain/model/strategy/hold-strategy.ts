import { Injectable } from '@nestjs/common';
import { OngoingPosition } from '../ongoing-position';

@Injectable()
export class HoldStrategy {
  async apply(onGoingPosition: OngoingPosition): Promise<void> {}
}
