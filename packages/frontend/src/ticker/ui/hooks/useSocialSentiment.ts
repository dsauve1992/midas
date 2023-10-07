import {useQuery} from 'react-query'
import type {SocialSentiment} from '../../../../../shared-types/financial-modeling-prep.d.ts'
import {MidasBackendClient} from "../../../api/MidasBackendClient.ts";


export const useSocialSentiment = (symbol: string) => {
   return useQuery<SocialSentiment[]>(['social-sentiment', symbol], () =>
      MidasBackendClient.getSocialSentiment(symbol)
   )
}
