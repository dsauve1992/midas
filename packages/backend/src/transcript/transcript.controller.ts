import { Controller, Get, Query } from '@nestjs/common';
import { AnalysisType, TranscriptService } from './transcript.service';

@Controller('transcript')
export class TranscriptController {
  constructor(private transcriptService: TranscriptService) {}

  @Get()
  async getTranscript(@Query() query) {
    const symbol = query.symbol as string;
    const type = query.type as AnalysisType;

    return this.transcriptService.getTranscript(symbol, type);
  }
}
