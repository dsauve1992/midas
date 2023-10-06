import React from 'react'
import {Avatar, Box, Button, Chip, Typography} from '@mui/material'
import DescriptionModal from './DescriptionModal'
import {StockGeneralInformationResponseDto} from "../../../../../../shared-types/response.dto";

export interface Props {
   profile: StockGeneralInformationResponseDto
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
