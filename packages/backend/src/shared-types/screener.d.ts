import { ScreenerEntryFrontendDto } from './screener-entry-frontend.dto';

type ScreenerResponse = {
  sectors: {
    name: string;
    index: string | null;
    industryGroups: {
      name: string;
      stocks: ScreenerEntryFrontendDto[];
    }[];
  }[];
};
