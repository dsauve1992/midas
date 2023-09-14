import { useIncomeStatement } from './useIncomeStatement'
import FinancialPeriod from '../../../lib/FinancialPeriod'
import { useEpsComparison } from '../TickerPage/sections/IncomeStatement/hooks/useEpsComparison'

type UseEpsYearToYearPerformanceProps = {
   symbol: string
}

export const useEpsYearToYearPerformance = ({
   symbol,
}: UseEpsYearToYearPerformanceProps) => {
   const { data } = useIncomeStatement({
      symbol,
      frequency: FinancialPeriod.ANNUAL,
   })

   return useEpsComparison(data, 4)
}
