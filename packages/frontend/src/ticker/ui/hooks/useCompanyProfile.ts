import { useQuery } from 'react-query'
import { StockProfile } from '../../../api/financialModelingPrep/types'
import FinancialModelingPrepClient from '../../../api/financialModelingPrep/FinancialModelingPrepClient'

export const useCompanyProfile = (symbol: string) =>
   useQuery<StockProfile>(
      ['company profile', { symbol }],
      () => FinancialModelingPrepClient.getInstance().getProfile(symbol),
      { notifyOnChangeProps: 'tracked' }
   )
