import React from 'react'
import {Link} from 'react-router-dom'
import {Card, CardContent, Grid} from '@mui/material'
import {MetricComparisonChart} from '../../ticker/ui/TickerPage/sections/IncomeStatement/MetricComparisonChart'
import {TickerProfile} from '../../ticker/ui/TickerPage/header/TickerProfile'
import TradingViewTapeCard from '../../ui/chart/TradingViewTapeCard'
import VitalSection from '../../ticker/ui/TickerPage/header/vital/VitalSection'
import {useFinancialQuarterlyPerformance} from '../../ticker/ui/hooks/useFinancialQuarterlyPerformance'

export interface Props {
   symbol: string
}

const style = { marginBottom: '15px' }

export const ScreenerEntryCard: React.FunctionComponent<Props> = ({
   symbol,
}) => {
   const { earnings, revenues } = useFinancialQuarterlyPerformance({ symbol })

   return (
      <Card style={style}>
         <CardContent>
            <Grid container spacing={2}>
               <Grid item xs={4}>
                  <Grid container spacing={3}>
                     <Grid item xs={12}>
                        <Link
                           href={`/ticker/${symbol}`}
                           to={`/ticker/${symbol}`}
                        >
                           See Detail...
                        </Link>
                     </Grid>
                     <Grid item xs={12}>
                        <TickerProfile symbol={symbol} />
                     </Grid>
                     <Grid item xs={12}>
                        <VitalSection symbol={symbol} />
                     </Grid>
                     <Grid item xs={12} sx={{ height: '300px' }}>
                        {earnings.length && (
                           <MetricComparisonChart
                              key={symbol}
                              title="E.P.S"
                              data={earnings}
                           />
                        )}
                     </Grid>
                     <Grid item xs={12} sx={{ height: '300px' }}>
                        {revenues.length && (
                           <MetricComparisonChart
                              title="Revenue"
                              key={symbol}
                              data={revenues}
                           />
                        )}
                     </Grid>
                  </Grid>
               </Grid>
               <Grid item xs={8}>
                  <Grid container spacing={2}>
                     <Grid item xs={12} sx={{ height: '1000px !important' }}>
                        <TradingViewTapeCard symbol={symbol} />
                     </Grid>
                  </Grid>
               </Grid>
            </Grid>
         </CardContent>
      </Card>
   )
}
