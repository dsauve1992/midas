import axios from 'axios'
import CloudFunctionApi from '../global/CloudFunctionApi'
import {
   AcquisitionHistoryDto,
   BuyEvent,
   SellEvent,
} from '../../acquisition/domain/type'

class AcquisitionsAPI extends CloudFunctionApi {
   private static readonly BASE_PATH = 'acquisitions'

   static async getAll(): Promise<AcquisitionHistoryDto[]> {
      return axios
         .get<AcquisitionHistoryDto[]>(this.getBaseUrl())
         .then((result) => result.data)
   }

   static async saveBuyEvent(
      event: Omit<BuyEvent, 'acquisitionId'>
   ): Promise<void> {
      return axios.post(`${this.getBaseUrl()}/buy`, { event })
   }

   static async saveSellEvent(event: SellEvent): Promise<void> {
      return axios.post(`${this.getBaseUrl()}/sell`, { event })
   }

   protected static getBaseUrl(): string {
      return super.buildUrl(this.BASE_PATH)
   }
}

export default AcquisitionsAPI
