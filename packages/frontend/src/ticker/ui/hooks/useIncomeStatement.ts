import {useQuery} from 'react-query'
import {StockClient} from "../../../api/StockClient.ts";
import FinancialPeriod from "../../../lib/FinancialPeriod.ts";
import {IncomeStatementDto} from "backend/src/shared-types/income-statement";
import {useApiClientInstance} from "../../../api/useApiClient.ts";

export type IncomeStatementWithGrowthAndNetProfitMargin = {
    date: string,
    period: string,
    calendarYear?: string,
    acceptedDate: string,
    eps: number,
    revenue: number,
   revenueGrowth: number
   epsGrowth: number
   netProfitMargin: number
}

export const useIncomeStatement = (symbol:string, period: FinancialPeriod) => {

    const instance = useApiClientInstance(StockClient)

    return useQuery<IncomeStatementDto[]>(
      ['income-statement', symbol, period],
       () =>
           period === FinancialPeriod.QUARTER ?
           instance.getQuarterlyIncomeStatement(symbol):
           instance.getAnnuallyIncomeStatement(symbol)
   )
}
