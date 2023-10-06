import React from 'react'
import {Chip} from '@mui/material'
import {StockGeneralInformationResponseDto} from "../../../../../../shared-types/response.dto";

export interface Props {
   profile: StockGeneralInformationResponseDto
}

const TickerFamily: React.FunctionComponent<Props> = ({ profile }: Props) => (
   <div style={{ padding: '15px' }}>
      <Chip label={profile!.sector} style={{ marginRight: '10px' }} />
      <Chip label={profile!.industry} />
   </div>
)

export default TickerFamily
