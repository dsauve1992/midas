export type ScreenerEntryFrontendDto = {
  symbol: string;
  exchange: string;
  sector: string;
  industry: string;
  fundamentalRating: number;
  averageDailyRange: number;
  numberOfDaysUntilNextEarningCall: number;
};
