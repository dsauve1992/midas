import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinancialModelingPrepModule } from './financial-modeling-prep/financial-modeling-prep.module';
import { ConfigModule } from '@nestjs/config';
import { OwnershipModule } from './ownership/ownership.module';
import { TranscriptModule } from './transcript/transcript.module';
import { ScreenerModule } from './screener/screener.module';
import { InvestorsBusinessDailyModule } from './investors-business-daily/investors-business-daily.module';

@Module({
  imports: [
    FinancialModelingPrepModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OwnershipModule,
    TranscriptModule,
    ScreenerModule,
    InvestorsBusinessDailyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
