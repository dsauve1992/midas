import { OngoingPosition } from '../../domain/model/ongoing-position';
import { PositionId } from '../../domain/model/position-id';
import { OngoingPositionRepository } from '../../domain/repository/ongoing-position.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseClientGetter } from '../../../../../lib/unit-of-work/database-client-getter';
import { UserId } from '../../../../user/domain/UserId';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { PositionStatus } from '../../domain/model/position-status';
import { StrategyName } from '../../domain/model/strategy/strategy-name';
import { TakePartialProfitEvent } from '../../domain/model/position-events/take-partial-profit-event';
import { StopLossHitEvent } from '../../domain/model/position-events/stop-loss-hit-event';
import { PositionEventId } from '../../domain/model/position-events/position-event';

interface JoinedPositionWithEventsRow {
  id: string;
  position_wish_id: string | null;
  status: string;
  user_id: string;
  symbol_with_exchange: string;
  nb_shares: string;
  buy_price: string;
  stop_loss: string;
  strategy: string;
  created_at: Date;
  event_id: string;
  event_position_id: string;
  event_type: string;
  event_data: object;
  event_created_at: Date;
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
      .query<JoinedPositionWithEventsRow>(
        `
                    SELECT p.id,
                           p.position_wish_id,
                           p.status,
                           p.user_id,
                           p.symbol_with_exchange,
                           p.nb_shares,
                           p.buy_price,
                           p.stop_loss,
                           p.strategy,
                           p.created_at,
                           pe.id          as event_id,
                           pe.position_id as event_position_id,
                           pe.event_type,
                           pe.payload     as event_data,
                           pe.created_at  as event_created_at
                    FROM position p
                             LEFT JOIN position_events pe ON p.id = pe.position_id
                    WHERE p.id = $1
                `,
        [positionId.toString()],
      );

    if (rows.length === 0) {
      throw new Error(
        `Position wish with id ${positionId.toString()} not found`,
      );
    }

    return this.mapToEntity(rows);
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
                        strategy             = $5,
                        WHERE id = $6
                `,
        [
          position.symbol.toString(),
          position.quantity,
          position.buyPrice,
          position.stopLoss,
          position.strategyName,
          position.id.toString(),
        ],
      );
    } else {
      // Insert new position wish
      await this.databaseClientGetter.getClient().query(
        `
                    INSERT INTO position
                    (id, position_wish_id, status, user_id, symbol_with_exchange, nb_shares,
                     buy_price, stop_loss, strategy,
                     created_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
          position.strategyName,
          position.createdAt,
        ],
      );
    }

    if (position.events && position.events.length > 0) {
      const eventQueries = position.events.map((event) =>
        this.databaseClientGetter.getClient().query(
          `INSERT INTO position_events
                         (id, position_id, created_at, event_type, payload)
                     VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
          [
            event.id.toString(),
            position.id.toString(),
            event.timestamp,
            event instanceof TakePartialProfitEvent
              ? 'take_partial_profit'
              : 'stop_loss_hit',
            event instanceof TakePartialProfitEvent
              ? {
                  nbOfShares: event.nbOfShares,
                  sellingPrice: event.sellingPrice,
                }
              : { sellingPrice: event.sellingPrice },
          ],
        ),
      );

      // Execute all event insertion queries
      await Promise.all(eventQueries);
    }
  }

  private mapToEntity(row: JoinedPositionWithEventsRow[]): OngoingPosition {
    return new OngoingPosition({
      id: PositionId.from(row[0].id),
      positionWishId: row[0].position_wish_id
        ? PositionId.from(row[0].position_wish_id)
        : null,
      userId: UserId.from(row[0].user_id),
      symbol: SymbolWithExchange.from(row[0].symbol_with_exchange),
      quantity: parseInt(row[0].nb_shares),
      buyPrice: parseFloat(row[0].buy_price),
      stopLoss: parseFloat(row[0].stop_loss),
      createdAt: row[0].created_at,
      status: row[0].status as PositionStatus,
      events: row.map((eventRow) => {
        switch (eventRow.event_type) {
          case 'take_partial_profit':
            return new TakePartialProfitEvent({
              id: PositionEventId.from(eventRow.event_id),
              timestamp: eventRow.event_created_at,
              nbOfShares: eventRow.event_data['nbOfShares'],
              sellingPrice: eventRow.event_data['sellingPrice'],
            });
          case 'stop_loss_hit':
            return new StopLossHitEvent({
              id: PositionEventId.from(eventRow.event_id),
              timestamp: eventRow.event_created_at,
              sellingPrice: eventRow.event_data['sellingPrice'],
            });
        }
      }),
      strategyName: row[0].strategy as StrategyName,
    });
  }
}
