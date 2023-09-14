import { Card, CardContent, Chip, Typography } from '@mui/material'

import { Link } from 'react-router-dom'

type TickerWatcherCardProps = {
   symbol: string
   price: number
   variation: number
}

export const TickerWatcherCard = ({
   symbol,
   price,
   variation,
}: TickerWatcherCardProps) => {
   return (
      <Card style={{ width: '100%' }}>
         <CardContent>
            <Typography variant="h5">
               <Link href={`/ticker/${symbol}`} to={`/ticker/${symbol}`}>
                  {symbol}
               </Link>
            </Typography>
            <Typography variant="h5">{price}</Typography>
            <Chip
               label={
                  <Typography variant="h6">{variation.toFixed(2)}%</Typography>
               }
               style={{
                  backgroundColor: variation < 0 ? '#ff4b00' : '#1d9600',
               }}
            />
         </CardContent>
      </Card>
   )
}
