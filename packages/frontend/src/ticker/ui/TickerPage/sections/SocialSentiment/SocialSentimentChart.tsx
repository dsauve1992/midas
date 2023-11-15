import React from 'react'
import {EChartOption} from 'echarts'
import {useEchart} from '../../../../../ui/chart/hooks/useEchart'
import type {SocialSentiment} from 'backend/src/shared-types/financial-modeling-prep'
import {useSocialSentimentParsedData} from './useSocialSentimentParsedData'

export interface Props {
   data: SocialSentiment[]
}

const style = { height: '100%', width: '100%' }

export const SocialSentimentChart: React.FunctionComponent<Props> = ({
   data,
}: Props) => {
   const [historic, sma] = useSocialSentimentParsedData(data)

   const options: EChartOption = {
      title: {
         show: true,
         text: 'Social Sentiment',
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
         data: ['Social sentiment', '30 sma'],
      },
      xAxis: [
         {
            type: 'category',
            axisTick: {
               alignWithLabel: true,
            },
            // prettier-ignore
            data: historic.map((e) => e.date),
         },
      ],
      yAxis: [
         {
            type: 'value',
            name: 'sentiment',
            position: 'right',
            show: true,
            splitLine: {
               show: false,
            },
         },
      ],
      series: [
         {
            name: 'Sentiment',
            type: 'bar',
            data: historic.map((e) => e.value!),
         },
         {
            name: '30 Day SMA',
            type: 'line',
            data: sma.map((e) => e.value!),
         },
      ],
   }

   const epsRef = useEchart(options)

   return <div ref={epsRef} style={style} />
}
