import { Box, Button } from "@mui/material";
import { Helmet } from "react-helmet";
import { useGetPositions } from "../hooks/useGetPositions.ts";
import { PositionCardsView } from "./view/PositionCardsView.tsx";
import { CreatePositionForm } from "./component/CreatePositionForm.tsx";
import { useState } from "react";
import { PageLayout } from "../../lib/ui/global/PageLayout.tsx";
import Drawer from "@mui/material/Drawer";

export const PositionManagementPage = () => {
  const { data } = useGetPositions();
  const [open, setOpen] = useState(false);

  const handleCloseDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Helmet>
        <title>Position Management - Midas</title>
      </Helmet>
      <PageLayout>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create New Position
        </Button>

        <PositionCardsView positions={data} />

        <Drawer anchor={"right"} open={open} onClose={handleCloseDrawer}>
          <Box minWidth={1600} height={"100%"}>
            <CreatePositionForm onSuccess={handleCloseDrawer} />
          </Box>
        </Drawer>
      </PageLayout>
    </>
  );
};
