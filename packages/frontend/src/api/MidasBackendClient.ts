import axios from "axios";
import {StockProfile} from "./financialModelingPrep/types.ts";

export class MidasBackendClient {
    protected static getBaseUrl(): string {
        return `${import.meta.env.VITE_BACKEND_URL}`
    }


    static async getCompanyGeneralInformation(symbol: string): Promise<StockProfile> {
        const {data} =  await axios.get<StockProfile>(
            `${this.getBaseUrl()}/stocks/${symbol}`
        )

        return data
    }
}