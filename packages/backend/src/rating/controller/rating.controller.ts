import { Controller, Get, Param } from '@nestjs/common';
import { RatingService } from '../usecase/rating.service';

@Controller('/rating')
export class RatingController {
  constructor(private ratingProcessorRunnerService: RatingService) {}

  @Get('/:symbol')
  async get(@Param('symbol') symbol: string) {
    try {
      return this.ratingProcessorRunnerService.computeRatingFor(symbol);
    } catch (e) {
      console.log(e);
    }
  }
}
