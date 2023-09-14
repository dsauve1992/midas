import { useQuery } from 'react-query'
import FinancialModelingPrepClient from '../../../api/financialModelingPrep/FinancialModelingPrepClient'
import { EarningCallTranscript } from '../../../api/financialModelingPrep/types'

interface UseEarningCallTranscriptProps {
   symbol: string
   year: number
   quarter: number
   enabled?: boolean
}

export const useEarningCallTranscript = ({
   symbol,
   year,
   quarter,
   enabled = true,
}: UseEarningCallTranscriptProps) => {
   return useQuery<EarningCallTranscript[]>(
      ['earning-call-transcript', symbol, year, quarter],
      () =>
         FinancialModelingPrepClient.getInstance().getEarningCallTranscript(
            symbol,
            {
               quarter,
               year,
            }
         ),
      { enabled }
   )
}
