import { useIncomeStatement } from './useIncomeStatement'
import FinancialPeriod from '../../../lib/FinancialPeriod'
import {
   StatementSpec,
   useLastQuartersComparison,
} from './useLastQuartersComparison'

type UseFinancialPerformanceProps = {
   symbol: string
}

export const useFinancialQuarterlyPerformance = ({
   symbol,
}: UseFinancialPerformanceProps) => {
   const { data } = useIncomeStatement({
      symbol,
      frequency: FinancialPeriod.QUARTER,
   })
   const { [StatementSpec.EPS]: earnings, [StatementSpec.REVENUE]: revenues } =
      useLastQuartersComparison(data)

   return {
      earnings,
      revenues,
   }
}
