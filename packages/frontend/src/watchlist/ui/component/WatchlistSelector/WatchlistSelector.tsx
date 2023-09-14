import { Button, ButtonGroup } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import AlarmOnIcon from '@mui/icons-material/AlarmOn'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'

type WatchlistSelectorProps = {
   value: WatchlistName | null
   onChange: (event: WatchlistName) => void
}

export enum WatchlistName {
   TRASH = 'TRASH',
   NEW = 'NEW',
   INCUBATOR = 'INCUBATOR',
   READY_TO_HATCH = 'READY_TO_HATCH',
   CURRENT_HOLDING = 'CURRENT_HOLDING',
}

const buttonGroupConfig = [
   { value: WatchlistName.CURRENT_HOLDING, icon: <RocketLaunchIcon /> },
   { value: WatchlistName.READY_TO_HATCH, icon: <AlarmOnIcon /> },
   { value: WatchlistName.INCUBATOR, icon: <HourglassTopIcon /> },
   { value: WatchlistName.TRASH, icon: <DeleteIcon /> },
]

export const WatchlistSelector = ({
   value,
   onChange,
}: WatchlistSelectorProps) => {
   return (
      <ButtonGroup
         variant="text"
         color="inherit"
         aria-label="small text button group"
      >
         {buttonGroupConfig.map((el) => (
            <Button
               key={el.value}
               color={value === el.value ? 'primary' : 'inherit'}
               onClick={() => {
                  if (value !== el.value) {
                     onChange(el.value)
                  }
               }}
            >
               {el.icon}
            </Button>
         ))}
      </ButtonGroup>
   )
}
