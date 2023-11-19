import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { HistoricalDataModule } from '../historical-data/historical-data.module';

@Module({
  controllers: [SearchController],
  imports: [HistoricalDataModule],
})
export class SearchModule {}
