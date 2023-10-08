import {groupBy} from 'lodash'
import {Holder, ShareholderHistory} from "../../../../../shared-types/institutional-ownership";

export const useOwnershipHistoryByInstitution = (
   data: ShareholderHistory[]
): {
   holder: Holder
   history: Omit<
      ShareholderHistory,
      | 'holder'
      | 'securityId'
      | 'securityName'
      | 'ticker'
      | 'sector'
      | 'issuerThumbnailUrl'
   >[]
}[] => {
   const byInstitution = groupBy(data, 'holder.holderId')

   return Object.values(byInstitution).map((historyByInstitution) => ({
      holder: historyByInstitution[0].holder,
      history: historyByInstitution.map(
         ({
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            holder, securityId, securityName, ticker, sector, issuerThumbnailUrl,
            ...rest
         }) => ({ ...rest })
      ),
   }))
}
