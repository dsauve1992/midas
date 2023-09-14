import axios from 'axios'
import CloudFunctionApi from '../global/CloudFunctionApi'

class TranscriptAPI extends CloudFunctionApi {
   private static readonly BASE_PATH = 'transcript'

   static async getSummary(symbol: string): Promise<string> {
      return this.get(symbol, 'SUMMARY')
   }

   static async getHighLightAndTakeaway(symbol: string): Promise<string> {
      return this.get(symbol, 'HIGHLIGHT_AND_TAKEAWAY')
   }

   static async getGuidanceAndOutlook(symbol: string): Promise<string> {
      return this.get(symbol, 'GUIDANCE_AND_OUTLOOK')
   }

   static async getQnASummary(symbol: string): Promise<string> {
      return this.get(symbol, 'QNA_SUMMARY')
   }

   static async getStrategicUpdate(symbol: string): Promise<string> {
      return this.get(symbol, 'STRATEGIC_UPDATE')
   }

   static async getSentimentAnalysis(symbol: string): Promise<string> {
      return this.get(symbol, 'SENTIMENT_ANALYSIS')
   }

   static async get(symbol: string, type: string): Promise<string> {
      return axios
         .get<{ data: string }>(
            `${this.getBaseUrl()}/?symbol=${symbol}&type=${type}`
         )
         .then((result) => result.data.data)
   }

   protected static getBaseUrl(): string {
      return super.buildUrl(this.BASE_PATH)
   }
}

export default TranscriptAPI
