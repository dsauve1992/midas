import { OngoingPosition, OngoingPositionProps } from '../../ongoing-position';
import { PositionId } from '../../position-id';
import { UserId } from '../../../../../../user/domain/UserId';
import { SymbolWithExchange } from '../../../../../../stocks/domain/symbol-with-exchange';
import { PositionStatus } from '../../position-status';

export const givenOngoingPosition = (
  props: Partial<OngoingPositionProps> = {},
): OngoingPosition => {
  return new OngoingPosition({
    id: props.id ?? PositionId.new(),
    symbol: props.symbol ?? SymbolWithExchange.from('NASDAQ:AAPL'),
    positionWishId: props.positionWishId ?? null,
    status: props.status ?? PositionStatus.ONGOING,
    userId: props.userId ?? UserId.from('user-id'),
    quantity: props.quantity ?? 1,
    buyPrice: props.buyPrice ?? 100,
    stopLoss: props.stopLoss ?? 99,
    createdAt: props.createdAt ?? new Date(),
    strategyName: props.strategyName,
    events: props.events ?? [],
  });
};
