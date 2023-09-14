import { Container } from '@mui/material'
import React from 'react'
import Box from '@mui/material/Box'
import Menu from '../Menu/Menu'
import Main from '../Main/Main'

const style = { marginTop: '50px' }
const Layout: React.FunctionComponent = () => (
   <Container disableGutters maxWidth={false}>
      <Menu />
      <Box style={style}>
         <Main />
      </Box>
   </Container>
)

export default Layout
