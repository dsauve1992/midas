import VitalCard from './VitalCard'
import {VitalCardStatus} from "./VitalCardStatus.ts";

export type ReturnOnEquityProps = {
   value?:number
   size?: 'sm' | 'md'
}

export const ReturnOnEquity = ({
                                  value,
   size = 'md',
}: ReturnOnEquityProps) => {

   return (
      <VitalCard
         size={size}
         status={
            (value || 0) > 0.05
               ? VitalCardStatus.SAFE
               : VitalCardStatus.WARNING
         }
         label="R.O.E"
      >
         {value?.toFixed(2) || '-'}
      </VitalCard>
   )
}
