import React, {useCallback} from 'react'
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,} from '@mui/material'
import {mapArrayToHeatColor} from '../../../../../lib/utils/array.utils'
import {IncomeStatement} from '../../../../../api/financialModelingPrep/types'
import {IncomeStatementWithGrowthAndNetProfitMargin} from '../../../hooks/useFinancialHistory'
import EarningCallTranscript from './EarningCallTranscript'

export interface Props {
   symbol: string
   data: IncomeStatementWithGrowthAndNetProfitMargin[]
}

const IncomeStatementTable: React.FunctionComponent<Props> = ({
   symbol,
   data,
}: Props) => {
   const computeEpsColorValue = useCallback(
      (value: number) => {
         const color = mapArrayToHeatColor(
            (data as IncomeStatement[]).map(({ eps }) => eps)
         ).get(value as number)!
         return color?.toString() || 'default'
      },
      [data]
   )

   const computeRevenueColorValue = useCallback(
      (value: number) => {
         const color = mapArrayToHeatColor(
            (data as IncomeStatement[]).map(({ revenue }) => revenue)
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
               {data.map((row: IncomeStatementWithGrowthAndNetProfitMargin) => (
                  <TableRow
                     key={row.date}
                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                     <TableCell component="th" scope="row">
                        <span>
                           {row.period} - {row.calendarYear}
                        </span>
                        <EarningCallTranscript
                           symbol={symbol}
                           year={parseInt(row.calendarYear!, 10)}
                           quarter={parseInt(row.period[1]!, 10)}
                        />
                     </TableCell>
                     <TableCell align="right">{row.acceptedDate}</TableCell>
                     <TableCell
                        align="right"
                        style={{ color: computeRevenueColorValue(row.revenue) }}
                     >
                        {row.revenue.toFixed(2)}
                     </TableCell>
                     <TableCell align="right">
                        {row.revenueGrowth.toFixed(2)}
                     </TableCell>
                     <TableCell
                        align="right"
                        style={{ color: computeEpsColorValue(row.eps) }}
                     >
                        {row.epsdiluted.toFixed(2)}
                     </TableCell>
                     <TableCell align="right">
                        {row.epsGrowth.toFixed(2)}
                     </TableCell>
                     <TableCell align="right">
                        {row.netProfitMargin.toFixed(2)}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   )
}

export default IncomeStatementTable
