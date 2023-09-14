import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Helmet } from 'react-helmet'
import { Grid } from '@mui/material'
import { config, TickerPageTab } from './sections/tab.config'
import { TickerProfile } from './header/TickerProfile'
import { InvestorBusinessDailyVitalCard } from './header/InvestorBusinessDailyVitalCard'
import VitalSection from './header/vital/VitalSection'
import TradingViewTapeCard from '../../../ui/chart/TradingViewTapeCard'

const sx = { borderBottom: 1, borderColor: 'divider' }
const TickerPage: React.FunctionComponent = () => {
   const { id: symbol } = useParams<{ id: string }>()

   const [currentTab, setCurrentTab] = useState<TickerPageTab>(config[0].id)

   return (
      <div>
         <Helmet>
            <title>{symbol} - Minerva</title>
         </Helmet>

         <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default' }}
         >
            <Grid container sx={{ marginBottom: '40px' }}>
               <Grid item lg={6} md={12}>
                  <Grid container>
                     <Grid item xs={12} xl={6}>
                        <TickerProfile symbol={symbol} />
                     </Grid>
                     <Grid item xs={12} xl={6}>
                        <InvestorBusinessDailyVitalCard symbol={symbol} />
                     </Grid>
                  </Grid>
                  <VitalSection symbol={symbol} />
               </Grid>
               <Grid item lg={6} md={12}>
                  <TradingViewTapeCard symbol={symbol} />
               </Grid>
            </Grid>
            <TabContext value={currentTab}>
               <Box sx={sx}>
                  <TabList onChange={(event, value) => setCurrentTab(value)}>
                     {config.map(({ id, label }) => (
                        <Tab key={id} label={label} value={id} />
                     ))}
                  </TabList>
               </Box>
               {config.map(({ id, PanelComponent }) => (
                  <TabPanel key={id} value={id}>
                     <PanelComponent symbol={symbol} />
                  </TabPanel>
               ))}
            </TabContext>
         </Box>
      </div>
   )
}

export default TickerPage
