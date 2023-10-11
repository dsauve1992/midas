import React from 'react'
import {Card, CardContent} from '@mui/material'
import FinancialPeriod from '../../../../../lib/FinancialPeriod'
import IncomeStatementTable from './IncomeStatementTable'
import {useIncomeStatement} from '../../../hooks/useIncomeStatement.ts'
import {IncomeStatementChart} from './IncomeStatementChart'

export interface Props {
   symbol: string
   frequency: FinancialPeriod
}

const IncomeStatementArea: React.FunctionComponent<Props> = ({
   symbol,
   frequency,
}: Props) => {
   const { isLoading, data } = useIncomeStatement(symbol, frequency)

   if (isLoading) {
      return <p>Please wait...</p>
   }

   return data && data.length > 0 ? (
      <>
         <Card>
            <CardContent style={{ height: '400px' }}>
               <IncomeStatementChart symbol={symbol} frequency={frequency} />
            </CardContent>
         </Card>

         <br />
         <Card>
            <CardContent>
               <IncomeStatementTable data={data} />
            </CardContent>
         </Card>
      </>
   ) : (
      <p>There is no statement data for {symbol}</p>
   )
}

export default IncomeStatementArea
