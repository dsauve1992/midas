import { Module } from '@nestjs/common';
import { InvestorsBusinessDailyController } from './investors-business-daily.controller';
import { InvestorsBusinessDailyService } from './investors-business-daily.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [InvestorsBusinessDailyController],
  providers: [InvestorsBusinessDailyService],
})
export class InvestorsBusinessDailyModule {}
