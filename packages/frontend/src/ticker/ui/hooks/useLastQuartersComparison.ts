import {useMemo} from 'react'
import {MetricComparison} from '../TickerPage/sections/IncomeStatement/MetricComparisonChart'
import {QuarterlyIncomeStatementDto} from "../../../../../shared-types/income-statement";

export enum StatementSpec {
   EPS,
   REVENUE,
}

export type StatementSpecQuarterHistory = {
   [StatementSpec.EPS]: MetricComparison[]
   [StatementSpec.REVENUE]: MetricComparison[]
}

export const useLastQuartersComparison = (
   data?: QuarterlyIncomeStatementDto[]
): StatementSpecQuarterHistory => {

   return useMemo<StatementSpecQuarterHistory>(() => {
      const lastQuarters = (data?? []).slice(0, 4);


      return {
         [StatementSpec.EPS]: lastQuarters.map(({quarter, earnings}) => ({
            period: `Q${quarter.quarterNumber}`,
            ...earnings
         })).reverse(),
         [StatementSpec.REVENUE]: lastQuarters.map(({quarter, sales}) => ({
            period: `Q${quarter.quarterNumber}`,
            ...sales
         })).reverse(),
      }
   }, [data])
}
