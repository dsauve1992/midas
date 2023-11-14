import {useQuery} from 'react-query'
import TranscriptAPI from '../../../api/TranscriptAPI.ts'
import {useAuth0} from "@auth0/auth0-react";

export const useTranscriptHighlightAndTakeaway = (symbol: string) => {
   const {getAccessTokenSilently} = useAuth0()

   return useQuery<string>(['transcript-highlight-and-takeaway', symbol], () =>
      new TranscriptAPI(getAccessTokenSilently).getHighLightAndTakeaway(symbol)
   )
}
