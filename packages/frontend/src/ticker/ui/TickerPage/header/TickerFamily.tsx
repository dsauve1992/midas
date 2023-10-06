import React from 'react'
import {Chip} from '@mui/material'
import {StockProfile} from '../../../../../../shared-types/financial-modeling-prep.d.ts'

export interface Props {
   profile: StockProfile
}

const TickerFamily: React.FunctionComponent<Props> = ({ profile }: Props) => (
   <div style={{ padding: '15px' }}>
      <Chip label={profile!.sector} style={{ marginRight: '10px' }} />
      <Chip label={profile!.industry} />
   </div>
)

export default TickerFamily
