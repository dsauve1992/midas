import { Module } from '@nestjs/common';
import { TranscriptController } from './transcript.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [TranscriptController],
  imports: [HttpModule],
})
export class TranscriptModule {}
