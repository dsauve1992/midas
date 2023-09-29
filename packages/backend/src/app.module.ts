import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinancialModelingPrepModule } from './financial-modeling-prep/financial-modeling-prep.module';
import { ConfigModule } from '@nestjs/config';
import { OwnershipModule } from './ownership/ownership.module';
import { TranscriptModule } from './transcript/transcript.module';
import { ScreenerModule } from './screener/screener.module';

@Module({
  imports: [
    FinancialModelingPrepModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OwnershipModule,
    TranscriptModule,
    ScreenerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
