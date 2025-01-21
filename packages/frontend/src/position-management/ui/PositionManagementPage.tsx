import { Box, Button, Modal } from "@mui/material";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { RiskManagementForm } from "../../tools/RiskManagementForm.tsx";

export interface Props {}

export const PositionManagementPage = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <Box display={"flex"} flexDirection={"column"} width={"100%"}>
      <Helmet>
        <title>Position Management - Midas</title>
      </Helmet>
      <Button onClick={() => setModalOpen(true)}>New</Button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <RiskManagementForm />
      </Modal>
    </Box>
  );
};
