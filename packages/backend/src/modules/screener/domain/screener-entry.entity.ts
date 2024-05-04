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

  hasGreatSetup(): boolean {
    const hasStrongRelativeStrength =
      this.rsLine > this.rsLineSma50 &&
      this.rsLineSma50 > this.rsLineSma200 &&
      this._5WeeksHigh === this._52WeeksHigh;
    const hasStrongADR = this.averageDailyRange >= 3;

    return hasStrongRelativeStrength && hasStrongADR;
  }
}
