import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as screenerParameters from './screenerParameter.json';
import { firstValueFrom } from 'rxjs';

@Controller('screener')
export class ScreenerController {
  constructor(private httpService: HttpService) {}

  @Get()
  async getScreener() {
    const response = await firstValueFrom(
      await this.httpService.post(
        'https://scanner.tradingview.com/global/scan',
        screenerParameters,
      ),
    );

    return response.data.data.map((entry: any) => entry.d[0]);
  }
}
