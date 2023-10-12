import _ from 'lodash'
import {useMemo} from 'react'
import {computeGrowth} from '../../../../../../lib/utils'
import {MetricComparison} from '../../IncomeStatement/MetricComparisonChart'
import type {EarningsSurprise} from '../../../../../../../../shared-types/financial-modeling-prep.d.ts'

export const useEarningSurprisesComparison = (
   data: EarningsSurprise[],
   lastNEntry?: number
): MetricComparison[] => {
   return useMemo(() => {
      const sortedData = _.sortBy(data, 'date', 'asc')

      // FIXME : Backend ?
      const allComparisons = sortedData.map((entry) => ({
         period: entry.date!,
         current: entry.actualEarningResult,
         previous: entry.estimatedEarning,
         growth: computeGrowth(
            entry.actualEarningResult,
            entry.estimatedEarning
         ),
      }))

      if (lastNEntry && lastNEntry <= allComparisons.length) {
         return allComparisons.slice(-lastNEntry)
      }

      return allComparisons
   }, [data])
}
