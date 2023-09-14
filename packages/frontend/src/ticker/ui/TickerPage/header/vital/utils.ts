import { green, red, yellow } from '@mui/material/colors'
import { VitalCardStatus } from './VitalCard'

export function statusColorMapper(status: VitalCardStatus): string {
   switch (status) {
      case VitalCardStatus.DANGER:
         return red[500]
      case VitalCardStatus.WARNING:
         return yellow[800]
      case VitalCardStatus.SAFE:
         return green[500]
      case VitalCardStatus.DEFAULT:
      default:
         return 'initial'
   }
}
