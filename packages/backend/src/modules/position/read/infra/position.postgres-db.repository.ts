import { Inject, Injectable } from '@nestjs/common';
import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';
import { PositionRepository } from '../position.repository';
import { PositionModel } from '../model/PositionModel';
import { Pool } from 'pg';

interface PositionWishRow {
  id: string;
  user_id: string;
  symbol_with_exchange: string;
  nb_shares: string;
  risk_percentage: string;
  target_buy_price: string;
  stop_loss: string;
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
    console.log(row);

    return {
      id: row.id,
      userId: row.user_id,
      symbol: SymbolWithExchange.from(row.symbol_with_exchange),
      quantity: Number.parseInt(row.nb_shares),
      buyPrice: Number.parseFloat(row.target_buy_price),
      stopLoss: Number.parseFloat(row.stop_loss),
      riskPercentage: Number.parseFloat(row.risk_percentage),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
