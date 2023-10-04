import React from 'react'
import {Grid} from '@mui/material'
import {RelativeStrengthRating} from './RelativeStrengthRating'
import {ReturnOnEquity} from './ReturnOnEquity'
import {OutstandingShares} from './OutstandingShares'
import {FundamentalRating} from "./FundamentalRating.tsx";

export interface Props {
   symbol: string
   itemCol?: number
   size?: 'sm' | 'md'
}

export const VitalSection: React.FunctionComponent<Props> = ({
   symbol,
   itemCol = 6,
   size = 'sm',
}: Props) => {
   return (
      <Grid container>
         <Grid item xs={itemCol}>
            <RelativeStrengthRating symbol={symbol} size={size} />
         </Grid>
         <Grid item xs={itemCol}>
            {/*<EarningPerShareRating symbol={symbol} size={size} />*/}
            <FundamentalRating symbol={symbol} size={size} />
         </Grid>
         <Grid item xs={itemCol}>
            <ReturnOnEquity symbol={symbol} size={size} />
         </Grid>
         <Grid item xs={itemCol}>
            <OutstandingShares symbol={symbol} size={size} />
         </Grid>
      </Grid>
   )
}

export default VitalSection
