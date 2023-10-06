import { Controller, Get, Query } from '@nestjs/common';
import { OwnershipService } from './ownership.service';

@Controller('ownership')
export class OwnershipController {
  constructor(private ownershipService: OwnershipService) {}

  @Get('/history')
  async getHistory(@Query() query) {
    const { symbol } = query;

    return this.ownershipService.getHistory(symbol);
  }

  @Get('/top-shareholders')
  async getTopShareHolders(@Query() query) {
    const { symbol } = query;

    return this.ownershipService.getTopShareHolders(symbol);
  }
}
