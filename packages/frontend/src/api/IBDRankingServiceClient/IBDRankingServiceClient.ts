import axios from 'axios'
import { get } from 'lodash'
import moment from 'moment'
import { IbdRankings } from '../../lib/RankingService'

class IBDRankingServiceClient {
   static async getCompanyRankings(symbol: string): Promise<IbdRankings> {
      const todayString = moment().format('YYYY-MM-DD')

      const rawData = await axios.post(
         'https://research.investors.com/services/ChartService.svc/GetData',
         {
            req: {
               Symbol: symbol,
               Type: 1,
               StartDate: todayString,
               EndDate: todayString,
               EnableBats: true,
            },
         }
      )

      const rsRating = get(rawData.data, 'GetDataResult.rSRating')!
      const epsRating = get(rawData.data, 'GetDataResult.ePSRating')!

      return {
         rsRating,
         epsRating,
      }
   }
}

export default IBDRankingServiceClient
