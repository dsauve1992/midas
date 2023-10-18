import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as screenerParameters from './screenerParameter.json';
import { ScreenerRepository } from '../repository/screener.repository';

@Injectable()
export class ScreenerService {
  constructor(
    private httpService: HttpService,
    private screenerRepository: ScreenerRepository,
  ) {}

  async search(): Promise<string[]> {
    const response = await firstValueFrom(
      this.httpService.post(
        'https://scanner.tradingview.com/global/scan',
        screenerParameters,
      ),
    );

    return response.data.data.map((entry: any) => entry.d[0]);
  }

  async searchWithRating() {
    return this.screenerRepository.getAll();
  }
}
