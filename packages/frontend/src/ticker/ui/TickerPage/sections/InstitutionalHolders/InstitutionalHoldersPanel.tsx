import React from 'react'
import {Grid} from '@mui/material'
import {InstitutionalOwnershipHistoryByQuarter} from './InstitutionalOwnershipHistoryByQuarter'
import {InstitutionalOwnershipPieChart} from './InstitutionalOwnershipPieChart'
import {InstitutionalOwnershipHistoryByShareholders} from './InstitutionalOwnershipHistoryByShareholders'
import {useInstitutionalOwnership} from "../../../hooks/useInstitutionalOwnership.ts";

export interface Props {
   symbol: string
}

const InstitutionalHoldersPanel: React.FunctionComponent<Props> = ({
   symbol,
}: Props) => {
   const { data, isLoading } = useInstitutionalOwnership(symbol)

   if (isLoading) {
      return <p>Please wait ...</p>
   }

   const {history, topShareholders} = data!

   return history?.length && topShareholders?.length ? (
      <Grid container spacing={2}>
         <Grid item xs={9}>
            <InstitutionalOwnershipHistoryByQuarter history={history} />
         </Grid>
         <Grid item xs={3}>
            <InstitutionalOwnershipPieChart data={topShareholders} />
         </Grid>
         <Grid item xs={12}>
            <InstitutionalOwnershipHistoryByShareholders data={topShareholders} />
         </Grid>
      </Grid>
   ) : (
      <p>There is no institutional holder data for {symbol}</p>
   )
}

export default InstitutionalHoldersPanel
