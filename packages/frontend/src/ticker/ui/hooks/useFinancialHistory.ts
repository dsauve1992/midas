import {useQuery} from 'react-query'
import FinancialPeriod from '../../../lib/FinancialPeriod'
import type {EnterpriseRatio, IncomeStatement} from '../../../../../shared-types/financial-modeling-prep.d.ts'
import {computeGrowth} from '../../../lib/utils'
import FinancialModelingPrepClient from '../../../api/financialModelingPrep/FinancialModelingPrepClient'

export interface UseFinancialHistoryProps {
   symbol: string
   frequency: FinancialPeriod
}

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

const client = FinancialModelingPrepClient.getInstance()

export const useFinancialHistory = ({
   symbol,
   frequency,
}: UseFinancialHistoryProps) => {
   return useQuery<IncomeStatementWithGrowthAndNetProfitMargin[]>(
      ['financial-history', symbol, frequency],
      async () => {
         const incomeStatements = await client.getIncomeStatements(symbol, {
            period: frequency,
         })
         const enterpriseRatios = await client.getEnterpriseRatios(symbol, {
            period: frequency,
         })

         return mapData(frequency, incomeStatements, enterpriseRatios)
      }
   )
}

export function mapData(
   frequency: FinancialPeriod,
   incomeStatements: IncomeStatement[] | undefined,
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
