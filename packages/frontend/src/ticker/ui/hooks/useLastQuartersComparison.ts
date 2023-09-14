import { orderBy } from 'lodash'
import { useMemo } from 'react'
import { IncomeStatementWithGrowthAndNetProfitMargin } from './useFinancialHistory'
import { MetricComparison } from '../TickerPage/sections/IncomeStatement/MetricComparisonChart'

export enum StatementSpec {
   EPS,
   REVENUE,
}

export type StatementSpecQuarterHistory = {
   [StatementSpec.EPS]: MetricComparison[]
   [StatementSpec.REVENUE]: MetricComparison[]
}

function buildEpsComparison(
   q0: IncomeStatementWithGrowthAndNetProfitMargin,
   q4: IncomeStatementWithGrowthAndNetProfitMargin
): MetricComparison {
   return {
      period: q0.period,
      current: q0.eps,
      previous: q4.eps,
      growth: q0.epsGrowth,
   }
}

function buildRevenueComparison(
   q0: IncomeStatementWithGrowthAndNetProfitMargin,
   q4: IncomeStatementWithGrowthAndNetProfitMargin
): MetricComparison {
   return {
      period: q0.period,
      current: q0.revenue,
      previous: q4.revenue,
      growth: q0.revenueGrowth,
   }
}

export const useLastQuartersComparison = (
   data?: IncomeStatementWithGrowthAndNetProfitMargin[]
): StatementSpecQuarterHistory & { error: boolean } => {
   const lastQuarters = useMemo(
      () =>
         orderBy(data, ['calendarYear', 'period'], ['desc', 'desc']).slice(
            0,
            8
         ),
      [data]
   )

   const error = useMemo(
      () =>
         lastQuarters.length < 8 ||
         lastQuarters[0].period !== lastQuarters[4].period ||
         lastQuarters[1].period !== lastQuarters[5].period ||
         lastQuarters[2].period !== lastQuarters[6].period ||
         lastQuarters[3].period !== lastQuarters[7].period,
      [lastQuarters]
   )

   const lastQuartersComparisons = useMemo<StatementSpecQuarterHistory>(() => {
      if (error) {
         return {
            [StatementSpec.EPS]: [],
            [StatementSpec.REVENUE]: [],
         }
      }

      const [q0, q1, q2, q3, q4, q5, q6, q7] = lastQuarters

      return {
         [StatementSpec.EPS]: [
            buildEpsComparison(q0, q4),
            buildEpsComparison(q1, q5),
            buildEpsComparison(q2, q6),
            buildEpsComparison(q3, q7),
         ].reverse(),
         [StatementSpec.REVENUE]: [
            buildRevenueComparison(q0, q4),
            buildRevenueComparison(q1, q5),
            buildRevenueComparison(q2, q6),
            buildRevenueComparison(q3, q7),
         ].reverse(),
      }
   }, [lastQuarters])

   return {
      ...lastQuartersComparisons,
      error,
   }
}
