import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as UserAgent from 'user-agents';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { get } from 'lodash';
import { format } from 'date-fns';

export interface StockRankingInfo {
  rankInGroup: string;
  groupRanking: string;
  groupName: string;
  groupLeader: string;
}

export type IbdRating = {
  rsRating: number;
  epsRating: number;
};

@Injectable()
export class InvestorsBusinessDailyService {
  constructor(private httpService: HttpService) {}

  async fetchStockRankings(symbol: string): Promise<StockRankingInfo> {
    const url = await this.findQuoteUrl(symbol);
    const data = await this.extractPageContentV2(url);
    return this.parseData(data);
  }

  async fetchStockRating(symbol: string): Promise<IbdRating> {
    const todayString = format(new Date(), 'yyyy-MM-d');

    const rawData = await axios.post(
      'https://research.investors.com/services/ChartService.svc/GetData',
      {
        req: {
          Symbol: symbol,
          Type: 1,
          StartDate: todayString,
          EndDate: todayString,
          EnableBats: true,
        },
      },
    );

    const rsRating = get(rawData.data, 'GetDataResult.rSRating')!;
    const epsRating = get(rawData.data, 'GetDataResult.ePSRating')!;

    return {
      rsRating,
      epsRating,
    };
  }

  private async findQuoteUrl(symbol: string) {
    const data = await this.requestTo(
      `https://ibdservices.investors.com/im/api/stock/symbol?symbol=${symbol}`,
    );
    return (data as any).stock.quoteUrl;
  }

  private async requestTo(url: string) {
    const userAgent = new UserAgent();

    const { data } = await firstValueFrom(
      await this.httpService.get(url, {
        headers: {
          'user-agent': userAgent.toString(),
        },
      }),
    );

    return data;
  }

  private async extractPageContentV2(url: string): Promise<any> {
    return await this.requestTo(url);
  }

  private async parseData(data: string): Promise<StockRankingInfo> {
    const $ = cheerio.load(data);
    const rankInGroup = $('.group_leadership_block span:contains("#")')
      .next()
      .text();

    const groupLeader = $('#moreDataFor a').text();

    const groupRanking = $('li:contains(" Industry Group Rank")')
      .first()
      .next()
      .text()
      .trim();
    const groupName = $('li:contains(" Industry Group")')
      .first()
      .next()
      .text()
      .trim();
    return {
      rankInGroup,
      groupLeader,
      groupName,
      groupRanking,
    };
  }
}
