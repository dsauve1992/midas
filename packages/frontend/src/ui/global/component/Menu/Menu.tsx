import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import {Button, Grid} from '@mui/material'
import {useHistory} from 'react-router-dom'
import SearchBar from '../../../../search/ui/SearchBar/SearchBar'
import {SearchResult} from '../../../../../../shared-types/financial-modeling-prep.d.ts'

const sx = {
   display: 'flex',
   alignItems: 'center',
   textAlign: 'center',
}
const sx3 = { flexGrow: 1 }
const sx1 = { minWidth: 100 }
const sx2 = { minWidth: 100 }
const Menu: React.FunctionComponent = () => {
   const history = useHistory()

   function searchHandler(stock: SearchResult) {
      history.push(`/ticker/${stock.symbol}`, stock)
   }

   function goToToolsPage() {
      history.push('/tools')
   }

   function gotToScreenPage() {
      history.push('/screener')
   }

   return (
      <Box sx={sx3}>
         <AppBar position="fixed">
            <Toolbar>
               <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
               >
                  <Grid item xs={8}>
                     <SearchBar onSelect={searchHandler} />
                  </Grid>
                  <Grid item xs={4}>
                     <Box sx={sx}>
                        <Button sx={sx1} variant="text" onClick={goToToolsPage}>
                           Tools
                        </Button>
                        <Button
                           sx={sx2}
                           variant="text"
                           onClick={gotToScreenPage}
                        >
                           Screener
                        </Button>
                     </Box>
                  </Grid>
               </Grid>
            </Toolbar>
         </AppBar>
      </Box>
   )
}

export default Menu
