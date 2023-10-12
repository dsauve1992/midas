import {useQuery} from 'react-query'
import TranscriptAPI from '../../../api/TranscriptAPI.ts'

export const useTranscriptHighlightAndTakeaway = (symbol: string) => {
   return useQuery<string>(['transcript-highlight-and-takeaway', symbol], () =>
      TranscriptAPI.getHighLightAndTakeaway(symbol)
   )
}
