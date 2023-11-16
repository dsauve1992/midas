import React, { useState } from "react";
import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";

export interface Props {
  description: string;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
} as const;

const DescriptionModal: React.FunctionComponent<Props> = ({
  description,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        See description
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
            <Typography>{description}</Typography>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default DescriptionModal;
