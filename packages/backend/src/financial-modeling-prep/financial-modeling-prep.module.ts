import { Module } from '@nestjs/common';
import { FinancialModelingPrepController } from './financial-modeling-prep.controller';
import { HttpModule } from '@nestjs/axios';
import { FinancialModelingPrepFetcherClient } from './financial-modeling-prep-fetcher-client.service';

@Module({
  controllers: [FinancialModelingPrepController],
  imports: [HttpModule],
  providers: [FinancialModelingPrepFetcherClient],
  exports: [FinancialModelingPrepFetcherClient],
})
export class FinancialModelingPrepModule {}
