import {useQuery} from 'react-query'
import {UseQueryResult} from 'react-query/types/react/types'
import {ScreenerClient} from '../../../api/ScreenerClient.ts'
import {orderBy} from "lodash";
import {useApiClientInstance} from "../../../api/useApiClient.ts";

export const useScreener = (): UseQueryResult<{ symbol:string, fundamentalRating: number, technicalRating: number }[]> => {
    const instance = useApiClientInstance(ScreenerClient)

    return {
      ...useQuery<{ symbol:string, fundamentalRating: number,technicalRating: number }[]>([`screener`], () =>
          instance.queryWithRatings(), {
            select: (data) => orderBy(data, ({technicalRating, fundamentalRating}) => technicalRating * fundamentalRating, "desc")
          }
      ),
   }
}
