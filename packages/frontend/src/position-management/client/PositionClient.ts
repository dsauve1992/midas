import { MidasBackendClient } from "../../api/MidasBackendClient.ts";
import {
  CreatePositionRequestDto,
  PositionModelDto,
} from "backend/src/shared-types/position";

export class PositionClient extends MidasBackendClient {
  async createPositionWish(request: CreatePositionRequestDto): Promise<void> {
    await this.post<CreatePositionRequestDto, void>(
      `${this.getBaseUrl()}/wish`,
      request,
    );
  }

  async getAll(): Promise<PositionModelDto[]> {
    return this.get<PositionModelDto[]>(`${this.getBaseUrl()}`).then(
      (result) => result.data,
    );
  }

  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/position`;
  }
}
