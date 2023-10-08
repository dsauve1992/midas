import {useQuery} from 'react-query'
import FinancialModelingPrepClient from '../../../api/financialModelingPrep/FinancialModelingPrepClient'
import type {SearchResult} from '../../../../../shared-types/financial-modeling-prep.d.ts'

export const useSearch = (query: string) => {
   return useQuery<SearchResult[]>(
      ['search', query],
      () => FinancialModelingPrepClient.getInstance().search(query),
      { enabled: query.length >= 2 }
   )
}
