import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as screenerParameters from './screenerParameter.json';

@Injectable()
export class ScreenerService {
  constructor(private httpService: HttpService) {}

  async search(): Promise<string[]> {
    const response = await firstValueFrom(
      await this.httpService.post(
        'https://scanner.tradingview.com/global/scan',
        screenerParameters,
      ),
    );

    return response.data.data.map((entry: any) => entry.d[0]);
  }
}
