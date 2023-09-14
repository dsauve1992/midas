import React from 'react'
import { MetricComparisonChart } from './MetricComparisonChart'
import { useEpsYearToYearPerformance } from '../../../hooks/useEpsYearToYearPerformance'

export interface Props {
   symbol: string
}

const YearToYearEpsComparisonChart: React.FunctionComponent<Props> = ({
   symbol,
}: Props) => {
   const comparisons = useEpsYearToYearPerformance({ symbol })

   return <MetricComparisonChart title="E.P.S" data={comparisons} />
}

export default YearToYearEpsComparisonChart
