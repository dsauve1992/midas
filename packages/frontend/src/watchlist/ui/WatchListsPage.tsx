import React, { useState } from 'react'
import {
   Card,
   CardContent,
   Grid,
   List,
   Step,
   StepLabel,
   Stepper,
} from '@mui/material'
import { TickerProfile } from '../../ticker/ui/TickerPage/header/TickerProfile'
import VitalSection from '../../ticker/ui/TickerPage/header/vital/VitalSection'
import TradingViewTapeCard from '../../ui/chart/TradingViewTapeCard'

const steps = [
   'Select master blaster campaign settings',
   'Create an ad group',
   'Create an ad',
]

export const WatchListsPage = () => {
   return (
      <List>
         {['AAPL', 'TSLA', 'POWL', 'CLFD'].map((el) => (
            <WatchListTicker symbol={el} key={el} />
         ))}
      </List>
   )
}

export const WatchListTicker = ({ symbol }: { symbol: string }) => {
   return (
      <Card>
         <CardContent sx={{ height: '450px' }}>
            <Grid container spacing={2} height="100%" alignItems="center">
               <Grid item xs={3} justifyContent="center">
                  <TickerProfile symbol={symbol} />
               </Grid>
               <Grid item xs={3}>
                  <VitalSection symbol={symbol} itemCol={12} size="sm" />
               </Grid>
               <Grid item xs={6} height="100%">
                  <TradingViewTapeCard symbol={symbol} />
               </Grid>
            </Grid>
         </CardContent>
      </Card>
   )
}

const WatchlistSelector = () => {
   const [currentStep, setCurrentStep] = useState<number>(0)
   return (
      <Stepper activeStep={currentStep} alternativeLabel>
         {steps.map((label, index) => (
            <Step key={label} onClick={() => setCurrentStep(index)}>
               <StepLabel>{label}</StepLabel>
            </Step>
         ))}
      </Stepper>
   )
}
