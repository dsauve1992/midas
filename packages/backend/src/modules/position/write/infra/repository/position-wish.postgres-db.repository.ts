import { PositionWish } from '../../domain/model/position-wish';
import { PositionWishRepository } from '../../domain/repository/position-wish.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseClientGetter } from '../../../../../lib/unit-of-work/database-client-getter';
import { PositionId } from '../../domain/model/position-id';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { Percentage } from '../../../../../lib/domain/Percentage';
import { UserId } from '../../../../user/domain/UserId';
import { PositionWishStatus } from '../../domain/model/position-wish-status';

interface PositionWishRow {
  id: string;
  status: string;
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

  async getAllWaitingForOrderCreated(): Promise<PositionWish[]> {
    const { rows } = await this.databaseClientGetter
      .getClient()
      .query<PositionWishRow>(
        `
                    SELECT *
                    FROM position_wishes
                    WHERE status = 'WAIT_FOR_ORDER_CREATED'
                `,
      );

    return rows.map(this.mapToEntity);
  }

  async getAllPending(): Promise<PositionWish[]> {
    const { rows } = await this.databaseClientGetter
      .getClient()
      .query<PositionWishRow>(
        `
                    SELECT *
                    FROM position_wishes
                    WHERE status = 'PENDING'
                `,
      );

    return rows.map(this.mapToEntity);
  }

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
                        status               = $2,
                        nb_shares            = $3,
                        risk_percentage      = $4,
                        target_buy_price     = $5,
                        stop_loss            = $6,
                        updated_at           = $7
                    WHERE id = $7
                `,
        [
          positionWish.symbol.toString(),
          positionWish.status,
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
                    (id, status, user_id, symbol_with_exchange, nb_shares, risk_percentage, target_buy_price, stop_loss,
                     created_at,
                     updated_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                `,
        [
          positionWish.id.toString(),
          positionWish.status,
          positionWish.userId.toString(),
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
    return new PositionWish({
      id: PositionId.from(row.id),
      status: row.status as PositionWishStatus,
      userId: UserId.from(row.user_id),
      symbol: SymbolWithExchange.from(row.symbol_with_exchange),
      entryPrice: row.target_buy_price,
      stopLoss: row.stop_loss,
      riskPercentage: Percentage.from(row.risk_percentage),
      quantity: row.nb_shares,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
