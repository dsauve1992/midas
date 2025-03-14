import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { CreatePositionRequestDto } from '../../shared-types/position';
import { CreatePositionWishUseCase } from './write/usecase/create-position-wish.use-case';
import { Percentage } from '../../lib/domain/Percentage';
import { SymbolWithExchange } from '../stocks/domain/symbol-with-exchange';
import { User } from '../authorization/User.param';
import { AuthGuard } from '@nestjs/passport';
import { PositionRepository } from './read/position.repository';
import { UserId } from '../user/domain/UserId';

@UseGuards(AuthGuard('jwt'))
@Controller('position')
export class PositionController {
  constructor(
    private readonly createPositionWishUseCase: CreatePositionWishUseCase,
    @Inject('PositionReadRepository')
    private readonly positionRepository: PositionRepository,
  ) {}

  @Post('/wish')
  async createPositionWish(
    @User() user: any,
    @Body() body: CreatePositionRequestDto,
  ) {
    const positionWish = await this.createPositionWishUseCase.execute({
      userId: UserId.from(user.sub),
      symbol: SymbolWithExchange.from(body.symbol),
      entryPrice: body.entryPrice,
      stopLoss: body.stopLoss,
      riskPercentage: Percentage.from(body.riskPercentage),
      quantity: body.nbShares,
    });

    return positionWish.id;
  }

  @Get('/')
  async queryPosition(@User() user: any) {
    return this.positionRepository.getAllByUserId(user.sub);
  }
}
