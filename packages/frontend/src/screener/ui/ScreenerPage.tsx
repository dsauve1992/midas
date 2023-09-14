import React, { useMemo, useState } from 'react'
import { Box, List, ListItemButton, ListItemText } from '@mui/material'
import { useTradingViewScreener } from './hooks/useTradingViewScreener'
import { useKeyPress } from '../../ui/utils/hooks/useKeyPress'
import { ScreenerEntryCard } from './ScreenerEntryCard'

export interface Props {}

export const ScreenerPage: React.FunctionComponent<Props> = () => {
   const { data, isLoading } = useTradingViewScreener()
   const [selectedSymbolIndex, setSelectedSymbolIndex] = useState<number>(0)

   const selectedSymbol = useMemo(
      () => data?.[selectedSymbolIndex],
      [data, selectedSymbolIndex]
   )

   useKeyPress('ArrowRight', () => {
      setSelectedSymbolIndex((current) =>
         Math.min(current + 1, data?.length || 0)
      )
   })

   useKeyPress('ArrowLeft', () => {
      setSelectedSymbolIndex((current) => Math.max(current - 1, 0))
   })

   if (isLoading) {
      return <p>Loading...</p>
   }

   if (selectedSymbol && data) {
      return (
         <Box display="flex" flexDirection="row">
            <List sx={{ height: '50px' }}>
               {data.map((el, index) => (
                  <ListItemButton key={el}>
                     <ListItemText
                        primary={el}
                        onClick={() => setSelectedSymbolIndex(index)}
                     />
                  </ListItemButton>
               ))}
            </List>
            <div style={{ width: '100%' }}>
               <ScreenerEntryCard symbol={selectedSymbol} />
            </div>
         </Box>
      )
   }

   return null
}

export default ScreenerPage
