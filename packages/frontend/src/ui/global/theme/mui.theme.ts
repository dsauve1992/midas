import { createTheme } from '@mui/material'
import type { ThemeOptions } from '@mui/material/styles'

const darkTheme = createTheme({
   palette: {
      mode: 'dark',
      background: {
         default: '#525252',
         paper: 'rgba(52,52,52,1)',
      },
   },
   value: {
      positive: '#1d9600',
      negative: '#c00000',
   },
   components: {
      MuiTableCell: {
         styleOverrides: {
            root: {
               fontSize: '0.775rem',
            },
         },
      },
      MuiAccordion: {
         styleOverrides: {
            root: {
               backgroundColor: 'red',
            },
         },
      },
   },
} as ThemeOptions)

export type ThemeType = typeof darkTheme

export default darkTheme
