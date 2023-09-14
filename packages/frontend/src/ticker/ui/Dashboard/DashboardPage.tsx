import { Grid } from '@mui/material'
import TradingViewTapeCard from '../../../ui/chart/TradingViewTapeCard'

type Group = {
   name: string
   ticker?: string
}

type PrimaryGroup = Group & {
   secondaryGroups?: Group[]
}

type IndustryGroups = {
   leading: PrimaryGroup[]
   middle: PrimaryGroup[]
   lagging: PrimaryGroup[]
}

const INDUSTRY_GROUPS: IndustryGroups = {
   leading: [
      { name: 'utilities', ticker: 'XLU' },
      { name: 'financials', ticker: 'XLF' },
      { name: 'reits', ticker: 'XLRE' },
      { name: 'homebuilders', ticker: 'XHB' },
      { name: 'container and packaging' },
      { name: 'consumer non-durables', ticker: 'XLP' },
      { name: 'transport', ticker: 'XTN' },
   ],
   middle: [
      { name: 'retailers', ticker: 'XRT' },
      { name: 'manufacturers', ticker: 'XLI' },
      { name: 'healthcare', ticker: 'XLV' },
      { name: 'consumer durables', ticker: 'XLY' },
   ],
   lagging: [
      { name: 'mining', ticker: 'XME' },
      { name: 'oil', ticker: 'XES' },
      { name: 'coal', ticker: 'SPYX' },
      { name: 'oil drillers', ticker: 'XOP' },
      { name: 'basic industry', ticker: 'XLB' },
      { name: 'technology', ticker: 'XNTK' },
   ],
}

console.log(INDUSTRY_GROUPS)

export const DashboardPage = () => {
   return (
      <Grid container spacing={2}>
         <Grid item xs={12} height="600px">
            <TradingViewTapeCard symbol="XHB" />
         </Grid>
         <Grid item xs={12} height="600px">
            <TradingViewTapeCard symbol="S5UTIL" />
         </Grid>
         <Grid item xs={12} height="600px">
            <TradingViewTapeCard symbol="XLF" />
         </Grid>
         <Grid item xs={12} height="600px">
            <TradingViewTapeCard symbol="0L13" />
         </Grid>
      </Grid>
   )
}
