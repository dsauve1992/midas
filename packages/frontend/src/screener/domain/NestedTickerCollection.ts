import { ScreenerEntryFrontendDto } from "backend/src/shared-types/screener-entry-frontend.dto.ts";

export class IndustryGroupTickerCollection {
  constructor(
    readonly name: string,
    readonly tickers: ScreenerEntryFrontendDto[],
  ) {}
}

export class SectorTickerCollection {
  constructor(
    readonly name: string,
    readonly index: string | null,
    readonly industryGroups: IndustryGroupTickerCollection[],
  ) {}

  count(): number {
    return this.industryGroups.reduce((acc, curr) => {
      return acc + curr.tickers.length;
    }, 0);
  }
}
