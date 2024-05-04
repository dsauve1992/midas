export class ScreenerEntryEntity {
  constructor(
    readonly symbol: string,
    readonly exchange: string,
    readonly sector: string,
    readonly industry: string,
    readonly rsLine: number,
    readonly rsLineSma50: number,
    readonly rsLineSma200: number,
    readonly fundamentalRating: number,
    readonly averageDailyRange: number,
    readonly numberOfDaysUntilNextEarningCall: number,
    readonly _5WeeksHigh: number,
    readonly _52WeeksHigh: number,
  ) {}
}
