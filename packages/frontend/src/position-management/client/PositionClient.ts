import { MidasBackendClient } from "../../api/MidasBackendClient.ts";

export class PositionClient extends MidasBackendClient {
  async createPositionWish(): Promise<void> {
    return; // TODO POST /position/wish { formData: PositionWishFormData }
  }

  protected getBaseUrl(): string {
    return `${super.getBaseUrl()}/position`;
  }
}
