import { useQuery } from 'react-query'
import FinancialModelingPrepClient from '../../../api/financialModelingPrep/FinancialModelingPrepClient'

export const useEarningSurprises = (symbol: string) => {
   return useQuery(['earning-surprises', symbol], () =>
      FinancialModelingPrepClient.getInstance().getEarningsSurprises(symbol)
   )
}
