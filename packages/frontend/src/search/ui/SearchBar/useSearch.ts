import {useQuery} from 'react-query'
import type {SearchResult} from '../../../../../shared-types/financial-modeling-prep.d.ts'
import {SearchClient} from "../../../api/SearchClient.ts";

export const useSearch = (query: string) => {
   return useQuery<SearchResult[]>(
      ['search', query],
      () => SearchClient.search(query),
      { enabled: query.length >= 2 }
   )
}
