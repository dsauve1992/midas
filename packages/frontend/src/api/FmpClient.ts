import { MidasBackendClient } from "./MidasBackendClient.ts";

export class FmpClient extends MidasBackendClient {
  getAny<T>(url: string): Promise<T> {
    return this.get<T>(`${this.getBaseUrl()}${url}`).then(
      (response) => response.data,
    );
  }
}
