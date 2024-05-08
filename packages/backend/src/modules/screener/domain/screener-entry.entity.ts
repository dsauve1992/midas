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
    private _10emaHistory: number[],
    private _20emaHistory: number[],
  ) {}

  hasGreatSetup(): boolean {
    const hasStrongRelativeStrength =
      this.rsLine > this.rsLineSma50 && this.rsLineSma50 > this.rsLineSma200;

    const is10emaRising = this._10emaHistory[0] > this._10emaHistory[1];
    const is20emaRising = this._20emaHistory[0] > this._20emaHistory[1];

    const hasStrongADR = this.averageDailyRange >= 3;

    return (
      hasStrongRelativeStrength &&
      hasStrongADR &&
      is10emaRising &&
      is20emaRising
    );
  }
}
