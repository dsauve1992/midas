import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinancialModelingPrepModule } from './financial-modeling-prep/financial-modeling-prep.module';
import { ConfigModule } from '@nestjs/config';
import { OwnershipModule } from './ownership/ownership.module';

@Module({
  imports: [
    FinancialModelingPrepModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OwnershipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
