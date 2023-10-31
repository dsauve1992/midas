import { Controller, Get, Param } from '@nestjs/common';
import { ComputeFundamentalRatingUseCase } from '../usecase/compute-fundamental-rating.use-case';

@Controller('/rating')
export class RatingController {
  constructor(
    private ratingProcessorRunnerService: ComputeFundamentalRatingUseCase,
  ) {}

  @Get('/:symbol')
  async get(@Param('symbol') symbol: string) {
    try {
      return this.ratingProcessorRunnerService.execute(symbol);
    } catch (e) {
      console.log(e);
    }
  }
}
