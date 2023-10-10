import {useQuery} from 'react-query'
import FinancialPeriod from '../../../lib/FinancialPeriod'
import {StockClient} from "../../../api/StockClient.ts";
import {EnterpriseRatio, IncomeStatementDto} from "../../../../../shared-types/financial-modeling-prep";
import {computeGrowth} from "../../../lib/utils.ts";
import {QuarterlyIncomeStatementDto as BackendIncomeStatementDto} from "../../../../../shared-types/income-statement";

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

export const useQuarterlyIncomeStatement = (symbol:string) => {
   return useQuery<BackendIncomeStatementDto[]>(
      ['financial-history', symbol],
       () =>
          StockClient.getQuarterlyIncomeStatement(symbol)
   )
}

export function mapData(
   frequency: FinancialPeriod,
   incomeStatements: IncomeStatementDto[] | undefined,
   enterpriseRatios: EnterpriseRatio[] | undefined
): IncomeStatementWithGrowthAndNetProfitMargin[] {
   return incomeStatements
      ? incomeStatements.map((value, index) => ({
           revenueGrowth: computeGrowth(
              value.revenue,
              incomeStatements[
                 index + (frequency === FinancialPeriod.QUARTER ? 4 : 1)
              ]?.revenue
           ),
           epsGrowth: computeGrowth(
              value.epsdiluted,
              incomeStatements[
                 index + (frequency === FinancialPeriod.QUARTER ? 4 : 1)
              ]?.epsdiluted
           ),
           netProfitMargin:
              enterpriseRatios?.find(({ date }) => date === value.date)
                 ?.netProfitMargin || NaN,
           ...value,
        }))
      : []
}
