import { PositionId } from '../../position-id';
import { SymbolWithExchange } from '../../../../../../stocks/domain/symbol-with-exchange';
import { Percentage } from '../../../../../../../lib/domain/Percentage';
import { PositionWish, PositionWishProps } from '../../position-wish';
import { UserId } from '../../../../../../user/domain/UserId';
import { PositionWishStatus } from '../../position-wish-status';

export const givenPositionWish = (
  props: Partial<PositionWishProps> = {},
): PositionWish => {
  return new PositionWish({
    id: PositionId.new(),
    status: PositionWishStatus.PENDING,
    userId: UserId.from('userId'),
    symbol: SymbolWithExchange.from('NASDAQ:AAPL'),
    entryPrice: 100,
    stopLoss: 90,
    riskPercentage: Percentage.from(0.1),
    quantity: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...props,
  });
};
