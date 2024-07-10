import { Inject, Injectable } from '@nestjs/common';
import { ScreenerRepository } from '../../../domain/screener.repository';
import { ScreenerEntryEntity } from '../../../domain/screener-entry.entity';
import { UnitOfWork } from '../../../../../lib/unit-of-work';

@Injectable()
export class ScreenerPostgresDbRepository extends ScreenerRepository {
  constructor(@Inject('UNIT_OF_WORK') private unitOfWork: UnitOfWork) {
    super();
  }

  async save(screenerEntryEntity: ScreenerEntryEntity) {
    await this.unitOfWork.getClient().query(
      `
        INSERT INTO screener ( 
          symbol,
            exchange,
            sector,
            industry,
            rs_line,
            rs_line_sma50,
            rs_line_sma200,
            fundamental_rating,
            average_daily_range,
            number_of_days_until_next_earning_call,
            days_since_last_52_week_high
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       `,
      [
        screenerEntryEntity.symbol,
        screenerEntryEntity.exchange,
        screenerEntryEntity.sector,
        screenerEntryEntity.industry,
        screenerEntryEntity.rsLine,
        screenerEntryEntity.rsLineSma50,
        screenerEntryEntity.rsLineSma200,
        screenerEntryEntity.fundamentalRating,
        screenerEntryEntity.averageDailyRange,
        screenerEntryEntity.numberOfDaysUntilNextEarningCall,
        screenerEntryEntity.daysSinceLast52WeekHigh,
      ],
    );
  }

  async getAll(): Promise<ScreenerEntryEntity[]> {
    const { rows } = await this.unitOfWork.getClient().query(
      `
        SELECT
        *
        FROM screener 
        `,
    );

    return rows.map(
      (row) =>
        new ScreenerEntryEntity(
          row.symbol,
          row.exchange,
          row.sector,
          row.industry,
          row.rs_line,
          row.rs_line_sma50,
          row.rs_line_sma200,
          row.fundamental_rating,
          row.average_daily_range,
          row.number_of_days_until_next_earning_call,
          [],
          [],
          row.days_since_last_52_week_high,
        ),
    );
  }

  async deleteAll() {
    await this.unitOfWork.getClient().query('DELETE FROM screener');
  }
}
