import { Module } from '@nestjs/common';
import { FinancialModelingPrepController } from './financial-modeling-prep.controller';
import { HttpModule } from '@nestjs/axios';
import { FinancialModelingPrepFetcherService } from './financial-modeling-prep-fetcher.service';

@Module({
  controllers: [FinancialModelingPrepController],
  imports: [HttpModule],
  providers: [FinancialModelingPrepFetcherService],
})
export class FinancialModelingPrepModule {}
