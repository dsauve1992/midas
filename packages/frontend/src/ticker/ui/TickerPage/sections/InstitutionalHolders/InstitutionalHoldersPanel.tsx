import React from 'react'
import { Grid } from '@mui/material'
import { useOwnershipHistory } from '../../../hooks/useOwnershipHistory'
import { InstitutionalOwnershipHistoryByQuarter } from './InstitutionalOwnershipHistoryByQuarter'
import { InstitutionalOwnershipPieChart } from './InstitutionalOwnershipPieChart'
import { useTopShareholders } from '../../../hooks/useTopShareholders'
import { InstitutionalOwnershipHistoryByShareholders } from './InstitutionalOwnershipHistoryByShareholders'

export interface Props {
   symbol: string
}

const InstitutionalHoldersPanel: React.FunctionComponent<Props> = ({
   symbol,
}: Props) => {
   const { data: history, isLoading: isLoadingHistory } =
      useOwnershipHistory(symbol)
   const { data: shareholders, isLoading: isLoadingShareholders } =
      useTopShareholders(symbol)

   if (isLoadingHistory || isLoadingShareholders) {
      return <p>Please wait ...</p>
   }

   return history?.length && shareholders?.length ? (
      <Grid container spacing={2}>
         <Grid item xs={9}>
            <InstitutionalOwnershipHistoryByQuarter history={history} />
         </Grid>
         <Grid item xs={3}>
            <InstitutionalOwnershipPieChart data={shareholders} />
         </Grid>
         <Grid item xs={12}>
            <InstitutionalOwnershipHistoryByShareholders data={shareholders} />
         </Grid>
      </Grid>
   ) : (
      <p>There is no institutional holder data for {symbol}</p>
   )
}

export default InstitutionalHoldersPanel
