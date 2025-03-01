import { Body, Controller, Post } from '@nestjs/common';
import { CreatePositionRequestDto } from '../../shared-types/position';

@Controller('position')
export class PositionController {
  @Post('/wish')
  async createPositionWish(@Body() body: CreatePositionRequestDto) {
    console.log('Creating position wish', body);
  }
}
