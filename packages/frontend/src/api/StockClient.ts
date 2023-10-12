import axios from "axios";
import {StockGeneralInformationResponseDto} from "../../../backend/src/shared-types/response.dto";
import {
    EarningsSurprise,
    InsiderTradingEvent,
    SocialSentiment
} from "../../../backend/src/shared-types/financial-modeling-prep";
import {MidasBackendClient} from "./MidasBackendClient.ts";
import {InstitutionalOwnershipResponse} from "../../../backend/src/shared-types/institutional-ownership";
import {IncomeStatementDto} from "../../../backend/src/shared-types/income-statement";

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
        const {data} = await axios.get<EarningsSurprise[]>(
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

    static async getQuarterlyIncomeStatement(symbol: string) {
        const {data} = await axios.get<IncomeStatementDto[]>(
            `${this.getStockUrl(symbol)}/income-statement/quarterly`
        )

        return data;
    }

    static async getAnnuallyIncomeStatement(symbol: string) {
        const {data} = await axios.get<IncomeStatementDto[]>(
            `${this.getStockUrl(symbol)}/income-statement/annually`
        )

        return data;
    }


    private static getStockUrl(symbol: string) {
        return `${this.getBaseUrl()}/stocks/${symbol}`;
    }
}