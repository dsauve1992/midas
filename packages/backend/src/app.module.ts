import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinancialModelingPrepModule } from './financial-modeling-prep/financial-modeling-prep.module';
import { ConfigModule } from '@nestjs/config';
import { OwnershipModule } from './ownership/ownership.module';
import { TranscriptModule } from './transcript/transcript.module';
import { ScreenerModule } from './screener/screener.module';
import { InvestorsBusinessDailyModule } from './investors-business-daily/investors-business-daily.module';
import { RatingModule } from './rating/rating.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    FinancialModelingPrepModule,
    OwnershipModule,
    TranscriptModule,
    ScreenerModule,
    InvestorsBusinessDailyModule,
    RatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
