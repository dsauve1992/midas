import { MidasBackendClient } from "../../api/MidasBackendClient.ts";
import { CreatePositionRequestDto } from "backend/src/shared-types/position";

export class PositionClient extends MidasBackendClient {
  async createPositionWish(request: CreatePositionRequestDto): Promise<void> {
    await this.post<CreatePositionRequestDto, void>(
      `${this.getBaseUrl()}/wish`,
      request,
    );
  }

  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/position`;
  }
}
