import React, {useCallback} from 'react'
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,} from '@mui/material'
import {mapArrayToHeatColor} from '../../../../../lib/utils/array.utils'
import EarningCallTranscript from './EarningCallTranscript'
import {QuarterlyIncomeStatementDto} from "../../../../../../../shared-types/income-statement";

export interface Props {
   symbol: string
   data: QuarterlyIncomeStatementDto[]
}

const IncomeStatementTable: React.FunctionComponent<Props> = ({
   symbol,
   data,
}: Props) => {
   const computeEpsColorValue = useCallback(
      (value: number) => {
         const color = mapArrayToHeatColor(
            (data as QuarterlyIncomeStatementDto[])
                .map((entry) => entry.earnings?.current)
                .filter((entry) => entry !== undefined) as number[]
         ).get(value as number)!
         return color?.toString() || 'default'
      },
      [data]
   )

   const computeRevenueColorValue = useCallback(
      (value: number) => {
         const color = mapArrayToHeatColor(
            (data as QuarterlyIncomeStatementDto[])
                .map(({ sales }) => sales?.current)
                .filter((entry) => entry !== undefined) as number[]
         ).get(value as number)!
         return color?.toString() || 'default'
      },
      [data]
   )

   return (
      <TableContainer component={Paper} sx={{ maxHeight: 800 }}>
         <Table stickyHeader>
            <TableHead>
               <TableRow>
                  <TableCell>Period</TableCell>
                  <TableCell align="right">Accepted Date</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">R. Growth</TableCell>
                  <TableCell align="right">E.P.S</TableCell>
                  <TableCell align="right">Eps Growth</TableCell>
                  <TableCell align="right">Net Profit Margin</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {data.map((row: QuarterlyIncomeStatementDto) => (
                  <TableRow
                     key={row.date}
                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                     <TableCell component="th" scope="row">
                        <span>
                           Q{row.quarter.quarterNumber} - {row.quarter.year}
                        </span>
                        <EarningCallTranscript
                           symbol={symbol}
                           year={row.quarter.year}
                           quarter={row.quarter.quarterNumber}
                        />
                     </TableCell>
                     <TableCell align="right">{row.acceptedDate}</TableCell>
                     <TableCell
                        align="right"
                        style={{ color: computeRevenueColorValue(row.sales?.current || 0) }}
                     >
                        {row.sales?.current.toFixed(2)}
                     </TableCell>
                     <TableCell align="right">
                        {row.sales?.growth?.toFixed(2)}
                     </TableCell>
                     <TableCell
                        align="right"
                        style={{ color: computeEpsColorValue(row.earnings?.current || 0) }}
                     >
                        {row.earnings?.current.toFixed(2)}
                     </TableCell>
                     <TableCell align="right">
                        {row.earnings?.growth?.toFixed(2)}
                     </TableCell>
                     <TableCell align="right">
                        {row.netProfitMargin?.toFixed(2)}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   )
}

export default IncomeStatementTable
