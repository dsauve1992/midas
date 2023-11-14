import {useQuery} from 'react-query'
import type {SearchResult} from 'backend/src/shared-types/financial-modeling-prep'
import {SearchClient} from "../../../api/SearchClient.ts";
import {useAuth0} from "@auth0/auth0-react";

export const useSearch = (query: string) => {
   const {getAccessTokenSilently} = useAuth0()

   return useQuery<SearchResult[]>(
      ['search', query],
      () => new SearchClient(getAccessTokenSilently).search(query),
      { enabled: query.length >= 2 }
   )
}
