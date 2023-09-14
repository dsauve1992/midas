import React from 'react'

interface Props {
   symbol: string
   timeframe?: 'd' | 'w'
   quality?: 'm' | 'l'
}

export const TapeCard: React.FunctionComponent<Props> = ({
   symbol,
   timeframe = 'd',
   quality = 'l',
}: Props) => {
    

   const dailySma =
      'o[0][ot]=sma&o[0][op]=50&o[0][oc]=ffd966&o[1][ot]=sma&o[1][op]=150&o[1][oc]=7eb500&o[2][ot]=sma&o[2][op]=200&o[2][oc]=6a329f'
   const weeklySma =
      'o[0][ot]=sma&o[0][op]=10&o[0][oc]=ffd966&o[1][ot]=sma&o[1][op]=30&o[1][oc]=7eb500&o[2][ot]=sma&o[2][op]=40&o[2][oc]=6a329f'

   const url = `https://charts2-node.finviz.com/chart.ashx?tm=d&cs=${quality}&t=${symbol}&tf=${timeframe}&${
      timeframe === 'd' ? dailySma : weeklySma
   }&ct=candle_stick&o[3][ot]=patterns&o[3][op]=`

   return <img src={url} key={symbol} width="100%" alt="" />
}

export default TapeCard
