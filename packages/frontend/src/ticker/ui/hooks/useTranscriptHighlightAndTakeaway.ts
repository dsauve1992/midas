import {useQuery} from 'react-query'
import TranscriptClient from '../../../api/TranscriptClient.ts'
import {useApiClientInstance} from "../../../api/useApiClient.ts";

export const useTranscriptHighlightAndTakeaway = (symbol: string) => {
   const instance = useApiClientInstance(TranscriptClient)

   return useQuery<string>(['transcript-highlight-and-takeaway', symbol], () =>
       instance.getHighLightAndTakeaway(symbol)
   )
}
