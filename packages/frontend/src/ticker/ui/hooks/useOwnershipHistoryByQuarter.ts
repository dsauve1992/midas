import { useMemo } from 'react'
import { chain } from 'lodash'
import { AggregateHolding } from '../../../api/ownership/type'

export type OwnershipByQuarter = {
   quarterOfYear: string
   year: number
   periodString: string
   sharesHeld: number
   sharesChangePercent: number
}

export const useOwnershipHistoryByQuarter = (
   data: AggregateHolding[]
): OwnershipByQuarter[] => {
   return useMemo(() => {
      return chain(data)
         .map((entry) => ({
            ...entry,
            periodString: `${entry.holdingPeriod.year}-${entry.holdingPeriod.quarterOfYear}`,
         }))
         .mapValues((value) => {
            return {
               periodString: value.periodString,
               ...value.holdingPeriod,
               sharesHeld: value.sharesHeld,
               sharesChangePercent: value.sharesChangePercent,
            }
         })
         .values()
         .value()
         .reverse()
   }, [data])
}
