import axios from "axios";
import { MidasBackendClient } from "./MidasBackendClient.ts";
import { SearchTickerResult } from "backend/src/shared-types/financial-modeling-prep";

export class SearchClient extends MidasBackendClient {
  async search(query: string): Promise<SearchTickerResult[]> {
    const { data } = await axios.get<SearchTickerResult[]>(
      `${this.getSearchUrl()}?query=${query}`,
    );

    return data;
  }

  private getSearchUrl() {
    return `${this.getBaseUrl()}/search`;
  }
}
