import { Controller, Get, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as UserAgent from 'user-agents';
import { firstValueFrom } from 'rxjs';

@Controller('transcript')
export class TranscriptController {
  constructor(private httpService: HttpService) {}

  @Get()
  async getTranscript(@Query() query) {
    const symbol = query.symbol as string;
    const type = query.type as string;

    return this.requestTo(symbol, AnalysisTypeMapper[type] as string);
  }

  async requestTo(symbol: string, type: string) {
    const userAgent = new UserAgent();

    const { data } = await firstValueFrom(
      await this.httpService.post(
        'https://www.earningsdigest.ai/api/company/analyze',
        {
          q: symbol,
          type,
        },
        {
          headers: {
            'user-agent': userAgent.toString(),
          },
        },
      ),
    );

    return data;
  }
}

const AnalysisTypeMapper: { [key: string]: string } = {
  SUMMARY: '',
  HIGHLIGHT_AND_TAKEAWAY: 'Highlight',
  GUIDANCE_AND_OUTLOOK: 'Guidance',
  QNA_SUMMARY: 'QASummary',
  STRATEGIC_UPDATE: 'StrategicUpdates',
  SENTIMENT_ANALYSIS: 'SentimentAnalysis',
};
