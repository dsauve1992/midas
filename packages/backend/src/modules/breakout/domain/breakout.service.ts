import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StockBreakoutEvent } from './event/stock-breakout.event';
import { DailyTimeFrameBreakoutStrategy } from './strategy/DailyTimeFrameBreakoutStrategy';
import { FifteenMinutesTimeFrameBreakoutStrategy } from './strategy/FifteenMinutesTimeFrameBreakoutStrategy';
import { BreakoutStrategy } from './strategy/BreakoutStrategy';

@Injectable()
export class BreakoutService {
  constructor(
    private fmpService: FinancialModelingPrepService,
    private eventEmitter: EventEmitter2,
  ) {}

  async checkFor(symbol: string): Promise<void> {
    const strategies: BreakoutStrategy[] = [
      new DailyTimeFrameBreakoutStrategy(this.fmpService),
      new FifteenMinutesTimeFrameBreakoutStrategy(this.fmpService),
    ];

    for (const strategy of strategies) {
      const breakoutEvent = await strategy.checkFor(symbol);

      breakoutEvent &&
        this.eventEmitter.emit(StockBreakoutEvent.TYPE, breakoutEvent);
    }
  }
}
