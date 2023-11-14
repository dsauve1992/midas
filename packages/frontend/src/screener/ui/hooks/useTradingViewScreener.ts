import {useQuery} from 'react-query'
import {UseQueryResult} from 'react-query/types/react/types'
import {ScreenerClient} from '../../../api/ScreenerClient.ts'
import {orderBy} from "lodash";
import {useAuth0} from "@auth0/auth0-react";

export const useScreener = (): UseQueryResult<{ symbol:string, fundamentalRating: number, technicalRating: number }[]> => {
    const {getAccessTokenSilently} = useAuth0()

   return {
      ...useQuery<{ symbol:string, fundamentalRating: number,technicalRating: number }[]>([`screener`], () =>
         new ScreenerClient(getAccessTokenSilently).queryWithRatings(), {
            select: (data) => orderBy(data, ({technicalRating, fundamentalRating}) => technicalRating * fundamentalRating, "desc")
          }
      ),
   }
}
