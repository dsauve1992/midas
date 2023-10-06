import {useQuery} from 'react-query'
import {StockProfile} from '../../../api/financialModelingPrep/types'
import {MidasBackendClient} from "../../../api/MidasBackendClient.ts";

export const useCompanyGeneralInformation = (symbol: string) =>
   useQuery<StockProfile>(
      ['company-general-information', { symbol }],
      () => MidasBackendClient.getCompanyGeneralInformation(symbol),
      { notifyOnChangeProps: 'tracked' }
   )
