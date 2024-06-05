import React, { useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  Backdrop,
  Box,
  Fade,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";

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
      <IconButton
        aria-label={"description"}
        size="small"
        onClick={() => setOpen(true)}
      >
        <DescriptionIcon />
      </IconButton>
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
