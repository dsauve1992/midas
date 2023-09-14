import { useQuery } from 'react-query'
import { SharesFloat } from '../../../api/financialModelingPrep/types'
import FinancialModelingPrepClient from '../../../api/financialModelingPrep/FinancialModelingPrepClient'

export const useSharesFloat = (symbol: string) =>
   useQuery<SharesFloat>(
      ['shares float', { symbol }],
      () => FinancialModelingPrepClient.getInstance().getSharesFloat(symbol),
      {
         notifyOnChangeProps: 'tracked',
      }
   )
