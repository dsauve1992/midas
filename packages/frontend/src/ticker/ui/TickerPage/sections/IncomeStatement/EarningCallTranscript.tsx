import React, { useState } from 'react'
import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material'
import { useEarningCallTranscript } from '../../../hooks/useEarningCallTranscript'

interface Props {
   symbol: string
   year: number
   quarter: number
}

const style = {
   position: 'absolute',
   top: '10%',
   left: '50%',
   transform: 'translate(-50%, -10%)',
   width: '90%',
   height: '90vh',
   whiteSpace: 'pre-wrap',
   overflowY: 'scroll',
   bgcolor: 'background.paper',
   border: '2px solid #000',
   boxShadow: 24,
   p: 4,
} as const

const EarningCallTranscript: React.FunctionComponent<Props> = ({
   symbol,
   year,
   quarter,
}: Props) => {
   const [open, setOpen] = useState<boolean>(false)

   const { data } = useEarningCallTranscript({
      symbol,
      year,
      quarter,
      enabled: open,
   })

   return (
      <>
         <Button size="small" onClick={() => setOpen(true)}>
            Transcript
         </Button>
         <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
               timeout: 1000,
            }}
         >
            <Fade in={open}>
               <Box sx={style}>
                  {data && data.length && (
                     <Typography>{data[0].content}</Typography>
                  )}
               </Box>
            </Fade>
         </Modal>
      </>
   )
}

export default EarningCallTranscript
