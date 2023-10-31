import { Controller, Get, Query } from '@nestjs/common';
import { AnalysisType, TranscriptService } from './transcript.service';

type GetTranscriptQuery = {
  symbol: string;
  type: AnalysisType;
};

@Controller('transcript')
export class TranscriptController {
  constructor(private transcriptService: TranscriptService) {}

  @Get()
  async getTranscript(@Query() query: GetTranscriptQuery) {
    const { symbol, type } = query;

    return this.transcriptService.getTranscript(symbol, type);
  }
}
