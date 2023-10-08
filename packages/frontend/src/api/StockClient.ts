import axios from "axios";
import {StockGeneralInformationResponseDto} from "../../../shared-types/response.dto";
import {InsiderTradingEvent, SocialSentiment} from "../../../shared-types/financial-modeling-prep";
import {MidasBackendClient} from "./MidasBackendClient.ts";
import {InstitutionalOwnershipResponse} from "../../../shared-types/institutional-ownership";

export class StockClient extends MidasBackendClient{

    static async getCompanyGeneralInformation(symbol: string): Promise<StockGeneralInformationResponseDto> {
        const {data} =  await axios.get<StockGeneralInformationResponseDto>(
            `${this.getStockUrl(symbol)}`
        )

        return data
    }

    static async getSocialSentiment(symbol: string) {
        const {data} = await axios.get<SocialSentiment[]>(
            `${this.getStockUrl(symbol)}/social-sentiment`
        )

        return data;
    }

    static async getEarningsSurprises(symbol: string) {
        const {data} = await axios.get<SocialSentiment[]>(
            `${this.getStockUrl(symbol)}/earnings-surprises`
        )

        return data;
    }

    static async getInsiderTrading(symbol: string) {
        const {data} = await axios.get<InsiderTradingEvent[]>(
            `${this.getStockUrl(symbol)}/insider-trading`
        )

        return data;
    }
    static async getInstitutionalOwnership(symbol: string) {
        const {data} = await axios.get<InstitutionalOwnershipResponse>(
            `${this.getStockUrl(symbol)}/institutional-ownership`
        )

        return data;
    }


    private static getStockUrl(symbol: string) {
        return `${this.getBaseUrl()}/stocks/${symbol}`;
    }
}