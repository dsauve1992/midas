import { Module } from '@nestjs/common';
import { ScreenerController } from './controller/screener.controller';
import { HttpModule } from '@nestjs/axios';
import { ScreenerService } from './service/screener.service';
import { ScreenerRepository } from './repository/screener.repository';

@Module({
  controllers: [ScreenerController],
  imports: [HttpModule],
  providers: [ScreenerService, ScreenerRepository],
  exports: [ScreenerService],
})
export class ScreenerModule {}
