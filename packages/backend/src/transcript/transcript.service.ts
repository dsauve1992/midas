import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as UserAgent from 'user-agents';

export type AnalysisType =
  | 'SUMMARY'
  | 'HIGHLIGHT_AND_TAKEAWAY'
  | 'GUIDANCE_AND_OUTLOOK'
  | 'QNA_SUMMARY'
  | 'STRATEGIC_UPDATE'
  | 'SENTIMENT_ANALYSIS';

const AnalysisTypeMapper: { [key: string]: string } = {
  SUMMARY: '',
  HIGHLIGHT_AND_TAKEAWAY: 'Highlight',
  GUIDANCE_AND_OUTLOOK: 'Guidance',
  QNA_SUMMARY: 'QASummary',
  STRATEGIC_UPDATE: 'StrategicUpdates',
  SENTIMENT_ANALYSIS: 'SentimentAnalysis',
};

@Injectable()
export class TranscriptService {
  constructor(private httpService: HttpService) {}

  async getTranscript(symbol: string, type: AnalysisType) {
    return this.requestTo(symbol, AnalysisTypeMapper[type]);
  }

  private async requestTo(symbol: string, type: string) {
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
