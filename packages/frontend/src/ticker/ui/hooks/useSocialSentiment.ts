import {useQuery} from 'react-query'
import type {SocialSentiment} from 'backend/src/shared-types/financial-modeling-prep'
import {StockClient} from "../../../api/StockClient.ts";
import {useAuth0} from "@auth0/auth0-react";

export const useSocialSentiment = (symbol: string) => {
   const {getAccessTokenSilently} = useAuth0()

   return useQuery<SocialSentiment[]>(['social-sentiment', symbol], () =>
       new StockClient(getAccessTokenSilently).getSocialSentiment(symbol)
   )
}
