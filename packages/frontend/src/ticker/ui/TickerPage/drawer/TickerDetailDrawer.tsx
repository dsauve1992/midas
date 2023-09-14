import * as React from 'react'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import Box from '@mui/material/Box'

const drawerWidth = 240

export default function PermanentDrawerLeft() {
   return (
      <Box>
         <Divider />
         <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
               <ListItem key={text} disablePadding>
                  <ListItemButton>
                     <ListItemIcon>
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                     </ListItemIcon>
                  </ListItemButton>
               </ListItem>
            ))}
         </List>
      </Box>
   )
}
