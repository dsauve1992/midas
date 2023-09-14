import { useQuery } from 'react-query'
import FinancialModelingPrepClient from '../../../api/financialModelingPrep/FinancialModelingPrepClient'
import FinancialPeriod from '../../../lib/FinancialPeriod'
import { IncomeStatement } from '../../../api/financialModelingPrep/types'
import {
   IncomeStatementWithGrowthAndNetProfitMargin,
   mapData,
} from './useFinancialHistory'

interface UseIncomeStatementProps {
   symbol: string
   frequency: FinancialPeriod
}

export const useIncomeStatement = ({
   symbol,
   frequency,
}: UseIncomeStatementProps) => {
   return useQuery<
      IncomeStatement[],
      unknown,
      IncomeStatementWithGrowthAndNetProfitMargin[]
   >(
      ['income-statements', symbol, frequency],
      () =>
         FinancialModelingPrepClient.getInstance().getIncomeStatements(symbol, {
            period: frequency,
         }),
      {
         select: (data) =>
            mapData(
               frequency,
               data,
               undefined
            ) as IncomeStatementWithGrowthAndNetProfitMargin[],
      }
   )
}
