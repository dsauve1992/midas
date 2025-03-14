import { PositionId } from '../../position-id';
import { SymbolWithExchange } from '../../../../../../stocks/domain/symbol-with-exchange';
import { Percentage } from '../../../../../../../lib/domain/Percentage';
import { PositionWish } from '../../position-wish';
import { UserId } from '../../../../../../user/domain/UserId';

type PositionWishProps = {
  id: PositionId;
  userId: UserId;
  symbol: SymbolWithExchange;
  entryPrice: number;
  stopLoss: number;
  riskPercentage: Percentage;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export const givenPositionWish = (
  props: Partial<PositionWishProps> = {},
): PositionWish => {
  return new PositionWish(
    props.id ?? PositionId.new(),
    props.userId ?? UserId.from('userId'),
    props.symbol ?? SymbolWithExchange.from('NASDAQ:AAPL'),
    props.entryPrice ?? 100,
    props.stopLoss ?? 90,
    props.riskPercentage ?? Percentage.from(0.1),
    props.quantity ?? 10,
    props.createdAt ?? new Date(),
    props.updatedAt ?? new Date(),
  );
};
