import axios, {AxiosResponse} from "axios";

export class MidasBackendClient {
    constructor(
        private authorizationTokenProvider: () => Promise<string>
    ) {
    }

    protected getBaseUrl(): string {
        return `${import.meta.env.VITE_BACKEND_URL}`
    }

    protected async get<ResponseBody>(url: string, ): Promise<AxiosResponse<ResponseBody>> {
        const access_token = await this.authorizationTokenProvider()

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