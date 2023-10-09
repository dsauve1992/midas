import {useQuery} from 'react-query'
import FinancialModelingPrepClient from '../../../api/financialModelingPrep/FinancialModelingPrepClient'
import FinancialPeriod from '../../../lib/FinancialPeriod'
import type {IncomeStatementDto} from '../../../../../shared-types/financial-modeling-prep.d.ts'
import {IncomeStatementWithGrowthAndNetProfitMargin, mapData,} from './useFinancialHistory'

interface UseIncomeStatementProps {
   symbol: string
   frequency: FinancialPeriod
}

export const useIncomeStatement = ({
   symbol,
   frequency,
}: UseIncomeStatementProps) => {
   return useQuery<
      IncomeStatementDto[],
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
