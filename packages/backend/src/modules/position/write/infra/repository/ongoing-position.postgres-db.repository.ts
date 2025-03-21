import { OngoingPosition } from '../../domain/model/ongoing-position';
import { PositionId } from '../../domain/model/position-id';
import { OngoingPositionRepository } from '../../domain/repository/ongoing-position.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseClientGetter } from '../../../../../lib/unit-of-work/database-client-getter';
import { UserId } from '../../../../user/domain/UserId';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { PositionStatus } from '../../domain/model/position-status';
import { StrategyName } from '../../domain/model/strategy/strategy-name';

interface PositionRow {
  id: string;
  position_wish_id: string | null;
  status: string;
  user_id: string;
  symbol_with_exchange: string;
  nb_shares: string;
  risk_percentage: string;
  buy_price: string;
  stop_loss: string;
  created_at: Date;
}

@Injectable()
export class OngoingPositionPostgresDbRepository
  implements OngoingPositionRepository
{
  constructor(
    @Inject('UNIT_OF_WORK') private databaseClientGetter: DatabaseClientGetter,
  ) {}

  getAll(): Promise<OngoingPosition[]> {
    throw new Error('Method not implemented.');
  }

  async getById(positionId: PositionId): Promise<OngoingPosition> {
    const { rows } = await this.databaseClientGetter
      .getClient()
      .query<PositionRow>(
        `
                    SELECT *
                    FROM position
                    WHERE id = $1
                `,
        [positionId.toString()],
      );

    if (rows.length === 0) {
      throw new Error(
        `Position wish with id ${positionId.toString()} not found`,
      );
    }

    return this.mapToEntity(rows[0]);
  }

  async save(position: OngoingPosition): Promise<void> {
    // First check if the position wish already exists
    const { rows } = await this.databaseClientGetter
      .getClient()
      .query<{ count: string }>(
        `SELECT COUNT(*) as count
                 FROM position_wishes
                 WHERE id = $1`,
        [position.id.toString()],
      );

    const exists = parseInt(rows[0].count) > 0;

    if (exists) {
      // Update existing position wish
      await this.databaseClientGetter.getClient().query(
        `
                    UPDATE position
                    SET symbol_with_exchange = $1,
                        nb_shares            = $2,
                        buy_price            = $3,
                        stop_loss            = $4,
                        WHERE id = $5
                `,
        [
          position.symbol.toString(),
          position.quantity,
          position.buyPrice,
          position.stopLoss,
          position.id.toString(),
        ],
      );
    } else {
      // Insert new position wish
      await this.databaseClientGetter.getClient().query(
        `
                    INSERT INTO position
                    (id, position_wish_id, status, user_id, symbol_with_exchange, nb_shares,
                     buy_price, stop_loss,
                     created_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                `,
        [
          position.id.toString(),
          position.positionWishId?.toString(),
          position.status,
          position.userId.toString(),
          position.symbol.toString(),
          position.quantity,
          position.buyPrice,
          position.stopLoss,
          position.createdAt,
        ],
      );
    }
  }

  private mapToEntity(row: PositionRow): OngoingPosition {
    return new OngoingPosition({
      id: PositionId.from(row.id),
      positionWishId: row.position_wish_id
        ? PositionId.from(row.position_wish_id)
        : null,
      userId: UserId.from(row.user_id),
      symbol: SymbolWithExchange.from(row.symbol_with_exchange),
      quantity: parseInt(row.nb_shares),
      buyPrice: parseFloat(row.buy_price),
      stopLoss: parseFloat(row.stop_loss),
      createdAt: row.created_at,
      status: row.status as PositionStatus,
      // supporter ces deux informations dans la BD
      events: [],
      strategyName: StrategyName.RISK_REWARD_RATIO,
    });
  }
}
