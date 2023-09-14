import { useQuery } from 'react-query'
import FinancialModelingPrepClient from '../../../api/financialModelingPrep/FinancialModelingPrepClient'
import { SocialSentiment } from '../../../api/financialModelingPrep/types'

export const useSocialSentiment = (symbol: string) => {
   return useQuery<SocialSentiment[]>(['social-sentiment', symbol], () =>
      FinancialModelingPrepClient.getInstance().getSocialSentiment(symbol)
   )
}
