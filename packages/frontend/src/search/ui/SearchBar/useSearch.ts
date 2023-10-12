import {useQuery} from 'react-query'
import type {SearchResult} from 'backend/src/shared-types/financial-modeling-prep'
import {SearchClient} from "../../../api/SearchClient.ts";

export const useSearch = (query: string) => {
   return useQuery<SearchResult[]>(
      ['search', query],
      () => SearchClient.search(query),
      { enabled: query.length >= 2 }
   )
}
