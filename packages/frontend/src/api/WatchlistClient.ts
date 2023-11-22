import { MidasBackendClient } from "./MidasBackendClient.ts";

export class WatchlistClient extends MidasBackendClient {
  async fetch(): Promise<string[]> {
    return this.get<string[]>(`${this.getBaseUrl()}`).then(
      (result) => result.data,
    );
  }

  async addSymbol(symbol: string): Promise<void> {
    await this.post<{ symbol: string }, void>(`${this.getBaseUrl()}/add`, {
      symbol,
    });
  }

  async removeSymbol(symbol: string): Promise<void> {
    await this.post<{ symbol: string }, void>(`${this.getBaseUrl()}/remove`, {
      symbol,
    });
  }

  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/watchlist`;
  }
}
