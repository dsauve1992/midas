import {useQuery} from 'react-query'
import type {SocialSentiment} from '../../../../../shared-types/financial-modeling-prep.d.ts'
import {StockClient} from "../../../api/StockClient.ts";

export const useSocialSentiment = (symbol: string) => {
   return useQuery<SocialSentiment[]>(['social-sentiment', symbol], () =>
      StockClient.getSocialSentiment(symbol)
   )
}
