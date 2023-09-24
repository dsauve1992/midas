import { useEarningSurprisesComparison } from './hooks/useEarningSurprisesComparison'
import { EarningsSurprise } from '../../../../../api/financialModelingPrep/types'
import { MetricComparisonChart } from '../IncomeStatement/MetricComparisonChart'

type Props = {
   data: EarningsSurprise[]
}
export const EarningSurprisesChart = ({ data }: Props) => {
   const comparisons = useEarningSurprisesComparison(data, 10)

   return <MetricComparisonChart title="Earnings Suprises" data={comparisons} />
}