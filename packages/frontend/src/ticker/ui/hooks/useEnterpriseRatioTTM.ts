import { useQuery } from 'react-query'
import { EnterpriseRatioTTM } from '../../../api/financialModelingPrep/types'
import FinancialModelingPrepClient from '../../../api/financialModelingPrep/FinancialModelingPrepClient'

export const useEnterpriseRatioTTM = (symbol: string) =>
   useQuery<EnterpriseRatioTTM>(['enterprise ratio', { symbol }], () =>
      FinancialModelingPrepClient.getInstance().getEnterpriseRatioTTM(symbol)
   )
