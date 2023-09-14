import React from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import { makeStyles } from '@mui/styles'
import { green, red } from '@mui/material/colors'

const useStyles = makeStyles({
   spec: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
   },
   specIncrease: {
      color: green[500],
   },
   specDecrease: {
      color: red[500],
   },
})

interface Props {
   growth: number
}

export const SpecificationGrowth: React.FunctionComponent<Props> = ({
   growth,
}: Props) => {
   const classes = useStyles()

   return (
      <div className={classes.spec}>
         <div>
            {growth > 0 && <TrendingUpIcon className={classes.specIncrease} />}
            {growth < 0 && (
               <TrendingDownIcon className={classes.specDecrease} />
            )}
            {growth === 0 && <TrendingFlatIcon />}
         </div>
         <div>{growth.toFixed(2)} %</div>
      </div>
   )
}
