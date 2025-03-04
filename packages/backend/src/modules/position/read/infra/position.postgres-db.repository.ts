import { Inject, Injectable } from '@nestjs/common';
import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';
import { PositionRepository } from '../position.repository';
import { PositionModel } from '../model/PositionModel';
import { Pool } from 'pg';

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
export class PositionPostgresDbRepository implements PositionRepository {
  constructor(@Inject('PG_CONNECTION_POOL') private pool: Pool) {}

  async getAllByUserId(userId: string): Promise<PositionModel[]> {
    const { rows } = await this.pool.query<PositionWishRow>(
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

  private mapToEntity(row: PositionWishRow): PositionModel {
    return new PositionModel(
      row.id,
      row.user_id,
      SymbolWithExchange.from(row.symbol_with_exchange),
      row.nb_shares,
      row.target_buy_price,
      row.stop_loss,
      row.risk_percentage,
      row.created_at,
      row.updated_at,
    );
  }
}
