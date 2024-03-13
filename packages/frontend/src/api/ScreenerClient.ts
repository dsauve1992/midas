import axios from "axios";
import _ from "lodash";
import { MidasBackendClient } from "./MidasBackendClient.ts";
import { ScreenerResponse } from "backend/src/shared-types/screener";
import {
  IndustryGroupTickerCollection,
  SectorTickerCollection,
} from "../screener/domain/NestedTickerCollection.ts";

export class ScreenerClient extends MidasBackendClient {
  public async query() {
    const response = await axios.get(`${this.getBaseUrl()}/screener`);
    return _.uniq(response.data) as string[];
  }

  public async queryHierarchy(): Promise<SectorTickerCollection[]> {
    const response = await this.get<ScreenerResponse>(
      `${this.getBaseUrl()}/screener/new`,
    );
    const data = response.data;

    return data.sectors.map(
      (sector) =>
        new SectorTickerCollection(
          sector.name,
          sector.index,
          sector.industryGroups.map(
            (group) =>
              new IndustryGroupTickerCollection(group.name, group.stocks),
          ),
        ),
    );
  }
}
