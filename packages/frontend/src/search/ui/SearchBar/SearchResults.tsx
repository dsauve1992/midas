import React from 'react'
import { styled } from '@mui/material/styles'
import { List, ListItem } from '@mui/material'
import { SearchResult } from '../../../api/financialModelingPrep/types'

const Root = styled('div')(({ theme }) => ({
   position: 'absolute',
   borderRadius: theme.shape.borderRadius,
   backgroundColor: theme.palette.grey[800],
   left: 0,
   right: 0,
}))

interface Props {
   results?: SearchResult[]
   onSelect: (result: SearchResult) => void
}

export const SearchResults = ({ results, onSelect }: Props) => {
   return results?.length ? (
      <Root>
         <List>
            {results.map((entry) => (
               <ListItem
                  key={entry.symbol}
                  divider
                  onClick={() => onSelect(entry)}
               >
                  {entry.symbol} {entry.name}
               </ListItem>
            ))}
         </List>
      </Root>
   ) : null
}
