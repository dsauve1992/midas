import React from 'react'
import { useSharesFloat } from '../../../hooks/useSharesFloat'
import VitalCard, { VitalCardStatus } from './VitalCard'

export type OutstandingSharesProps = {
   symbol: string
   size?: 'sm' | 'md'
}

export const OutstandingShares = ({
   symbol,
   size = 'md',
}: OutstandingSharesProps) => {
   const { data: sharesFloat } = useSharesFloat(symbol)

   return (
      <VitalCard
         size={size}
         status={
            (sharesFloat?.outstandingShares || 0) < 100000000
               ? VitalCardStatus.SAFE
               : VitalCardStatus.WARNING
         }
         label="Out. Shares"
      >
         {sharesFloat?.outstandingShares.toLocaleString() || '-'}
      </VitalCard>
   )
}
