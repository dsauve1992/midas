import React from 'react'
import { useEnterpriseRatioTTM } from '../../../hooks/useEnterpriseRatioTTM'
import VitalCard, { VitalCardStatus } from './VitalCard'

export type ReturnOnEquityProps = {
   symbol: string
   size?: 'sm' | 'md'
}

export const ReturnOnEquity = ({
   symbol,
   size = 'md',
}: ReturnOnEquityProps) => {
   const { data: ratios } = useEnterpriseRatioTTM(symbol)

   return (
      <VitalCard
         size={size}
         status={
            (ratios?.returnOnEquityTTM || 0) > 0.05
               ? VitalCardStatus.SAFE
               : VitalCardStatus.WARNING
         }
         label="R.O.E"
      >
         {ratios?.returnOnEquityTTM?.toFixed(2) || '-'}
      </VitalCard>
   )
}
