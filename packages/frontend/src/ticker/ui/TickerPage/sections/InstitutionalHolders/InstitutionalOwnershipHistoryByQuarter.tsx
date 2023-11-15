import {Card, CardContent} from '@mui/material'
import {useMemo} from 'react'
import {useOwnershipHistoryByQuarter} from '../../../hooks/useOwnershipHistoryByQuarter'
import {
    InstitutionalOwnershipHistoryByQuarterBarChart,
    InstitutionalOwnershipHistoryByQuarterDataEntry,
} from './InstitutionalOwnershipHistoryByQuarterBarChart'
import {AggregateHolding} from "backend/src/shared-types/institutional-ownership";

interface Props {
   history: AggregateHolding[]
}
export const InstitutionalOwnershipHistoryByQuarter = ({ history }: Props) => {
   const quarters = useOwnershipHistoryByQuarter(history)

   const chartData: InstitutionalOwnershipHistoryByQuarterDataEntry[] = useMemo(
      () =>
         quarters.map(({ periodString, sharesHeld }) => ({
            period: periodString,
            value: sharesHeld,
         })),
      [quarters]
   )

   return (
      <Card>
         <CardContent>
            <InstitutionalOwnershipHistoryByQuarterBarChart data={chartData} />
         </CardContent>
      </Card>
   )
}
