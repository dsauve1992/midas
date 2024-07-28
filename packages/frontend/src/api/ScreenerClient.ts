import { MidasBackendClient } from "./MidasBackendClient.ts";
import { NewScreenerEntryFrontendDto } from "backend/src/shared-types/new-screener-entry-frontend.dto";

export class ScreenerClient extends MidasBackendClient {
  public async query(): Promise<NewScreenerEntryFrontendDto[]> {
    const response = await this.get<NewScreenerEntryFrontendDto[]>(
      `${this.getBaseUrl()}/screener`,
    );

    return response.data;
  }
}
