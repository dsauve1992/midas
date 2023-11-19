import { Module } from '@nestjs/common';
import { TranscriptController } from './transcript.controller';
import { HttpModule } from '@nestjs/axios';
import { TranscriptService } from './transcript.service';

@Module({
  controllers: [TranscriptController],
  imports: [HttpModule],
  providers: [TranscriptService],
})
export class TranscriptModule {}
