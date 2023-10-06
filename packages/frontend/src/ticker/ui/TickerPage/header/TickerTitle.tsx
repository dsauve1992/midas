import React from 'react'
import {Avatar, Box, Button, Chip, Typography} from '@mui/material'
import {StockProfile} from '../../../../../../shared-types/financial-modeling-prep.d.ts'
import DescriptionModal from './DescriptionModal'

export interface Props {
   profile: StockProfile
}

const TickerTitle: React.FunctionComponent<Props> = ({ profile }: Props) => {
   return (
      <Box display="flex" flexDirection="row" alignItems="center">
         <Avatar
            src={profile.image}
            variant="square"
            sx={{ width: 80, height: 80 }}
            style={{ marginRight: '20px' }}
         />
         <div>
            <Typography variant="h4">
               {profile.companyName} ({profile.symbol}){' '}
               <Chip label={profile.exchangeShortName} />
            </Typography>
            <DescriptionModal description={profile.description} />
            <Button href={`https://finance.yahoo.com/chart/${profile.symbol}`}>
               Yahoo
            </Button>
         </div>
      </Box>
   )
}

export default TickerTitle
