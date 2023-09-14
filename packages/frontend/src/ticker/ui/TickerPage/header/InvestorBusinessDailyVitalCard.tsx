import { Link } from 'react-router-dom'
import {
   Card,
   CardContent,
   Table,
   TableBody,
   TableCell,
   TableRow,
   Typography,
} from '@mui/material'
import { useIBDData } from '../../hooks/useIBDData'

type Props = {
   symbol: string
}

export const InvestorBusinessDailyVitalCard = ({ symbol }: Props) => {
   const { data: ibdData, isLoading: ibdDataLoading } = useIBDData(symbol)

   return ibdDataLoading ? null : (
      <Card sx={{ margin: '10px' }} raised>
         <CardContent>
            <Typography
               sx={{ fontSize: 14 }}
               color="text.secondary"
               gutterBottom
            >
               {`#${ibdData?.groupRanking} ${ibdData?.groupName} `}
            </Typography>
            <Table>
               <TableBody>
                  <TableRow
                     sx={{
                        '&:last-child td, &:last-child th': {
                           border: 0,
                        },
                     }}
                  >
                     <TableCell align="center">
                        <Typography sx={{ fontSize: 25 }}>
                           <div>{`${1}`}</div>
                           <div>
                              <Link
                                 href={`/ticker/${ibdData?.groupLeader}`}
                                 to={`/ticker/${ibdData?.groupLeader}`}
                              >{`${ibdData?.groupLeader}`}</Link>
                           </div>
                        </Typography>
                     </TableCell>
                     <TableCell align="center">
                        <Typography sx={{ fontSize: 15 }}>
                           <div>{`${ibdData?.rankInGroup}`}</div>
                           <div>{`${symbol}`}</div>
                        </Typography>
                     </TableCell>
                  </TableRow>
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   )
}
