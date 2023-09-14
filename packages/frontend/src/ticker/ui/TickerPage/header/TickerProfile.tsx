import React from 'react'
import TickerTitle from './TickerTitle'
import TickerFamily from './TickerFamily'
import { useCompanyProfile } from '../../hooks/useCompanyProfile'

type TickerProfileProps = {
   symbol: string
}

export function TickerProfile({ symbol }: TickerProfileProps) {
   const { isLoading: profileLoading, data: profile } =
      useCompanyProfile(symbol)

   if (profileLoading) {
      return <p>Please wait...</p>
   }

   return profile ? (
      <>
         <TickerTitle profile={profile} />
         <TickerFamily profile={profile} />
      </>
   ) : null
}
