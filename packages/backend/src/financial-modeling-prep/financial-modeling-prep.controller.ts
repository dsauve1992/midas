import { Controller, Get, Param, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Controller('api/fmp')
export class FinancialModelingPrepController {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  @Get('*')
  async proxy(@Req() req: Request, @Param() params) {
    const apiKey = this.configService.get<string>('FMP_API_KEY');
    const url = `https://financialmodelingprep.com/api/${params[0]}?apikey=${apiKey}`;

    const { data } = await firstValueFrom(await this.httpService.get(url));
    return data;
  }
}
