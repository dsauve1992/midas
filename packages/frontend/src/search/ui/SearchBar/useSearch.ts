import { useQuery } from 'react-query'
import FinancialModelingPrepClient from '../../../api/financialModelingPrep/FinancialModelingPrepClient'
import { SearchResult } from '../../../api/financialModelingPrep/types'

export const useSearch = (query: string) => {
   return useQuery<SearchResult[]>(
      ['search', query],
      () => FinancialModelingPrepClient.getInstance().search(query),
      { enabled: query.length >= 2 }
   )
}
