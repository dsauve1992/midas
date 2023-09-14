import {
   Card,
   CardContent,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
} from '@mui/material'
import { ShareholderHistory } from '../../../../../api/ownership/type'
import { useOwnershipHistoryByInstitution } from '../../../hooks/useOwnershipHistoryByInstitution'
import { InstitutionalOwnershipHistoryByQuarterBarChart } from './InstitutionalOwnershipHistoryByQuarterBarChart'

interface Props {
   data: ShareholderHistory[]
}
export const InstitutionalOwnershipHistoryByShareholders = ({
   data,
}: Props) => {
   const historyByInstitution = useOwnershipHistoryByInstitution(data)

   console.log(historyByInstitution)

   return (
      <Card>
         <CardContent>
            <TableContainer component={Paper}>
               <Table size="small" stickyHeader aria-label="simple table">
                  <TableHead>
                     <TableRow>
                        <TableCell>Holder</TableCell>
                        <TableCell align="right">Ownership %</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {historyByInstitution.map((institutionHistory) => (
                        <TableRow
                           key={institutionHistory.holder.holderId}
                           sx={{
                              '&:last-child td, &:last-child th': {
                                 border: 0,
                              },
                           }}
                        >
                           <TableCell>
                              {institutionHistory.holder.holderName}
                           </TableCell>

                           <TableCell>
                              <InstitutionalOwnershipHistoryByQuarterBarChart
                                 data={institutionHistory.history
                                    .map((entry) => ({
                                       period: `${entry.holdingPeriod.year}-${entry.holdingPeriod.quarterOfYear}`,
                                       value: entry.sharesHeld,
                                    }))
                                    .reverse()}
                              />
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </TableContainer>
         </CardContent>
      </Card>
   )
}
