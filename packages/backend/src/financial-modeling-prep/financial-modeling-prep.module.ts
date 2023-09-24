import { Module } from '@nestjs/common';
import { FinancialModelingPrepController } from './financial-modeling-prep.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [FinancialModelingPrepController],
  imports: [HttpModule],
})
export class FinancialModelingPrepModule {}
