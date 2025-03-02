import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreatePositionRequestDto } from '../../shared-types/position';
import { CreatePositionWishUseCase } from './write/usecase/create-position-wish.use-case';
import { Percentage } from '../../lib/domain/Percentage';
import { SymbolWithExchange } from '../stocks/domain/symbol-with-exchange';
import { User } from '../authorization/User.param';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('position')
export class PositionController {
  constructor(
    private readonly createPositionWishUseCase: CreatePositionWishUseCase,
  ) {}

  @Post('/wish')
  async createPositionWish(
    @User() user: any,
    @Body() body: CreatePositionRequestDto,
  ) {
    const positionWish = await this.createPositionWishUseCase.execute({
      userId: user.sub,
      symbol: SymbolWithExchange.from(body.symbol),
      buyPrice: body.buyPrice,
      stopLoss: body.stopLoss,
      riskPercentage: Percentage.from(body.riskPercentage),
      quantity: body.nbShares,
    });

    return positionWish.id;
  }
}
