import axios from "axios";
import _ from "lodash";
import { MidasBackendClient } from "./MidasBackendClient.ts";

export type ScreenerEntry = {
  symbol: string;
  fundamentalRating: number;
  averageDailyRange: number;
  numberOfDaysUntilNextEarningCall: number | null;
};

export class ScreenerClient extends MidasBackendClient {
  public async query() {
    const response = await axios.get(`${this.getBaseUrl()}/screener`);
    return _.uniq(response.data) as string[];
  }

  public async queryWithRatings() {
    const response = await this.get<ScreenerEntry[]>(
      `${this.getBaseUrl()}/screener/with-rating`,
    );
    return _.uniq(response.data);
  }
}
