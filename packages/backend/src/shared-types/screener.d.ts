import { ScreenerEntryEntity } from './screener-entry.entity';

type ScreenerResponse = {
  sectors: {
    name: string;
    index: string | null;
    industryGroups: {
      name: string;
      stocks: ScreenerEntryEntity[];
    }[];
  }[];
};
