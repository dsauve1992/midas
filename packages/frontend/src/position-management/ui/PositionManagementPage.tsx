import { Box, Button } from "@mui/material";
import { Helmet } from "react-helmet";
import { useGetPositions } from "../hooks/useGetPositions.ts";
import { PositionCardsView } from "./view/PositionCardsView.tsx";
import { CreatePositionForm } from "./component/CreatePositionForm.tsx";
import { useState } from "react";
import { PageLayout } from "../../lib/ui/global/PageLayout.tsx";
import Drawer from "@mui/material/Drawer";
import { PositionModelDto } from "backend/src/shared-types/position";

export const PositionManagementPage = () => {
  const { data } = useGetPositions();
  const [openCreatePositionFormDrawer, setOpenCreatePositionFormDrawer] =
    useState(false);
  const [openPositionDetailDrawer, setOpenPositionDetailDrawer] =
    useState(false);

  const handleCloseCreatePositionFormDrawer = () => {
    setOpenCreatePositionFormDrawer(!openCreatePositionFormDrawer);
  };

  const handleClosePositionDetailDrawer = () => {
    setOpenPositionDetailDrawer(!openPositionDetailDrawer);
  };

  const handleSelectPosition = (position: PositionModelDto) => {
    console.log(position);
    setOpenPositionDetailDrawer(true);
  };

  return (
    <>
      <Helmet>
        <title>Position Management - Midas</title>
      </Helmet>
      <PageLayout>
        <Button
          variant="contained"
          onClick={() => setOpenCreatePositionFormDrawer(true)}
        >
          Create New Position
        </Button>

        <PositionCardsView
          positions={data}
          onSelectPosition={handleSelectPosition}
        />

        <Drawer
          test-id={"create-position-form-drawer"}
          anchor={"right"}
          open={openCreatePositionFormDrawer}
          onClose={handleCloseCreatePositionFormDrawer}
        >
          <Box minWidth={1600} height={"100%"}>
            <CreatePositionForm
              onSuccess={handleCloseCreatePositionFormDrawer}
            />
          </Box>
        </Drawer>

        <Drawer
          test-id={"position-detail-drawer"}
          anchor={"right"}
          open={openPositionDetailDrawer}
          onClose={handleClosePositionDetailDrawer}
        >
          <Box minWidth={800} height={"100%"}>
            lorem40
          </Box>
        </Drawer>
      </PageLayout>
    </>
  );
};
