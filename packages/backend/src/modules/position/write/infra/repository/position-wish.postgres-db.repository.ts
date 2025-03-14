import { PositionWish } from '../../domain/model/position-wish';
import { PositionWishRepository } from '../../domain/repository/position-wish.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseClientGetter } from '../../../../../lib/unit-of-work/database-client-getter';
import { PositionId } from '../../domain/model/position-id';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { Percentage } from '../../../../../lib/domain/Percentage';
import { UserId } from '../../../../user/domain/UserId';

interface PositionWishRow {
  id: string;
  user_id: string;
  symbol_with_exchange: string;
  nb_shares: number;
  risk_percentage: number;
  target_buy_price: number;
  stop_loss: number;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class PositionWishPostgresDbRepository
  implements PositionWishRepository
{
  constructor(
    @Inject('UNIT_OF_WORK') private databaseClientGetter: DatabaseClientGetter,
  ) {}

  async save(positionWish: PositionWish): Promise<void> {
    // First check if the position wish already exists
    const { rows } = await this.databaseClientGetter
      .getClient()
      .query<{ count: string }>(
        `SELECT COUNT(*) as count
                 FROM position_wishes
                 WHERE id = $1`,
        [positionWish.id.toString()],
      );

    const exists = parseInt(rows[0].count) > 0;

    if (exists) {
      // Update existing position wish
      await this.databaseClientGetter.getClient().query(
        `
                    UPDATE position_wishes
                    SET symbol_with_exchange = $1,
                        nb_shares            = $2,
                        risk_percentage      = $3,
                        target_buy_price     = $4,
                        stop_loss            = $5,
                        updated_at           = $6
                    WHERE id = $7
                `,
        [
          positionWish.symbol.toString(),
          positionWish.quantity,
          positionWish.riskPercentage.valueOf(),
          positionWish.entryPrice,
          positionWish.stopLoss,
          new Date(),
          positionWish.id.toString(),
        ],
      );
    } else {
      // Insert new position wish
      await this.databaseClientGetter.getClient().query(
        `
                    INSERT INTO position_wishes
                    (id, user_id, symbol_with_exchange, nb_shares, risk_percentage, target_buy_price, stop_loss,
                     created_at,
                     updated_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                `,
        [
          positionWish.id.toString(),
          positionWish.userId,
          positionWish.symbol.toString(),
          positionWish.quantity,
          positionWish.riskPercentage.valueOf(),
          positionWish.entryPrice,
          positionWish.stopLoss,
          positionWish.createdAt,
          positionWish.updatedAt,
        ],
      );
    }
  }

  async getAllByUserId(userId: string): Promise<PositionWish[]> {
    const { rows } = await this.databaseClientGetter
      .getClient()
      .query<PositionWishRow>(
        `
                    SELECT *
                    FROM position_wishes
                    WHERE user_id = $1
                    ORDER BY created_at DESC
                `,
        [userId],
      );

    return rows.map(this.mapToEntity);
  }

  async getById(id: PositionId): Promise<PositionWish> {
    const { rows } = await this.databaseClientGetter
      .getClient()
      .query<PositionWishRow>(
        `
                    SELECT *
                    FROM position_wishes
                    WHERE id = $1
                `,
        [id.toString()],
      );

    if (rows.length === 0) {
      throw new Error(`Position wish with id ${id.toString()} not found`);
    }

    return this.mapToEntity(rows[0]);
  }

  private mapToEntity(row: PositionWishRow): PositionWish {
    return new PositionWish(
      PositionId.from(row.id),
      UserId.from(row.user_id),
      SymbolWithExchange.from(row.symbol_with_exchange),
      row.target_buy_price,
      row.stop_loss,
      Percentage.from(row.risk_percentage),
      row.nb_shares,
      row.created_at,
      row.updated_at,
    );
  }
}
