import { PositionWish } from '../../domain/model/position-wish';
import { PositionWishRepository } from '../../domain/repository/position-wish.repository';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { Inject } from '@nestjs/common';
import { DatabaseClientGetter } from '../../../../../lib/unit-of-work/database-client-getter';
import { PositionId } from '../../domain/model/position-id';
import { Percentage } from '../../../../../lib/domain/Percentage';

type PositionWishRow = {
  id: string;
  symbol: string;
  userid: string;
  buy_price: number;
  stop_loss: number;
  portfolio_value: number;
  risk_percentage: number;
  quantity: number;
  created_at: Date;
};

export class PositionWishPostgresDbRepository
  implements PositionWishRepository
{
  constructor(
    @Inject('UNIT_OF_WORK') private databaseClientGetter: DatabaseClientGetter,
  ) {}

  async save(positionWish: PositionWish): Promise<void> {
    await this.databaseClientGetter
      .getClient()
      .query(
        'INSERT INTO position_wishes (id, symbol, user_id, buy_price, stop_loss, portfolio_value, risk_percentage, quantity, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING',
        [
          positionWish.id.toString(),
          positionWish.symbol.toString(),
          positionWish.userId,
          positionWish.buyPrice,
          positionWish.stopLoss,
          positionWish.portfolioTotalValue,
          positionWish.riskPercentage.toString(),
          positionWish.quantity,
          positionWish.createdAt,
        ],
      );
  }

  async getAllByUserId(userId: string): Promise<PositionWish[]> {
    const { rows } = await this.databaseClientGetter
      .getClient()
      .query<PositionWishRow>(
        `
                    SELECT position_wishes.id              as id,
                           position_wishes.symbol          as symbol,
                           position_wishes.user_id         as userid,
                           position_wishes.buy_price       as buy_price,
                           position_wishes.stop_loss       as stop_loss,
                           position_wishes.portfolio_value as portfolio_value,
                           position_wishes.risk_percentage as risk_percentage,
                           position_wishes.quantity        as quantity
                        position_wishes.created_at      as created_at
                    FROM position_wishes
                    WHERE user_id = $1
                `,
        [userId],
      );

    return rows.map(
      (row) =>
        new PositionWish(
          PositionId.from(row.id),
          SymbolWithExchange.from(row.symbol),
          row.buy_price,
          row.stop_loss,
          row.portfolio_value,
          Percentage.from(row.risk_percentage),
          row.quantity,
          row.userid,
          row.created_at,
        ),
    );
  }
}
