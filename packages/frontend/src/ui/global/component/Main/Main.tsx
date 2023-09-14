import { Route, Switch } from 'react-router-dom'
import ScreenerPage from '../../../../screener/ui/ScreenerPage'
import TickerPage from '../../../../ticker/ui/TickerPage/TickerPage'
import { DashboardPage } from '../../../../ticker/ui/Dashboard/DashboardPage'
import { ToolsPage } from '../../../../tools/ToolsPage'
import { WatchListsPage } from '../../../../watchlist/ui/WatchListsPage'

export interface Props {}

const style = { padding: '40px' }
const Main = () => (
   <div style={style}>
      <Switch>
         <Route exact path="/">
            <DashboardPage />
         </Route>
         <Route path="/ticker/:id">
            <TickerPage />
         </Route>
         <Route path="/screener">
            <ScreenerPage />
         </Route>
         <Route path="/tools">
            <ToolsPage />
         </Route>
         <Route path="/watchlists">
            <WatchListsPage />
         </Route>
      </Switch>
   </div>
)

export default Main
