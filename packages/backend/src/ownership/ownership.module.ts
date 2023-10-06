import { Module } from '@nestjs/common';
import { OwnershipController } from './ownership.controller';
import { HttpModule } from '@nestjs/axios';
import { OwnershipService } from './ownership.service';

@Module({
  controllers: [OwnershipController],
  imports: [HttpModule],
  providers: [OwnershipService],
})
export class OwnershipModule {}
