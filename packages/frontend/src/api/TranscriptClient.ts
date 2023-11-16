import axios from 'axios'
import {MidasBackendClient} from "./MidasBackendClient.ts";

class TranscriptClient extends MidasBackendClient{
    async getSummary(symbol: string): Promise<string> {
      return this.fetch(symbol, 'SUMMARY')
   }

    async getHighLightAndTakeaway(symbol: string): Promise<string> {
      return this.fetch(symbol, 'HIGHLIGHT_AND_TAKEAWAY')
   }

    async getGuidanceAndOutlook(symbol: string): Promise<string> {
      return this.fetch(symbol, 'GUIDANCE_AND_OUTLOOK')
   }

    async getQnASummary(symbol: string): Promise<string> {
      return this.fetch(symbol, 'QNA_SUMMARY')
   }

    async getStrategicUpdate(symbol: string): Promise<string> {
      return this.fetch(symbol, 'STRATEGIC_UPDATE')
   }

    async getSentimentAnalysis(symbol: string): Promise<string> {
      return this.fetch(symbol, 'SENTIMENT_ANALYSIS')
   }

    async fetch(symbol: string, type: string): Promise<string> {
      return axios
         .get<{ data: string }>(
            `${this.getBaseUrl()}/?symbol=${symbol}&type=${type}`
         )
         .then((result) => result.data.data)
   }

   protected  getBaseUrl(): string {
      return `${super.getBaseUrl()}/transcript`
   }
}

export default TranscriptClient
