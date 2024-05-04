import { Injectable } from '@nestjs/common';
import { ScreenerEntryEntity } from './screener-entry.entity';

@Injectable()
export abstract class ScreenerRepository {
  abstract save(screenerEntryEntity: ScreenerEntryEntity): Promise<void>;

  abstract getAll(): Promise<ScreenerEntryEntity[]>;

  abstract deleteAll(): Promise<void>;
}