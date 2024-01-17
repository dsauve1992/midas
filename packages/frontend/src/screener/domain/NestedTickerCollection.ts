import { ScreenerEntryEntity } from "backend/src/shared-types/screener-entry.entity";

export interface NestedTickerCollection {
  name: string;
  count(): number;
  listEntities(): ScreenerEntryEntity[];
  children(): NestedTickerCollection[] | ScreenerEntryEntity[];
}

export class IndustryGroupTickerCollection implements NestedTickerCollection {
  private _name: string;
  private tickers: ScreenerEntryEntity[];

  constructor(name: string, tickers: ScreenerEntryEntity[]) {
    this._name = name;
    this.tickers = tickers;
  }

  children(): NestedTickerCollection[] | ScreenerEntryEntity[] {
    return this.listEntities();
  }

  count(): number {
    return this.tickers.length;
  }

  listEntities(): ScreenerEntryEntity[] {
    return this.tickers;
  }

  get name(): string {
    return this._name;
  }
}

export class SectorTickerCollection implements NestedTickerCollection {
  private _name: string;
  private _index: string | null;
  private industryGroups: IndustryGroupTickerCollection[];

  constructor(
    name: string,
    index: string | null,
    industryGroups: IndustryGroupTickerCollection[],
  ) {
    this._name = name;
    this._index = index;
    this.industryGroups = industryGroups;
  }

  children(): IndustryGroupTickerCollection[] {
    return this.industryGroups;
  }

  count(): number {
    return this.listEntities().length;
  }

  listEntities(): ScreenerEntryEntity[] {
    return this.industryGroups.reduce((acc, curr) => {
      return acc.concat(curr.listEntities());
    }, [] as ScreenerEntryEntity[]);
  }

  get name(): string {
    return this._name;
  }

  get index(): string | null {
    return this._index;
  }
}
