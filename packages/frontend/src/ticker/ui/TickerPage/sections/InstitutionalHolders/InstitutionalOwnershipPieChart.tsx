import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {EChartOption} from 'echarts'
import {useOwnershipPercentages} from '../../../hooks/useOwnershipPercentages'
import {useEchart} from '../../../../../ui/chart/hooks/useEchart'
import {ShareholderHistory} from "../../../../../../../backend/src/shared-types/institutional-ownership";

interface Props {
   data: ShareholderHistory[]
}

export const InstitutionalOwnershipPieChart: React.FunctionComponent<Props> = ({
   data,
}: Props) => {
   const [ownershipPercentages, total] = useOwnershipPercentages(data)

   const options: EChartOption = {
      series: [
         {
            name: '姓名',
            type: 'pie',
            radius: '55%',
            center: ['60%', '50%'],
            label: {
               show: true,
            },
            data: [
               { name: 'Others', value: 100 - total },
               ...ownershipPercentages
                  .slice(0, 5)
                  .map(({ holder, outstandingPercent }) => ({
                     name: holder.holderName,
                     value: outstandingPercent,
                  })),
            ],
            emphasis: {
               itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
               },
            },
         },
      ],
   }

   const epsRef = useEchart(options)
   return (
      <Card>
         <CardContent>
            <div ref={epsRef} style={{ height: 400, width: '100%' }} />
         </CardContent>
      </Card>
   )
}
