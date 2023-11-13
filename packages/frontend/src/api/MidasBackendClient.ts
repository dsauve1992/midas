import axios, {AxiosResponse} from "axios";
import {GetTokenSilentlyOptions, GetTokenSilentlyVerboseResponse} from "@auth0/auth0-spa-js";

export class MidasBackendClient {
    constructor(
        private authorizationTokenProvider: {
            (
                options: GetTokenSilentlyOptions & { detailedResponse: true }
            ): Promise<GetTokenSilentlyVerboseResponse>;
            (options?: GetTokenSilentlyOptions): Promise<string>;
            (options: GetTokenSilentlyOptions): Promise<
                GetTokenSilentlyVerboseResponse | string
            >;
        }
    ) {
    }

    protected getBaseUrl(): string {
        return `${import.meta.env.VITE_BACKEND_URL}`
    }

    protected async get<ResponseBody>(url: string, ): Promise<AxiosResponse<ResponseBody>> {
        const access_token = await this.authorizationTokenProvider()

        console.log(access_token)

        return axios.get(url, {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${access_token}`
            }
        });
    }

    protected async post<RequestBody, ResponseBody>(url: string, body: RequestBody): Promise<AxiosResponse<ResponseBody>> {
        const access_token = await this.authorizationTokenProvider()


        return axios.post(url, body, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
    }


}