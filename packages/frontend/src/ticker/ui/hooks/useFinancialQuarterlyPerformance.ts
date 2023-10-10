import {StatementSpec, useLastQuartersComparison,} from './useLastQuartersComparison'
import {useQuarterlyIncomeStatement} from "./useQuarterlyIncomeStatement.ts";

type UseFinancialPerformanceProps = {
   symbol: string
}

export const useFinancialQuarterlyPerformance = ({
   symbol,
}: UseFinancialPerformanceProps) => {
   const { data } = useQuarterlyIncomeStatement(symbol)
   
   const { [StatementSpec.EPS]: earnings, [StatementSpec.REVENUE]: revenues } =
      useLastQuartersComparison(data)

   return {
      earnings,
      revenues,
   }
}
