import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../authorization/User.param';
import { AddSymbolToWatchlistUseCase } from '../usecase/add-symbol-to-watchlist.use-case';
import { RemoveSymbolFromWatchlistUseCase } from '../usecase/remove-symbol-from-watchlist.use-case';
import { GetWatchlistsUseCase } from '../usecase/get-watchlists-use-case';
import { WatchlistDto } from '../../../shared-types/watchlist.dto';
import { CreateWatchlistUseCase } from '../usecase/create-watchlist.use-case';
import { DeleteWatchlistUseCase } from '../usecase/delete-watchlist.use-case';

@UseGuards(AuthGuard('jwt'))
@Controller('watchlist')
export class WatchlistController {
  constructor(
    private getWatchlistsUseCase: GetWatchlistsUseCase,
    private addSymbolToWatchlistUseCase: AddSymbolToWatchlistUseCase,
    private removeSymbolFromWatchlistUseCase: RemoveSymbolFromWatchlistUseCase,
    private createWatchlistUseCase: CreateWatchlistUseCase,
    private deleteWatchlistUseCase: DeleteWatchlistUseCase,
  ) {}

  @Get()
  async getAllWatchlists(@User() user: any): Promise<WatchlistDto[]> {
    const watchlists = await this.getWatchlistsUseCase.execute({
      userId: user.sub,
    });

    return watchlists.map((watchlist) => ({
      id: watchlist.id,
      name: watchlist.name,
      symbols: Array.from(watchlist),
      order: watchlist.order,
    }));
  }

  @Post()
  async createWatchlist(
    @User() user: any,
    @Body('name') name: string,
  ): Promise<void> {
    await this.createWatchlistUseCase.execute({
      userId: user.sub,
      name,
    });
  }

  @Delete(':id')
  async deleteWatchlist(
    @User() user: any,
    @Param('id') watchlistId: string,
  ): Promise<void> {
    await this.deleteWatchlistUseCase.execute({
      userId: user.sub,
      watchlistId,
    });
  }

  @Post(':id/add')
  async addSymbolToWatchlist(
    @User() user: any,
    @Param('id') watchlistId: string,
    @Body('symbol') symbol: string,
  ) {
    await this.addSymbolToWatchlistUseCase.execute({
      userId: user.sub,
      watchlistId,
      symbol,
    });
  }

  @Post(':id/remove')
  async removeSymbolFromWatchlist(
    @User() user: any,
    @Param('id') watchlistId: string,
    @Body('symbol') symbol: string,
  ) {
    await this.removeSymbolFromWatchlistUseCase.execute({
      userId: user.sub,
      watchlistId,
      symbol,
    });
  }
}
