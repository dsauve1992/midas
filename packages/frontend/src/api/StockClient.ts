import { StockGeneralInformationResponseDto } from "backend/src/shared-types/response.dto";
import {
  EarningsSurprise,
  InsiderTradingEvent,
  SocialSentiment,
} from "backend/src/shared-types/financial-modeling-prep";
import { MidasBackendClient } from "./MidasBackendClient.ts";
import { InstitutionalOwnershipResponse } from "backend/src/shared-types/institutional-ownership";
import { IncomeStatementDto } from "backend/src/shared-types/income-statement";

export class StockClient extends MidasBackendClient {
  async getCompanyGeneralInformation(
    symbol: string,
  ): Promise<StockGeneralInformationResponseDto> {
    const { data } = await this.get<StockGeneralInformationResponseDto>(
      `${this.getStockUrl(symbol)}`,
    );

    return data;
  }

  async getSocialSentiment(symbol: string) {
    const { data } = await this.get<SocialSentiment[]>(
      `${this.getStockUrl(symbol)}/social-sentiment`,
    );

    return data;
  }

  async getEarningsSurprises(symbol: string) {
    const { data } = await this.get<EarningsSurprise[]>(
      `${this.getStockUrl(symbol)}/earnings-surprises`,
    );

    return data;
  }

  async getInsiderTrading(symbol: string) {
    const { data } = await this.get<InsiderTradingEvent[]>(
      `${this.getStockUrl(symbol)}/insider-trading`,
    );

    return data;
  }
  async getInstitutionalOwnership(symbol: string) {
    const { data } = await this.get<InstitutionalOwnershipResponse>(
      `${this.getStockUrl(symbol)}/institutional-ownership`,
    );

    return data;
  }

  async getQuarterlyIncomeStatement(symbol: string) {
    const { data } = await this.get<IncomeStatementDto[]>(
      `${this.getStockUrl(symbol)}/income-statement/quarterly`,
    );

    return data;
  }

  async getAnnuallyIncomeStatement(symbol: string) {
    const { data } = await this.get<IncomeStatementDto[]>(
      `${this.getStockUrl(symbol)}/income-statement/annually`,
    );

    return data;
  }

  private getStockUrl(symbol: string) {
    return `${this.getBaseUrl()}/stocks/${symbol}`;
  }
}
