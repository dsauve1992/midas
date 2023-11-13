import {useQuery} from 'react-query'
import {StockClient} from "../../../api/StockClient.ts";
import FinancialPeriod from "../../../lib/FinancialPeriod.ts";
import {IncomeStatementDto} from "backend/src/shared-types/income-statement";
import {useAuth0} from "@auth0/auth0-react";

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
    const {getAccessTokenSilently} = useAuth0()

   return useQuery<IncomeStatementDto[]>(
      ['income-statement', symbol, period],
       () =>
           period === FinancialPeriod.QUARTER ?
           new StockClient(getAccessTokenSilently).getQuarterlyIncomeStatement(symbol):
           new StockClient(getAccessTokenSilently).getAnnuallyIncomeStatement(symbol)
   )
}
