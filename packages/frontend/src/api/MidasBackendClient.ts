import axios from "axios";
import {StockGeneralInformationResponseDto} from "../../../shared-types/response.dto";

export class MidasBackendClient {
    protected static getBaseUrl(): string {
        return `${import.meta.env.VITE_BACKEND_URL}`
    }


    static async getCompanyGeneralInformation(symbol: string): Promise<StockGeneralInformationResponseDto> {
        const {data} =  await axios.get<StockGeneralInformationResponseDto>(
            `${this.getBaseUrl()}/stocks/${symbol}`
        )

        return data
    }
}