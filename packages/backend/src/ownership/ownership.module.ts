import { Module } from '@nestjs/common';
import { OwnershipController } from './ownership.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [OwnershipController],
  imports: [HttpModule],
})
export class OwnershipModule {}
