import { ScreenerSnapshot } from '../model/screener-snapshot';

export interface ScreenerRepository {
  search(): Promise<ScreenerSnapshot>;
}
