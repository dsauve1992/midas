import { Controller, Get, HttpCode } from '@nestjs/common';
import { OwnershipService } from './modules/ownership/ownership.service';

@Controller()
export class AppController {
  constructor(private ownershipService: OwnershipService) {}

  @Get('/')
  @HttpCode(204)
  async get() {
    return;
  }
}
