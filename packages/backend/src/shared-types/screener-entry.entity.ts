export type ScreenerEntryEntity = {
  symbol: string;
  exchange: string;
  sector: string;
  industry: string;
  rsLine: number;
  rsLineSma50: number;
  rsLineSma200: number;
  fundamentalRating: number;
  averageDailyRange: number;
  numberOfDaysUntilNextEarningCall: number;
};
