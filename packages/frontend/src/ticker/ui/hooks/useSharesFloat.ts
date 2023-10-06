import {useQuery} from 'react-query'
import {SharesFloat} from '../../../../../shared-types/financial-modeling-prep.d.ts'
import FinancialModelingPrepClient from '../../../api/financialModelingPrep/FinancialModelingPrepClient'

export const useSharesFloat = (symbol: string) =>
   useQuery<SharesFloat>(
      ['shares float', { symbol }],
      () => FinancialModelingPrepClient.getInstance().getSharesFloat(symbol),
      {
         notifyOnChangeProps: 'tracked',
      }
   )
