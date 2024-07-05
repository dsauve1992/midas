import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../authorization/User.param';
import { AddSymbolToWatchlistUseCase } from '../usecase/add-symbol-to-watchlist.use-case';
import { RemoveSymbolFromWatchlistUseCase } from '../usecase/remove-symbol-from-watchlist.use-case';
import { GetWatchlistUseCase } from '../usecase/get-watchlist.use-case';

@UseGuards(AuthGuard('jwt'))
@Controller('watchlist')
export class WatchlistController {
  constructor(
    private getWatchlistUseCase: GetWatchlistUseCase,
    private addSymbolToWatchlistUseCase: AddSymbolToWatchlistUseCase,
    private removeSymbolFromWatchlistUseCase: RemoveSymbolFromWatchlistUseCase,
  ) {}

  @Get()
  async getWatchlist(@User() user: any) {
    try {
      const watchlist = await this.getWatchlistUseCase.execute({
        userId: user.sub,
      });
      return Array.from(watchlist);
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  @Post('/add')
  async addSymbolToWatchlist(
    @User() user: any,
    @Body('symbol') symbol: string,
  ) {
    await this.addSymbolToWatchlistUseCase.execute({
      userId: user.sub,
      symbol,
    });
  }

  @Post('/remove')
  async removeSymbolToWatchlist(
    @User() user: any,
    @Body('symbol') symbol: string,
  ) {
    await this.removeSymbolFromWatchlistUseCase.execute({
      userId: user.sub,
      symbol,
    });
  }
}
