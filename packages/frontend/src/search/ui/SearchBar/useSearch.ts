import {useQuery} from 'react-query'
import type {SearchResult} from 'backend/src/shared-types/financial-modeling-prep'
import {SearchClient} from "../../../api/SearchClient.ts";
import {useApiClientInstance} from "../../../api/useApiClient.ts";

export const useSearch = (query: string) => {
   const instance = useApiClientInstance(SearchClient)

   return useQuery<SearchResult[]>(
      ['search', query],
      () => instance.search(query),
      { enabled: query.length >= 2 }
   )
}
