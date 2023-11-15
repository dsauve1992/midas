import {useMemo} from 'react'
import {chain} from 'lodash'
import {AggregateHolding} from "backend/src/shared-types/institutional-ownership";

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
