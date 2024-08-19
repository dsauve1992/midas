import { StockGeneralInformationResponseDto } from "backend/src/shared-types/response.dto";
import {
  EarningsSurprise,
  InsiderTradingEvent,
  PriceTargetRecord,
  RealTimePrice,
} from "backend/src/shared-types/financial-modeling-prep";
import { MidasBackendClient } from "./MidasBackendClient.ts";
import { InstitutionalOwnershipResponse } from "backend/src/shared-types/institutional-ownership";
import { FinancialRecordDto } from "backend/src/shared-types/income-statement";

export class StockClient extends MidasBackendClient {
  async getCompanyGeneralInformation(
    symbol: string,
  ): Promise<StockGeneralInformationResponseDto> {
    const { data } = await this.get<StockGeneralInformationResponseDto>(
      `${this.getStockUrl(symbol)}`,
    );

    return data;
  }

  async getEarningsSurprises(symbol: string) {
    const { data } = await this.get<EarningsSurprise[]>(
      `${this.getStockUrl(symbol)}/earnings-surprises`,
    );

    return data;
  }

  async getPriceTarget(symbol: string) {
    const { data } = await this.get<PriceTargetRecord[]>(
      `${this.getStockUrl(symbol)}/price-target`,
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
    const { data } = await this.get<FinancialRecordDto[]>(
      `${this.getStockUrl(symbol)}/income-statement/quarterly`,
    );

    return data;
  }

  async getAnnuallyIncomeStatement(symbol: string) {
    const { data } = await this.get<FinancialRecordDto[]>(
      `${this.getStockUrl(symbol)}/income-statement/annually`,
    );

    return data;
  }

  async getAnnuallyIncomeStatementV2(symbol: string) {
    const { data } = await this.get<FinancialRecordDto[]>(
      `${this.getStockUrl(symbol)}/income-statement/annually-2`,
    );

    return data.reverse();
  }

  async getRealTimePrice(symbol: string) {
    const { data } = await this.get<RealTimePrice>(
      `${this.getStockUrl(symbol)}/real-time-price`,
    );

    return data;
  }

  private getStockUrl(symbol: string) {
    return `${this.getBaseUrl()}/stocks/${symbol}`;
  }
}
