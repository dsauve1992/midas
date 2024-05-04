import { Injectable } from '@nestjs/common';
import { ScreenerEntryFrontendDto } from '../../../shared-types/screener-entry-frontend.dto';

@Injectable()
export abstract class ScreenerRepository {
  abstract create(screenerEntryEntity: ScreenerEntryFrontendDto): Promise<void>;

  abstract getAll(): Promise<ScreenerEntryFrontendDto[]>;

  abstract deleteAll(): Promise<void>;
}
