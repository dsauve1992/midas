import { EChartOption } from 'echarts'
import { useEchart } from '../../../../../ui/chart/hooks/useEchart'

export type MetricComparison = {
   period: string | number
   current: number
   previous: number
   growth: number
}

type MetricComparisonChartProps = {
   title: string
   currentMetricLabel?: string
   previousMetricLabel?: string
   growthMetricLabel?: string
   data: MetricComparison[]
}

const style = { height: '100%', width: '100%' }
export const MetricComparisonChart = ({
   title,
   currentMetricLabel = 'Current',
   previousMetricLabel = 'Previous',
   growthMetricLabel = 'Growth',
   data,
}: MetricComparisonChartProps) => {
   const options: EChartOption = {
      title: {
         show: true,
         text: title,
      },
      tooltip: {
         trigger: 'axis',
         axisPointer: {
            type: 'cross',
         },
      },
      grid: {
         right: '20%',
      },
      toolbox: {
         feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
         },
      },
      legend: {
         data: [previousMetricLabel, currentMetricLabel, growthMetricLabel],
      },
      xAxis: [
         {
            type: 'category',
            axisTick: {
               alignWithLabel: true,
            },
            // prettier-ignore
            data: data.map((e) => e.period),
         },
      ],
      yAxis: [
         {
            type: 'value',
            name: title,
            position: 'right',
            show: true,
            splitLine: {
               show: false,
            },
         },
         {
            type: 'value',
            name: growthMetricLabel,
            position: 'left',
            axisLine: {
               show: false,
            },
         },
      ],
      series: [
         {
            name: previousMetricLabel,
            type: 'bar',
            data: data.map((e) => e.previous),
         },
         {
            name: currentMetricLabel,
            type: 'bar',
            data: data.map((e) => e.current),
         },
         {
            name: growthMetricLabel,
            type: 'line',
            yAxisIndex: 1,
            data: data.map((e) => e.growth),
            label: {
               show: true,
               fontWeight: 'bolder',
               formatter: ({ value }: { value: number }) => value.toFixed(1),
               color: '#545454',
               width: '250px',
               backgroundColor: '#00fe41',
               padding: 6,
               borderRadius: 100,
            },
         },
      ],
   }

   const epsRef = useEchart(options)

   return <div ref={epsRef} style={style} />
}
