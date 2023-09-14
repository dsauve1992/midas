import { useQuery } from 'react-query'
import { InsiderTradingEvent } from '../../../api/financialModelingPrep/types'
import FinancialModelingPrepClient from '../../../api/financialModelingPrep/FinancialModelingPrepClient'

export const useInsiderTrading = (symbol: string) => {
   return useQuery(
      ['insider-trading', symbol],
      () => FinancialModelingPrepClient.getInstance().getInsiderTrading(symbol),
      {
         select: (data: InsiderTradingEvent[]) =>
            data.filter(({ transactionType }) =>
               ['S-Sale', 'P-Purchase'].includes(transactionType)
            ),
      }
   )
}
