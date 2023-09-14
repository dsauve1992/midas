import React from 'react'
import { useCompanyRankings } from '../../../hooks/useCompanyRankings'
import VitalCard, { VitalCardStatus } from './VitalCard'

export type RelativeStrengthRatingProps = {
   symbol: string
   size?: 'sm' | 'md'
}

export const RelativeStrengthRating = ({
   symbol,
   size = 'sm',
}: RelativeStrengthRatingProps) => {
   const { data: ibdRatings } = useCompanyRankings(symbol)

   return (
      <VitalCard
         label="RS Rating"
         size={size}
         status={
            (ibdRatings?.rsRating || 0) > 60
               ? VitalCardStatus.SAFE
               : VitalCardStatus.WARNING
         }
      >
         {ibdRatings?.rsRating || '-'}
      </VitalCard>
   )
}
