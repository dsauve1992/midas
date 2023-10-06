import React from 'react'
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
import {InsiderTradingEvent} from '../../../../../../../shared-types/financial-modeling-prep.d.ts'

export interface Props {
   events: InsiderTradingEvent[]
}

const InsiderActivityHistoryTable: React.FunctionComponent<Props> = ({
   events,
}: Props) => {
   return (
      <Card>
         <CardContent>
            {events?.length ? (
               <TableContainer component={Paper}>
                  <Table size="small" aria-label="simple table">
                     <TableHead>
                        <TableRow>
                           <TableCell>Reporting Name</TableCell>
                           <TableCell align="right">Relationship</TableCell>
                           <TableCell align="right">Transaction Date</TableCell>
                           <TableCell align="right">Cost</TableCell>
                           <TableCell align="right"># Shares</TableCell>
                           <TableCell align="right"># Shares Total</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {events.map((row: InsiderTradingEvent, index) => (
                           <TableRow
                              key={index}
                              sx={{
                                 '&:last-child td, &:last-child th': {
                                    border: 0,
                                 },
                              }}
                              style={{
                                 backgroundColor:
                                    row.transactionType === 'S-Sale'
                                       ? 'red'
                                       : 'green',
                              }}
                           >
                              <TableCell component="th" scope="row">
                                 {row.reportingName}
                              </TableCell>
                              <TableCell align="right">
                                 {row.typeOfOwner}
                              </TableCell>
                              <TableCell align="right">
                                 {row.transactionDate}
                              </TableCell>
                              <TableCell align="right">{row.price}</TableCell>
                              <TableCell align="right">
                                 {row.securitiesTransacted}
                              </TableCell>
                              <TableCell align="right">
                                 {row.securitiesOwned}
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>
            ) : (
               <p>No Insider Trading Data Available</p>
            )}
         </CardContent>
      </Card>
   )
}

export default InsiderActivityHistoryTable
