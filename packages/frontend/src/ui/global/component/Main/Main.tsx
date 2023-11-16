import {Route, Routes} from 'react-router-dom'
import ScreenerPage from '../../../../screener/ui/ScreenerPage'
import TickerPage from '../../../../ticker/ui/TickerPage/TickerPage'
import {DashboardPage} from '../../../../ticker/ui/Dashboard/DashboardPage'
import {ToolsPage} from '../../../../tools/ToolsPage'
import {WatchListsPage} from '../../../../watchlist/ui/WatchListsPage'

export interface Props {}

const style = { padding: '40px' }
const Main = () => (
   <div style={style}>
       <Routes>
         <Route path="/" element={<DashboardPage />}/>
         <Route path="/ticker/:id/*" element={<TickerPage />}/>
         <Route path="/screener" element={<ScreenerPage />}/>
         <Route path="/tools" element={<ToolsPage />}/>
         <Route path="/watchlists" element={<WatchListsPage />}/>
       </Routes>
   </div>
)

export default Main
