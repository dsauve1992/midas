import axios from "axios";
import {StockGeneralInformationResponseDto} from "../../../shared-types/response.dto";
import {SocialSentiment} from "../../../shared-types/financial-modeling-prep";

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

    static async getSocialSentiment(symbol: string) {
        const {data} = await axios.get<SocialSentiment[]>(
            `${this.getBaseUrl()}/stocks/${symbol}/social-sentiment`
        )

        return data;
    }
}