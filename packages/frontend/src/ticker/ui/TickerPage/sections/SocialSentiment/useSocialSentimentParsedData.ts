import { useMemo } from 'react'
import _ from 'lodash'
import moment from 'moment/moment'
import { SocialSentiment } from '../../../../../api/financialModelingPrep/types'

interface HistoricEntry {
   date: string
   value: number
}

interface MovingAverageEntry {
   date: string
   value: number | null
}

export const useSocialSentimentParsedData = (data: SocialSentiment[]) => {
   const historic: HistoricEntry[] = useMemo(() => {
      return _.chain(data)
         .groupBy((entry) =>
            moment(entry.date).startOf('week').format('DD/MM/YYYY')
         )
         .toPairs()
         .map(([date, groupData]) => ({
            date,
            value: _.meanBy(groupData, (entry) => entry.stocktwitsSentiment),
         }))
         .value()
         .reverse() as HistoricEntry[]
   }, [data])

   const sma: MovingAverageEntry[] = useMemo(() => {
      const PERIOD = 10

      // Ensure the collection is sorted by date in ascending order
      const smaResults: MovingAverageEntry[] = []

      for (let i = 0; i < historic.length; i++) {
         const { date } = historic[i]

         if (i < PERIOD - 1) {
            smaResults.push({ date, value: null })
         } else {
            let sum = 0
            for (let j = i - (PERIOD - 1); j <= i; j++) {
               sum += historic[j].value
            }
            const avg = sum / PERIOD

            smaResults.push({ date, value: avg })
         }
      }

      return smaResults
   }, [historic])

   return [historic, sma]
}
