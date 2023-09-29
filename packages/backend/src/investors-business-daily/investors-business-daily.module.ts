import { Module } from '@nestjs/common';
import { InvestorsBusinessDailyController } from './investors-business-daily.controller';
import { InvestorsBusinessDailyWebScrapperService } from './investors-business-daily-web-scrapper.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [InvestorsBusinessDailyController],
  providers: [InvestorsBusinessDailyWebScrapperService],
})
export class InvestorsBusinessDailyModule {}
