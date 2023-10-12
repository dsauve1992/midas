import React from 'react'
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,} from '@mui/material'
import type {EarningsSurprise} from '../../../../../../../backend/src/shared-types/financial-modeling-prep.d.ts'

export interface Props {
   data: EarningsSurprise[]
}

const EarningsSurprisesTable: React.FunctionComponent<Props> = ({
   data,
}: Props) => (
   <TableContainer component={Paper} sx={{ maxHeight: 800 }}>
      <Table size="small" stickyHeader aria-label="simple table">
         <TableHead>
            <TableRow>
               <TableCell>Date</TableCell>
               <TableCell align="right">Estimated</TableCell>
               <TableCell align="right">Actual</TableCell>
            </TableRow>
         </TableHead>
         <TableBody>
            {data.map((row: EarningsSurprise) => (
               <TableRow
                  key={row.date}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
               >
                  <TableCell component="th" scope="row">
                     {row.date}
                  </TableCell>
                  <TableCell align="right">
                     {row.estimatedEarning.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                     {row.actualEarningResult.toFixed(2)}
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   </TableContainer>
)

export default EarningsSurprisesTable
