import { OngoingPosition, OngoingPositionEvent } from '../ongoing-position';
import { PositionId } from '../position-id';
import { SymbolWithExchange } from '../../../../../stocks/domain/symbol-with-exchange';

describe('OngoingPosition', () => {
  test('given a price below the stop loss, when check is called, then the position should be closed', async () => {
    const position = new OngoingPosition(
      PositionId.new(),
      SymbolWithExchange.from('NASDAQ:AAPL'),
      100,
      90,
      5,
    );

    await position.check(89);

    expect(position.isClosed()).toBe(true);
  });

  test('given a price greater than 2 x the risk above the buy price, when check is called, then 1/3 of the position should be sell and the stop loss should be raised to the buy price', async () => {
    const position = new OngoingPosition(
      PositionId.new(),
      SymbolWithExchange.from('NASDAQ:AAPL'),
      100,
      90,
      5,
    );

    const currentPrice = 111;
    expect(currentPrice).toBeGreaterThan(2 * position.initialRiskPerShare);

    await position.check(currentPrice);

    expect(position.history).toHaveLength(2);
    expect(position.history).toEqual([
      OngoingPositionEvent.TakeProfit({
        preliminarySellPrice: currentPrice,
        quantity: 2,
      }),
      OngoingPositionEvent.RaiseStopLoss({
        newStopLoss: position.buyPrice,
      }),
    ]);
  });
});
