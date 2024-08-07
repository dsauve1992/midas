import { MidasBackendClient } from "./MidasBackendClient.ts";
import { WatchlistDto } from "backend/src/shared-types/watchlist.dto";

export class WatchlistClient extends MidasBackendClient {
  async createWatchlist(name: string): Promise<void> {
    await this.post<{ name: string }, void>(`${this.getBaseUrl()}`, {
      name,
    });
  }

  async getAll(): Promise<WatchlistDto[]> {
    return this.get<WatchlistDto[]>(`${this.getBaseUrl()}`).then(
      (result) => result.data,
    );
  }

  async addSymbol(watchlistId: string, symbol: string): Promise<void> {
    await this.post<{ symbol: string }, void>(
      `${this.getBaseUrl()}/${watchlistId}/add`,
      {
        symbol,
      },
    );
  }

  async deleteWatchlist(watchlistId: string): Promise<void> {
    await this.delete<void>(`${this.getBaseUrl()}/${watchlistId}`);
  }

  async removeSymbol(watchlistId: string, symbol: string): Promise<void> {
    await this.post<{ symbol: string }, void>(
      `${this.getBaseUrl()}/${watchlistId}/remove`,
      {
        symbol,
      },
    );
  }

  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/watchlist`;
  }
}
