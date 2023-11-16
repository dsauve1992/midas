import {Container} from '@mui/material'
import React from 'react'
import Box from '@mui/material/Box'
import MidasMenu from '../Menu/MidasMenu.tsx'
import Main from '../Main/Main'

const style = { marginTop: '50px' }
const Layout: React.FunctionComponent = () => (
   <Container disableGutters maxWidth={false}>
      <MidasMenu />
      <Box style={style}>
         <Main />
      </Box>
   </Container>
)

export default Layout
