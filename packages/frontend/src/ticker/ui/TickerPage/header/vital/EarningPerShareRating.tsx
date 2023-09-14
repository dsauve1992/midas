import { useCompanyRankings } from '../../../hooks/useCompanyRankings'
import VitalCard from './VitalCard'
import {VitalCardStatus} from "./VitalCardStatus.ts";

export type EarningPerShareRatingProps = {
   symbol: string
   size?: 'sm' | 'md'
}

export const EarningPerShareRating = ({
   symbol,
   size = 'sm',
}: EarningPerShareRatingProps) => {
   const { data: ibdRatings } = useCompanyRankings(symbol)

   return (
      <VitalCard
         label="EPS Rating"
         size={size}
         status={
            (ibdRatings?.epsRating || 0) > 80
               ? VitalCardStatus.SAFE
               : VitalCardStatus.WARNING
         }
      >
         {ibdRatings?.epsRating || '-'}
      </VitalCard>
   )
}
