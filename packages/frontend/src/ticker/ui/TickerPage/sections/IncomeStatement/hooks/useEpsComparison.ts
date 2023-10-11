import {useMemo} from 'react'
import _ from 'lodash'
import {MetricComparison} from '../MetricComparisonChart'
import {IncomeStatementWithGrowthAndNetProfitMargin} from '../../../../hooks/useIncomeStatement.ts'

export const useEpsComparison = (
   data?: IncomeStatementWithGrowthAndNetProfitMargin[],
   lastNEntry?: number
): MetricComparison[] => {
   return useMemo(() => {
      const sortedData = _.sortBy(data, 'calendarYear', 'asc')

      const allComparisons = sortedData.map((entry, index) => ({
         period: entry.calendarYear!,
         current: entry.revenue,
         previous: sortedData[index - 1]?.revenue,
         growth: entry.epsGrowth,
      }))

      if (lastNEntry && lastNEntry <= allComparisons.length) {
         return allComparisons.slice(-lastNEntry)
      }

      return allComparisons
   }, [data])
}
